# Aura Emotion AI (v2.0 Next-Gen)

A state-of-the-art cognitive affect, intent detection, and explainability platform built with **Next.js 15**, **FastAPI**, and **PyTorch Transformer** architectures.

## What's New in v2.0?

- 🧠 **Dynamic Cognitive Explanation**: Never returns static canned answers. Deconstructs causal triggers (e.g., *"due to work in night"*), chronobiological strain, and psychological appraisal.
- 🎯 **Pragmatic Intent Detection**: Discovers the communicative purpose behind text (e.g., *Sharing Exhaustion & Venting Strain*, *Support Seeking*, *Celebrating Success*).
- 🧭 **Russell's 2D Circumplex Model**: Continuous coordinates for **Valence** (Pleasantness) and **Arousal** (Energy/Activation) differentiating low-arousal fatigue from high-arousal rage or anxiety.
- 🕸️ **Interactive Emotion Radar**: Real-time 7-axis polygon visualization across all primary emotion distributions.
- 🔍 **Token Saliency Heatmap**: Interactive word-by-word attribution highlighting which tokens drove the classification.
- 🌊 **Narrative Flow Tracker**: Sentence-by-sentence trajectory analysis for dialogues, essays, and customer call transcripts.
- 📁 **Batch Processing & Export Studio**: Upload `.csv` or `.txt` files, analyze in bulk, and download enriched CSV with affect metrics.
- ⚡ **Decoupled Modern Architecture**: Next.js 15 (TypeScript + Tailwind CSS + Glassmorphism) with high-performance FastAPI backend.

## Quick Start Guide

### Option 1: Next.js Frontend (with Auto-Engine Fallback)

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The frontend includes a high-performance built-in contextual engine and seamlessly connects to FastAPI when available.

### Option 2: FastAPI Backend Engine

```bash
cd backend
pip install -r requirements.txt
python server.py
```
FastAPI runs on [http://127.0.0.1:8000](http://127.0.0.1:8000) with interactive Swagger documentation at `/docs`.


## Project Structure

```
Text Emotion Classification/
├── app.py                          # Main Streamlit application
├── requirements.txt                # Python dependencies
├── Text_Emotion_Classification.ipynb # Original notebook
├── train.txt                       # Training dataset
├── val.txt                         # Validation dataset
├── test.txt                        # Test dataset
└── README.md                       # This file
```

## How to Use

### Single Text Prediction
1. Go to the "Predict Emotion" tab
2. Enter or paste your text in the text area
3. Click "Predict Emotion"
4. View the detected emotion and confidence scores

### Batch Prediction
1. Go to the "Batch Predict" tab
2. Upload a text file (one text per line)
3. Click "Predict All"
4. View results in a table and download as CSV

## Model Details

- **Input**: Text data (preprocessed with Tokenizer)
- **Architecture**: 
  - Embedding Layer (128 dimensions)
  - Flatten Layer
  - Dense Layer (128 units, ReLU activation)
  - Output Layer (Softmax activation for 6 emotion classes)
- **Training**: 10 epochs with batch size 32
- **Optimizer**: Adam
- **Loss Function**: Categorical Crossentropy

## Note

The model trains automatically on first run using the train.txt dataset. This may take a few moments. Subsequent runs will be faster as the model is cached in memory.

## Troubleshooting

**Issue**: "ModuleNotFoundError" for any package
- **Solution**: Run `pip install -r requirements.txt` again

**Issue**: Port 8501 already in use
- **Solution**: Run `streamlit run app.py --server.port 8502`

**Issue**: Model takes a long time to train
- **Solution**: This is normal for the first run. The model trains on the entire dataset.

## Future Enhancements

- Model persistence (save/load trained models)
- Real-time emotion tracking over conversations
- Support for multiple languages
- Advanced visualization of emotion trends
- Integration with other data sources

---

Enjoy analyzing emotions with your Text Emotion Classifier! 🎭
