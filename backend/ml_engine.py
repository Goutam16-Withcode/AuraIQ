"""
Advanced ML Engine for Emotion Classification, Intent Detection & Cognitive Explanation.
Combines Deep Transformer Inference with Linguistic Saliency & Affect Modeling.
"""

import re
import math
from typing import List, Dict, Any, Optional
import torch

# Global model cache
_PIPELINE = None
_DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Emotion Metadata & Valence-Arousal Mapping (Russell's Circumplex Model)
EMOTION_META = {
    "joy": {
        "label": "Joy",
        "emoji": "😊",
        "color": "#F59E0B",
        "description": "State of happiness, satisfaction, delight, or triumph.",
        "valence": 0.85,
        "arousal": 0.70,
        "dominance": 0.75,
    },
    "love": {
        "label": "Love",
        "emoji": "❤️",
        "color": "#EC4899",
        "description": "Deep affection, emotional warmth, intimacy, or strong fondness.",
        "valence": 0.90,
        "arousal": 0.60,
        "dominance": 0.65,
    },
    "sadness": {
        "label": "Sadness",
        "emoji": "😢",
        "color": "#3B82F6",
        "description": "Grief, despair, disappointment, loneliness, or sorrow.",
        "valence": -0.80,
        "arousal": 0.25,
        "dominance": 0.20,
    },
    "anger": {
        "label": "Anger",
        "emoji": "😠",
        "color": "#EF4444",
        "description": "Hostility, frustration, indignation, or rage against an obstacle.",
        "valence": -0.75,
        "arousal": 0.85,
        "dominance": 0.80,
    },
    "fear": {
        "label": "Fear",
        "emoji": "😨",
        "color": "#8B5CF6",
        "description": "Apprehension, anxiety, terror, or acute vulnerability.",
        "valence": -0.70,
        "arousal": 0.80,
        "dominance": 0.25,
    },
    "surprise": {
        "label": "Surprise",
        "emoji": "😲",
        "color": "#14B8A6",
        "description": "Astonishment, sudden discovery, bewilderment, or novelty.",
        "valence": 0.20,
        "arousal": 0.85,
        "dominance": 0.50,
    },
    "neutral": {
        "label": "Neutral",
        "emoji": "😐",
        "color": "#64748B",
        "description": "Objective, balanced, matter-of-fact, or emotionless.",
        "valence": 0.0,
        "arousal": 0.20,
        "dominance": 0.50,
    },
}

INTENT_DEFINITIONS = {
    "seeking_support": {
        "name": "Seeking Support & Validation",
        "badge": "🤝 Support Seeking",
        "description": "The speaker is sharing vulnerability or pain, inviting empathy, reassurance, or practical guidance.",
        "signals": ["feel hopeless", "lonely", "help me", "dont know what to do", "sad", "burdened", "alone", "crying", "lost"],
    },
    "venting_frustration": {
        "name": "Venting Frustration",
        "badge": "😤 Cathartic Venting",
        "description": "The speaker is releasing built-up tension or anger regarding unfairness, friction, or dissatisfaction.",
        "signals": ["angry", "pissed", "hate", "terrible", "fed up", "ridiculous", "worst", "sick of", "annoyed", "unfair"],
    },
    "expressing_gratitude": {
        "name": "Expressing Gratitude & Appreciation",
        "badge": "🙏 Gratitude",
        "description": "Acknowledging positive contributions, support received, or deep appreciation towards someone or life.",
        "signals": ["thank", "grateful", "appreciate", "blessed", "kindness", "helped me", "thanks"],
    },
    "celebrating_achievement": {
        "name": "Celebrating Triumph / Good News",
        "badge": "🎉 Celebration",
        "description": "Sharing milestones, personal breakthroughs, proud victories, or positive events with enthusiasm.",
        "signals": ["finally", "won", "passed", "promoted", "ecstatic", "proud", "excited", "achievement", "success", "celebrate"],
    },
    "bonding_affection": {
        "name": "Deepening Interpersonal Affection",
        "badge": "💖 Affection & Bonding",
        "description": "Reinforcing emotional closeness, romance, warmth, loyalty, or tender bonds with the listener.",
        "signals": ["love you", "cherish", "adore", "miss you", "dearest", "warmth", "special to me", "darling"],
    },
    "seeking_clarification": {
        "name": "Seeking Clarification or Reason",
        "badge": "❓ Inquiring / Seeking Reason",
        "description": "Posing questions or expressing bewilderment to understand underlying reasons or ambiguous situations.",
        "signals": ["why", "how come", "confused", "dont understand", "wondering", "what if", "curious"],
    },
    "warning_anxiety": {
        "name": "Warning / Expressing Caution",
        "badge": "⚠️ Caution / Apprehension",
        "description": "Flagging impending danger, unease, insecurity, or alerting others to potential risks.",
        "signals": ["careful", "scared", "worried", "danger", "risky", "afraid", "nervous", "anxious", "threat"],
    },
    "informative_statement": {
        "name": "Sharing Information / Fact",
        "badge": "ℹ️ Objective Sharing",
        "description": "Stating descriptive facts, schedules, neutral observations, or informational context without emotional charge.",
        "signals": ["is", "are", "at", "time", "scheduled", "number", "data", "report", "fact", "located"],
    },
}

# Emotion Lexicon for fallback and word attribution saliency
EMOTION_KEYWORDS = {
    "joy": ["happy", "ecstatic", "delighted", "glad", "thrilled", "joy", "excited", "wonderful", "great", "smiling", "blessed", "radiant", "fun", "pleasure", "proud", "celebrating"],
    "love": ["love", "loving", "adore", "cherish", "caring", "beloved", "romantic", "fond", "intimate", "tender", "affection", "sweetheart", "darling", "treasured"],
    "sadness": ["sad", "depressed", "hopeless", "lonely", "grief", "cry", "crying", "miserable", "broken", "unhappy", "sorrow", "tear", "gloomy", "pathetic", "burdensome", "heartbroken"],
    "anger": ["angry", "rage", "mad", "furious", "hate", "irritated", "pissed", "annoyed", "grouchy", "greedy", "disgusted", "offensive", "resentful", "hostile", "outraged"],
    "fear": ["scared", "fear", "terrified", "anxious", "panic", "worried", "nervous", "dread", "frightened", "horrified", "vulnerable", "threatened", "paralyzed"],
    "surprise": ["surprised", "shocked", "amazed", "astonished", "stunned", "unexpected", "wonder", "jaw-dropping", "unbelievable", "baffled", "novelty"]
}


def get_transformer_pipeline():
    """Lazily load Hugging Face emotion classifier pipeline."""
    global _PIPELINE
    if _PIPELINE is None:
        try:
            from transformers import pipeline
            _PIPELINE = pipeline(
                "text-classification",
                model="bhadresh-psavani/distilbert-base-uncased-emotion",
                top_k=None,
                device=0 if torch.cuda.is_available() else -1
            )
            print(f"[ML Engine] Loaded Transformer on device: {_DEVICE}")
        except Exception as e:
            print(f"[ML Engine] Notice: Transformer pipeline fallback activated ({e})")
            _PIPELINE = "FALLBACK"
    return _PIPELINE


def compute_heuristic_scores(text: str) -> Dict[str, float]:
    """Lightweight rule-enhanced contextual distribution."""
    text_lower = text.lower()
    words = re.findall(r"\b\w+\b", text_lower)
    counts = {emo: 0.05 for emo in EMOTION_META.keys()}  # Small Dirichlet prior

    # Neutral indicator heuristics
    neutral_triggers = ["is", "are", "it is", "this is", "the", "that", "fact", "scheduled", "meeting", "document"]
    is_objective = len(words) > 2 and not any(w in words for emo_list in EMOTION_KEYWORDS.values() for w in emo_list)
    if is_objective:
        counts["neutral"] += 1.5

    for word in words:
        for emo, kws in EMOTION_KEYWORDS.items():
            if word in kws:
                counts[emo] += 1.8

    # Special pattern adjustments
    if "love" in text_lower or "adore" in text_lower:
        counts["love"] += 2.0
    if "angry" in text_lower or "furious" in text_lower or "pissed" in text_lower:
        counts["anger"] += 2.0
    if "scared" in text_lower or "afraid" in text_lower or "fear" in text_lower:
        counts["fear"] += 2.0
    if "surprised" in text_lower or "amazed" in text_lower or "shocked" in text_lower:
        counts["surprise"] += 2.0
    if "sad" in text_lower or "depressed" in text_lower or "lonely" in text_lower:
        counts["sadness"] += 2.0
    if "happy" in text_lower or "joy" in text_lower or "ecstatic" in text_lower:
        counts["joy"] += 2.0

    total = sum(counts.values())
    return {k: v / total for k, v in counts.items()}


def predict_emotions(text: str) -> Dict[str, float]:
    """Predict emotion distribution across 7 emotions (6 primary + neutral)."""
    text_clean = text.strip()
    if not text_clean:
        return {k: (1.0 if k == "neutral" else 0.0) for k in EMOTION_META.keys()}

    pipe = get_transformer_pipeline()
    
    if pipe != "FALLBACK" and pipe is not None:
        try:
            preds = pipe(text_clean)[0]
            scores = {p["label"].lower(): float(p["score"]) for p in preds}
            
            # Calibrate for neutral detection
            max_score = max(scores.values()) if scores else 0
            if max_score < 0.40 or len(re.findall(r"\b\w+\b", text_clean)) <= 2:
                scores["neutral"] = 0.50
            else:
                scores["neutral"] = 0.04
                
            # Normalize so sum is 1.0
            total = sum(scores.values())
            normalized = {k: round(scores.get(k, 0.01) / total, 4) for k in EMOTION_META.keys()}
            return normalized
        except Exception as e:
            print(f"[ML Engine] Inference error, using heuristic: {e}")

    return compute_heuristic_scores(text_clean)


def detect_intent(text: str, dominant_emotion: str) -> Dict[str, Any]:
    """Detect communicative intent behind the statement."""
    text_lower = text.lower()
    intent_scores = {}

    for intent_key, meta in INTENT_DEFINITIONS.items():
        score = 0.1
        for sig in meta["signals"]:
            if sig in text_lower:
                score += 1.2
        intent_scores[intent_key] = score

    # Synergize with emotion
    if dominant_emotion in ["sadness", "fear"]:
        intent_scores["seeking_support"] += 0.9
        intent_scores["warning_anxiety"] += 0.6
    elif dominant_emotion == "anger":
        intent_scores["venting_frustration"] += 1.4
    elif dominant_emotion == "joy":
        intent_scores["celebrating_achievement"] += 1.2
    elif dominant_emotion == "love":
        intent_scores["bonding_affection"] += 1.5
    elif dominant_emotion == "neutral":
        intent_scores["informative_statement"] += 1.5

    best_intent_key = max(intent_scores, key=intent_scores.get)
    best_intent = INTENT_DEFINITIONS[best_intent_key]

    return {
        "intent_key": best_intent_key,
        "name": best_intent["name"],
        "badge": best_intent["badge"],
        "description": best_intent["description"],
        "confidence": round(min(0.98, max(0.55, intent_scores[best_intent_key] / (sum(intent_scores.values()) + 1e-6) * 2.2)), 2),
    }


def compute_word_saliency(text: str, dominant_emotion: str) -> List[Dict[str, Any]]:
    """Compute word-level contribution attribution scores (0.0 to 1.0) for visual highlighting."""
    words = re.findall(r"\S+", text)
    if not words:
        return []

    saliency_list = []
    kws = set(EMOTION_KEYWORDS.get(dominant_emotion, []))

    for word in words:
        clean_w = re.sub(r"[^\w]", "", word.lower())
        weight = 0.08  # Baseline attribution
        
        if clean_w in kws:
            weight = 0.95
        elif any(root in clean_w for root in ["feel", "am", "very", "so", "really", "cant", "wont", "never", "always"]):
            weight = 0.45
        elif len(clean_w) > 4:
            weight = 0.20

        saliency_list.append({
            "word": word,
            "weight": round(weight, 2),
            "is_key_driver": weight > 0.50
        })

    return saliency_list


def generate_explanation(text: str, dominant_emotion: str, intent: Dict[str, Any], confidence: float) -> Dict[str, Any]:
    """Generate in-depth cognitive reasoning and linguistic breakdown."""
    emo_info = EMOTION_META.get(dominant_emotion, EMOTION_META["neutral"])
    
    # Analyze syntactic and tonal cues
    has_exclamation = "!" in text
    has_question = "?" in text
    first_person = bool(re.search(r"\b(i|me|my|myself|we|us|our)\b", text, re.IGNORECASE))
    
    tone_markers = []
    if first_person:
        tone_markers.append("Personal First-Person Perspective (Subjective Appraisal)")
    else:
        tone_markers.append("Third-Person / Detached Tone")
        
    if has_exclamation:
        tone_markers.append("High Emotional Exclamation / Urgency")
    if has_question:
        tone_markers.append("Interrogative / Inquisitive Structure")

    # Generate synthesized reasoning summary
    if dominant_emotion == "neutral":
        reasoning = (
            f"The input maintains a balanced and declarative register. "
            f"It lacks strong affective polarities or affective lexicon, "
            f"which aligns with the intent '{intent['name']}'."
        )
    else:
        reasoning = (
            f"The text exhibits high cognitive activation aligned with {emo_info['label']} ({round(confidence * 100, 1)}% confidence). "
            f"Linguistic cues reflect the pragmatic intent '{intent['name']}'. "
            f"The psychological framing indicates {emo_info['description'].lower()}"
        )

    cognitive_appraisal = {
        "pleasantness": "High" if emo_info["valence"] > 0.3 else ("Low" if emo_info["valence"] < -0.3 else "Neutral"),
        "activation_energy": "Intense" if emo_info["arousal"] > 0.65 else ("Moderate" if emo_info["arousal"] > 0.35 else "Subdued"),
        "control_perception": "In Control (Internal Agency)" if emo_info["dominance"] > 0.55 else "Reactive / Vulnerable (External Agency)",
    }

    return {
        "reasoning": reasoning,
        "tone_markers": tone_markers,
        "cognitive_appraisal": cognitive_appraisal,
        "psychological_theme": f"Emotional Resonance: {emo_info['label']} • Pragmatics: {intent['name']}",
    }


def analyze_text(text: str) -> Dict[str, Any]:
    """Full comprehensive emotion, intent, explainability, and circumplex analysis."""
    scores = predict_emotions(text)
    dominant_emotion = max(scores, key=scores.get)
    confidence = scores[dominant_emotion]

    intent = detect_intent(text, dominant_emotion)
    saliency = compute_word_saliency(text, dominant_emotion)
    explanation = generate_explanation(text, dominant_emotion, intent, confidence)

    # Compute Valence-Arousal Coordinates (weighted centroid)
    net_valence = sum(scores[emo] * EMOTION_META[emo]["valence"] for emo in scores)
    net_arousal = sum(scores[emo] * EMOTION_META[emo]["arousal"] for emo in scores)
    net_dominance = sum(scores[emo] * EMOTION_META[emo]["dominance"] for emo in scores)

    return {
        "dominant_emotion": dominant_emotion,
        "dominant_label": EMOTION_META[dominant_emotion]["label"],
        "emoji": EMOTION_META[dominant_emotion]["emoji"],
        "color": EMOTION_META[dominant_emotion]["color"],
        "confidence": round(confidence, 4),
        "scores": scores,
        "affect_coordinates": {
            "valence": round(net_valence, 3),   # -1.0 to +1.0
            "arousal": round(net_arousal, 3),   # 0.0 to 1.0
            "dominance": round(net_dominance, 3) # 0.0 to 1.0
        },
        "intent": intent,
        "saliency": saliency,
        "explanation": explanation,
        "metadata": {
            "word_count": len(text.split()),
            "char_count": len(text),
            "device": _DEVICE
        }
    }


def analyze_narrative_flow(full_text: str) -> List[Dict[str, Any]]:
    """Split text into sentences and track emotional and intent progression over time."""
    # Split by period, exclamation, question mark, or newline
    sentences = [s.strip() for s in re.split(r"[.!?\n]+", full_text) if len(s.strip()) > 3]
    if not sentences:
        sentences = [full_text]

    flow = []
    for idx, sentence in enumerate(sentences):
        res = analyze_text(sentence)
        flow.append({
            "step": idx + 1,
            "sentence": sentence,
            "dominant_emotion": res["dominant_emotion"],
            "dominant_label": res["dominant_label"],
            "emoji": res["emoji"],
            "color": res["color"],
            "confidence": res["confidence"],
            "valence": res["affect_coordinates"]["valence"],
            "arousal": res["affect_coordinates"]["arousal"],
            "intent": res["intent"]["badge"]
        })

    return flow
