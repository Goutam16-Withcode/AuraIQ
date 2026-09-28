"""
FastAPI Server for Text Emotion & Intent Classification with Cognitive Explainability.
"""

from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

from ml_engine import analyze_text, analyze_narrative_flow, EMOTION_META, INTENT_DEFINITIONS

app = FastAPI(
    title="Advanced Text Emotion & Intent Classification API",
    description="Deep Learning Transformer Inference with Linguistic Saliency, Intent Detection, and Psychological Affect Coordinates.",
    version="2.0.0"
)

# Enable CORS for Next.js frontend (default port 3000) and any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextRequest(BaseModel):
    text: str = Field(..., example="I finally achieved my dream job after months of persistent effort!")


class BatchRequest(BaseModel):
    texts: List[str] = Field(..., example=["I love this project", "This is so frustrating", "I am worried about tomorrow"])


@app.get("/api/health")
def health_check():
    """Service status and capabilities."""
    return {
        "status": "healthy",
        "service": "Text-Emotion-Classification-API",
        "version": "2.0.0",
        "supported_emotions": list(EMOTION_META.keys()),
        "supported_intents": list(INTENT_DEFINITIONS.keys())
    }


@app.get("/api/emotions-info")
def emotions_info():
    """Retrieve metadata about supported emotions and intents."""
    return {
        "emotions": EMOTION_META,
        "intents": INTENT_DEFINITIONS
    }


@app.post("/api/predict")
def predict_endpoint(req: TextRequest):
    """Predict emotion, detect intent, and provide cognitive explanation."""
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")
    try:
        result = analyze_text(req.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


@app.post("/api/analyze-flow")
def flow_endpoint(req: TextRequest):
    """Analyze sentence-by-sentence narrative emotion and intent trajectory."""
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")
    try:
        flow = analyze_narrative_flow(req.text)
        return {"flow": flow, "total_sentences": len(flow)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Flow analysis error: {str(e)}")


@app.post("/api/batch")
def batch_endpoint(req: BatchRequest):
    """Process multiple texts in batch."""
    if not req.texts:
        raise HTTPException(status_code=400, detail="Texts list cannot be empty.")
    
    results = []
    emotion_counts = {k: 0 for k in EMOTION_META.keys()}
    
    for t in req.texts:
        if not t.strip():
            continue
        res = analyze_text(t)
        emotion_counts[res["dominant_emotion"]] += 1
        results.append({
            "text": t,
            "dominant_emotion": res["dominant_emotion"],
            "dominant_label": res["dominant_label"],
            "emoji": res["emoji"],
            "confidence": res["confidence"],
            "intent": res["intent"]["name"],
            "intent_badge": res["intent"]["badge"]
        })

    return {
        "results": results,
        "total_processed": len(results),
        "emotion_distribution": emotion_counts
    }


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
