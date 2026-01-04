# Text Emotion Classification UI

A beautiful web-based user interface for classifying emotions in text using Deep Learning.

## Features

✨ **Predict Single Text**: Analyze the emotion of any text input
📊 **Batch Predictions**: Upload a file and predict emotions for multiple texts
📈 **Confidence Scores**: View detailed confidence levels for each emotion category
💾 **Export Results**: Download predictions as CSV

## Emotions Recognized

- 😠 **Anger** - Red
- 😨 **Fear** - Purple
- 😊 **Joy** - Orange
- ❤️ **Love** - Pink
- 😐 **Neutral** - Gray
- 😢 **Sadness** - Blue
- 😲 **Surprise** - Teal

## Setup & Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Run the Application

```bash
streamlit run app.py
```

The application will automatically open in your default browser at `http://localhost:8501`

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
