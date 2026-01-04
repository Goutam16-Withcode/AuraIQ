import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow logging

import streamlit as st
import pandas as pd
import numpy as np
import pickle
import warnings
warnings.filterwarnings('ignore')

from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import tensorflow as tf
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime

# Set page configuration
st.set_page_config(
    page_title="Advanced Text Emotion Classifier",
    page_icon="🎭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Advanced CSS styling with animations
st.markdown("""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        
        * {
            font-family: 'Poppins', sans-serif;
        }
        
        .main {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
            color: #fff;
        }
        
        /* Tab animations */
        .stTabs [data-baseweb="tab-list"] button {
            background-color: rgba(255,255,255,0.1);
            color: white;
            border-radius: 10px;
            margin: 5px;
            padding: 12px 24px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255,255,255,0.2);
            font-weight: 600;
        }
        
        .stTabs [data-baseweb="tab-list"] button:hover {
            background-color: rgba(255,255,255,0.2);
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            border-color: rgba(255,255,255,0.4);
        }
        
        /* Active tab styling */
        .stTabs [aria-selected="true"] {
            background-color: rgba(126, 34, 206, 0.8) !important;
            border-color: rgba(255,255,255,0.6) !important;
        }
        
        /* Emotion card animations */
        .emotion-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            border-left: 5px solid;
            padding: 20px;
            border-radius: 15px;
            margin: 10px 0;
            backdrop-filter: blur(10px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .emotion-card:hover {
            transform: translateX(8px) translateY(-4px);
            box-shadow: 0 16px 48px rgba(0,0,0,0.25);
            border-color: rgba(255,255,255,0.4);
        }
        
        /* Metric card animations */
        .metric-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            animation: slideUp 0.6s ease-out;
        }
        
        .metric-card:hover {
            transform: scale(1.08) translateY(-8px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.2);
            border-color: rgba(255,255,255,0.5);
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%);
        }
        
        /* Section title with animation */
        .section-title {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            margin: 30px 0 20px 0;
            border-bottom: 3px solid #7e22ce;
            padding-bottom: 10px;
            animation: fadeInSlide 0.6s ease-out;
        }
        
        /* Emotion border colors */
        .emotion-anger-border { border-left-color: #e74c3c; }
        .emotion-fear-border { border-left-color: #9b59b6; }
        .emotion-joy-border { border-left-color: #f39c12; }
        .emotion-love-border { border-left-color: #e91e63; }
        .emotion-neutral-border { border-left-color: #95a5a6; }
        .emotion-sadness-border { border-left-color: #3498db; }
        .emotion-surprise-border { border-left-color: #1abc9c; }
        
        /* Confidence meter animation */
        .confidence-meter {
            background: linear-gradient(90deg, #e74c3c 0%, #f39c12 25%, #f1c40f 50%, #2ecc71 75%, #27ae60 100%);
            height: 8px;
            border-radius: 5px;
            margin: 10px 0;
            animation: slideRight 0.8s ease-out;
        }
        
        /* Input area styling */
        .stTextArea {
            background: rgba(255,255,255,0.08) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            border-radius: 10px !important;
            color: white !important;
            transition: all 0.3s ease;
        }
        
        .stTextArea:hover {
            border-color: rgba(255,255,255,0.4) !important;
            background: rgba(255,255,255,0.1) !important;
        }
        
        .stTextArea:focus {
            border-color: #7e22ce !important;
            background: rgba(255,255,255,0.12) !important;
            box-shadow: 0 0 20px rgba(126, 34, 206, 0.3) !important;
        }
        
        /* Button animations */
        .stButton > button {
            background: linear-gradient(135deg, #7e22ce 0%, #6d1b9d 100%);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 10px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 15px rgba(126, 34, 206, 0.3);
        }
        
        .stButton > button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(126, 34, 206, 0.5);
            background: linear-gradient(135deg, #8e2de2 0%, #7e22ce 100%);
        }
        
        .stButton > button:active {
            transform: translateY(-1px);
        }
        
        /* Keyframe animations */
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideRight {
            from {
                width: 0;
                opacity: 0;
            }
            to {
                width: 100%;
                opacity: 1;
            }
        }
        
        @keyframes fadeInSlide {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        /* Data table styling */
        .stDataFrame {
            background: rgba(0,0,0,0.2) !important;
            border-radius: 10px !important;
            overflow: hidden;
        }
        
        /* Download button */
        .stDownloadButton > button {
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
            border: none;
            color: white;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .stDownloadButton > button:hover {
            background: linear-gradient(135deg, #3ed975 0%, #2ab456 100%);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
        }
    </style>
""", unsafe_allow_html=True)

@st.cache_resource
def load_pretrained_model():
    """Load the pre-trained model and components from files"""
    try:
        # Use current working directory (more reliable in Streamlit)
        current_dir = os.getcwd()
        
        # Load the trained model
        model_path = os.path.join(current_dir, 'emotion_model.h5')
        if not os.path.exists(model_path):
            st.error(f"❌ Model file not found at {model_path}")
            st.error("Please run the notebook first to train and save the model.")
            return None, None, None, None
        
        model = load_model(model_path)
        
        # Load tokenizer
        tokenizer_path = os.path.join(current_dir, 'tokenizer.pkl')
        with open(tokenizer_path, 'rb') as f:
            tokenizer = pickle.load(f)
        
        # Load label encoder
        encoder_path = os.path.join(current_dir, 'label_encoder.pkl')
        with open(encoder_path, 'rb') as f:
            label_encoder = pickle.load(f)
        
        # Load max_length
        max_length_path = os.path.join(current_dir, 'max_length.pkl')
        with open(max_length_path, 'rb') as f:
            max_length = pickle.load(f)
        
        return model, tokenizer, label_encoder, max_length
        
    except Exception as e:
        st.error(f"❌ Error loading model: {e}")
        import traceback
        st.error(traceback.format_exc())
        return None, None, None, None

def get_emotion_emoji(emotion):
    """Return emoji for emotion"""
    emoji_map = {
        'anger': '😠',
        'fear': '😨',
        'joy': '😊',
        'love': '❤️',
        'neutral': '😐',
        'sadness': '😢',
        'surprise': '😲'
    }
    return emoji_map.get(emotion.lower(), '🤔')

def get_emotion_color(emotion):
    """Get color for emotion"""
    color_map = {
        'anger': '#e74c3c',
        'fear': '#9b59b6',
        'joy': '#f39c12',
        'love': '#e91e63',
        'neutral': '#95a5a6',
        'sadness': '#3498db',
        'surprise': '#1abc9c'
    }
    return color_map.get(emotion.lower(), '#95a5a6')

# Initialize session state for history
if 'prediction_history' not in st.session_state:
    st.session_state.prediction_history = []

def add_to_history(text, emotion, confidence):
    """Add prediction to history"""
    st.session_state.prediction_history.append({
        'timestamp': datetime.now(),
        'text': text,
        'emotion': emotion,
        'confidence': confidence
    })

# Header Section
col1, col2, col3 = st.columns([1, 2, 1])

with col1:
    st.markdown("")
    
with col2:
    st.markdown("<h1 style='text-align: center; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);'>🎭 Advanced Text Emotion Classifier</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; color: rgba(255,255,255,0.8); font-size: 16px;'>Powered by Deep Learning • Real-time Emotion Detection</p>", unsafe_allow_html=True)

with col3:
    st.markdown("")

# Load model
with st.spinner("⚡ Loading pre-trained model..."):
    model, tokenizer, label_encoder, max_length = load_pretrained_model()

if model and tokenizer and label_encoder:
    st.success("✅ System Ready - All components loaded successfully!", icon="✅")
    
    # Create advanced tabs
    tab1, tab2, tab3, tab4 = st.tabs(["🎯 Emotion Analyzer", "📊 Batch Processing", "📈 Analytics", "ℹ️ About"])
    
    with tab1:
        st.markdown("<div class='section-title'>🎯 Single Text Emotion Analysis</div>", unsafe_allow_html=True)
        
        # Enhanced input section with animations
        st.markdown("""
        <style>
            .input-container {
                background: linear-gradient(135deg, rgba(126, 34, 206, 0.15) 0%, rgba(30, 60, 114, 0.15) 100%);
                border: 2px solid rgba(126, 34, 206, 0.3);
                border-radius: 20px;
                padding: 30px;
                margin: 20px 0;
                backdrop-filter: blur(15px);
                animation: slideUp 0.6s ease-out;
                transition: all 0.3s ease;
            }
            
            .input-container:hover {
                border-color: rgba(126, 34, 206, 0.6);
                background: linear-gradient(135deg, rgba(126, 34, 206, 0.2) 0%, rgba(30, 60, 114, 0.2) 100%);
                box-shadow: 0 8px 32px rgba(126, 34, 206, 0.2);
            }
            
            .input-label {
                font-size: 18px;
                font-weight: 700;
                color: #fff;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
                letter-spacing: 0.5px;
            }
            
            .stTextArea textarea {
                background: rgba(255, 255, 255, 0.08) !important;
                border: 1.5px solid rgba(126, 34, 206, 0.4) !important;
                border-radius: 15px !important;
                color: white !important;
                font-size: 16px !important;
                padding: 16px !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .stTextArea textarea::placeholder {
                color: rgba(255, 255, 255, 0.5) !important;
                font-style: italic;
            }
            
            .stTextArea textarea:focus {
                border-color: #7e22ce !important;
                background: rgba(255, 255, 255, 0.12) !important;
                box-shadow: 0 0 25px rgba(126, 34, 206, 0.4), inset 0 0 20px rgba(126, 34, 206, 0.1) !important;
                outline: none !important;
            }
            
            .stTextArea textarea:hover {
                border-color: rgba(126, 34, 206, 0.6) !important;
                background: rgba(255, 255, 255, 0.1) !important;
            }
            
            .info-badge {
                background: rgba(126, 34, 206, 0.2);
                border-left: 3px solid #7e22ce;
                padding: 12px 16px;
                border-radius: 10px;
                flex: 1;
                transition: all 0.3s ease;
                animation: slideUp 0.6s ease-out;
            }
            
            .info-badge:hover {
                background: rgba(126, 34, 206, 0.3);
                transform: translateY(-3px);
            }
            
            .info-badge-title {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }
            
            .info-badge-value {
                font-size: 20px;
                font-weight: 700;
                color: #7e22ce;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
        
        <div class='input-container'>
            <div class='input-label'>
                <div>📝 Enter Text to Analyze</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Input section with advanced layout
        col1, col2 = st.columns([3, 1])
        
        with col1:
            user_input = st.text_area(
                "Enter text to analyze:",
                placeholder="✨ Type or paste your emotions here... Share your feelings, thoughts, or expressions",
                height=150,
                key="emotion_input",
                label_visibility="collapsed"
            )
        
        with col2:
            # Character and word counter
            char_count = len(user_input) if user_input else 0
            word_count = len(user_input.split()) if user_input else 0
            
            # Determine status
            if char_count < 3:
                status = "📋 Ready"
                status_color = "orange"
            elif char_count < 50:
                status = "✅ Good"
                status_color = "cyan"
            elif char_count < 200:
                status = "⭐ Great"
                status_color = "green"
            else:
                status = "🚀 Excellent"
                status_color = "purple"
            
            st.markdown(f"""
            <div style='margin-top: 8px;'>
                <div class='info-badge'>
                    <div class='info-badge-title'>📊 Characters</div>
                    <div class='info-badge-value'>{char_count}</div>
                </div>
                <div class='info-badge' style='margin-top: 10px;'>
                    <div class='info-badge-title'>📝 Words</div>
                    <div class='info-badge-value'>{word_count}</div>
                </div>
                <div class='info-badge' style='margin-top: 10px; border-left-color: #4fc3f7;'>
                    <div class='info-badge-title'>Status</div>
                    <div class='info-badge-value' style='color: #4fc3f7;'>{status}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        # Enhanced analyze button
        st.markdown("""
        <style>
            .analyze-button-container {
                margin: 30px 0;
            }
        </style>
        <div class='analyze-button-container'></div>
        """, unsafe_allow_html=True)
        
        col_btn1, col_btn2 = st.columns([2, 1])
        
        with col_btn1:
            analyze_clicked = st.button(
                "🔍 Analyze Emotion",
                use_container_width=True,
                key="analyze_btn",
                help="Click to analyze the emotion in your text"
            )
        
        with col_btn2:
            clear_clicked = st.button(
                "🗑️ Clear",
                use_container_width=True,
                key="clear_btn",
                help="Clear the input"
            )
            if clear_clicked:
                st.rerun()
        
        # Analysis logic
        if analyze_clicked:
            if user_input.strip() and len(user_input.strip()) >= 3:
                # Preprocess input
                input_sequence = tokenizer.texts_to_sequences([user_input])
                padded_input = pad_sequences(input_sequence, maxlen=max_length)
                
                # Make prediction
                prediction = model.predict(padded_input, verbose=0)
                predicted_idx = np.argmax(prediction[0])
                confidence = float(prediction[0][predicted_idx]) * 100
                predicted_emotion = label_encoder.inverse_transform([predicted_idx])[0]
                
                # Add to history
                add_to_history(user_input[:50], predicted_emotion, confidence)
                
                # Display results with advanced layout
                st.markdown("<div class='section-title'>📊 Analysis Results</div>", unsafe_allow_html=True)
                
                # Main result display with animations
                result_col1, result_col2, result_col3 = st.columns([1, 2, 1])
                
                with result_col1:
                    emoji = get_emotion_emoji(predicted_emotion)
                    st.markdown(f"""
                    <div style='text-align: center;'>
                        <h1 style='font-size: 100px; margin: 20px 0; animation: bounce 1s ease-in-out infinite;'>{emoji}</h1>
                    </div>
                    <style>
                        @keyframes bounce {{
                            0%, 100% {{ transform: translateY(0); }}
                            50% {{ transform: translateY(-20px); }}
                        }}
                    </style>
                    """, unsafe_allow_html=True)
                
                with result_col2:
                    st.markdown(f"""
                    <div style='background: linear-gradient(135deg, {get_emotion_color(predicted_emotion)} 0%, {get_emotion_color(predicted_emotion)}cc 100%); 
                                 padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3); backdrop-filter: blur(10px);
                                 animation: slideUp 0.6s ease-out, glow 2s ease-in-out infinite;
                                 border: 2px solid rgba(255,255,255,0.3);'>
                        <h1 style='color: white; margin: 0; font-size: 48px; font-weight: 700;'>{predicted_emotion.upper()}</h1>
                        <h2 style='color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 32px; font-weight: 700; animation: countUp 0.8s ease-out;'>{confidence:.1f}%</h2>
                        <p style='color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;'>CONFIDENCE SCORE</p>
                    </div>
                    <style>
                        @keyframes slideUp {{
                            from {{ opacity: 0; transform: translateY(30px); }}
                            to {{ opacity: 1; transform: translateY(0); }}
                        }}
                        @keyframes countUp {{
                            from {{ opacity: 0; transform: scale(0.5); }}
                            to {{ opacity: 1; transform: scale(1); }}
                        }}
                        @keyframes glow {{
                            0%, 100% {{ box-shadow: 0 10px 40px rgba(0,0,0,0.3); }}
                            50% {{ box-shadow: 0 10px 50px rgba(0,0,0,0.5); }}
                        }}
                    </style>
                    """, unsafe_allow_html=True)
                
                with result_col3:
                    # Confidence meter visualization - Enhanced gauge with animations
                    fig_gauge = go.Figure(go.Indicator(
                        mode="gauge+number",
                        value=confidence,
                        domain={'x': [0, 1], 'y': [0, 1]},
                        title={'text': "Confidence Level", 'font': {'size': 18, 'color': 'white', 'family': 'Poppins'}},
                        number={'font': {'size': 45, 'color': get_emotion_color(predicted_emotion), 'family': 'Poppins', 'weight': 'bold'}, 'suffix': '%'},
                        gauge={
                            'axis': {
                                'range': [0, 100],
                                'ticklen': 8,
                                'tickcolor': 'rgba(255,255,255,0.6)',
                                'tickwidth': 2.5,
                                'tickfont': {'size': 12, 'color': 'rgba(255,255,255,0.7)'}
                            },
                            'bar': {
                                'color': get_emotion_color(predicted_emotion),
                                'thickness': 0.6
                            },
                            'steps': [
                                {'range': [0, 33], 'color': "rgba(231, 76, 60, 0.2)", 'name': 'Low'},
                                {'range': [33, 67], 'color': "rgba(241, 156, 18, 0.2)", 'name': 'Medium'},
                                {'range': [67, 100], 'color': "rgba(46, 204, 113, 0.2)", 'name': 'High'}
                            ],
                            'threshold': {
                                'line': {'color': 'rgba(255,255,255,0.4)', 'width': 2},
                                'thickness': 0.75,
                                'value': confidence
                            },
                            'bgcolor': 'rgba(0,0,0,0.4)'
                        }
                    ))
                    
                    fig_gauge.update_layout(
                        height=300,
                        margin=dict(l=20, r=20, t=60, b=20),
                        paper_bgcolor='rgba(0,0,0,0)',
                        font={'color': 'white', 'family': 'Poppins'},
                        plot_bgcolor='rgba(0,0,0,0)',
                        transition={'duration': 800, 'easing': 'cubic-in-out'}
                    )
                    
                    st.plotly_chart(fig_gauge, use_container_width=True)
                
                # Animated emotion confidence cards
                st.markdown("<div class='section-title'>💫 Emotion Confidence Breakdown</div>", unsafe_allow_html=True)
                
                emotions = label_encoder.classes_
                confidence_scores = prediction[0] * 100
                
                # Create emotion cards with animated progress bars
                emotion_data = list(zip(emotions, confidence_scores))
                emotion_data_sorted = sorted(emotion_data, key=lambda x: x[1], reverse=True)
                
                # Display as animated cards
                for idx, (emotion, score) in enumerate(emotion_data_sorted):
                    emotion_color = get_emotion_color(emotion)
                    emoji = get_emotion_emoji(emotion)
                    
                    st.markdown(f"""
                    <div style='margin: 12px 0; padding: 16px; background: linear-gradient(90deg, {emotion_color}22 0%, rgba(0,0,0,0.1) 100%);
                                 border-left: 4px solid {emotion_color}; border-radius: 12px; backdrop-filter: blur(10px);
                                 animation: slideRight 0.6s ease-out;
                                 animation-delay: {idx * 0.1}s;
                                 animation-fill-mode: both;'>
                        <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;'>
                            <span style='font-size: 18px; font-weight: 600;'>{emoji} {emotion.upper()}</span>
                            <span style='font-size: 18px; font-weight: 700; color: {emotion_color};'>{score:.1f}%</span>
                        </div>
                        <div style='background: rgba(0,0,0,0.3); height: 8px; border-radius: 10px; overflow: hidden;'>
                            <div style='background: linear-gradient(90deg, {emotion_color}, {emotion_color}aa); height: 100%; border-radius: 10px;
                                       width: {score}%; animation: fillWidth 0.8s ease-out; animation-delay: {idx * 0.1 + 0.3}s; animation-fill-mode: both;'></div>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                
                st.markdown("""
                    <style>
                        @keyframes slideRight {{
                            from {{
                                opacity: 0;
                                transform: translateX(-20px);
                            }}
                            to {{
                                opacity: 1;
                                transform: translateX(0);
                            }}
                        }}
                        
                        @keyframes fillWidth {{
                            from {{
                                width: 0;
                            }}
                            to {{
                                width: var(--final-width);
                            }}
                        }}
                    </style>
                """, unsafe_allow_html=True)
                
                # Create detailed breakdown
                breakdown_col1, breakdown_col2 = st.columns([1, 1])
                
                with breakdown_col1:
                    # Bar chart
                    df_confidence = pd.DataFrame({
                        'Emotion': emotions,
                        'Confidence': confidence_scores
                    }).sort_values('Confidence', ascending=True)
                    
                    fig = px.bar(
                        df_confidence,
                        x='Confidence',
                        y='Emotion',
                        orientation='h',
                        color='Confidence',
                        color_continuous_scale='RdYlGn',
                        labels={'Confidence': 'Confidence Score (%)'},
                        title='Emotion Confidence Scores'
                    )
                    fig.update_layout(
                        height=300,
                        showlegend=False,
                        paper_bgcolor='rgba(0,0,0,0)',
                        plot_bgcolor='rgba(0,0,0,0)',
                        font={'color': 'white'},
                        xaxis={'color': 'white'},
                        yaxis={'color': 'white'}
                    )
                    st.plotly_chart(fig, use_container_width=True)
                
                with breakdown_col2:
                    # Pie chart
                    fig_pie = px.pie(
                        df_confidence,
                        values='Confidence',
                        names='Emotion',
                        title='Emotion Distribution',
                        color_discrete_map={emotion: get_emotion_color(emotion) for emotion in emotions}
                    )
                    fig_pie.update_layout(
                        height=300,
                        paper_bgcolor='rgba(0,0,0,0)',
                        font={'color': 'white'}
                    )
                    st.plotly_chart(fig_pie, use_container_width=True)
                
                # Individual emotion cards
                st.markdown("<div class='section-title'>🎭 Individual Scores</div>", unsafe_allow_html=True)
                
                emotion_cols = st.columns(len(emotions))
                for idx, (emotion, score) in enumerate(zip(emotions, confidence_scores)):
                    with emotion_cols[idx]:
                        st.markdown(f"""
                        <div class='emotion-card emotion-{emotion.lower()}-border'>
                            <div style='text-align: center;'>
                                <h3 style='margin: 0; font-size: 32px;'>{get_emotion_emoji(emotion)}</h3>
                                <p style='margin: 10px 0 0 0; font-size: 14px;'>{emotion.capitalize()}</p>
                                <h2 style='margin: 10px 0; color: #fff;'>{score:.1f}%</h2>
                                <div class='confidence-meter' style='width: {score}%;'></div>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        
            else:
                st.warning("⚠️ Please enter at least 3 characters to analyze", icon="⚠️")
    
    with tab2:
        st.markdown("<div class='section-title'>📊 Batch Text Processing</div>", unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            uploaded_file = st.file_uploader("Upload text file (one text per line)", type=['txt'])
        
        with col2:
            st.markdown("#### File Format")
            st.info("Upload a .txt file with one text per line")
        
        if uploaded_file:
            texts = uploaded_file.read().decode().strip().split('\n')
            
            if st.button("📊 Process All Texts", use_container_width=True):
                predictions = []
                progress_bar = st.progress(0)
                status_text = st.empty()
                
                for idx, text in enumerate(texts):
                    if text.strip():
                        input_sequence = tokenizer.texts_to_sequences([text])
                        padded_input = pad_sequences(input_sequence, maxlen=max_length)
                        prediction = model.predict(padded_input, verbose=0)
                        predicted_idx = np.argmax(prediction[0])
                        predicted_emotion = label_encoder.inverse_transform([predicted_idx])[0]
                        confidence = float(prediction[0][predicted_idx]) * 100
                        predictions.append({
                            'Text': text[:50] + '...' if len(text) > 50 else text,
                            'Emotion': predicted_emotion,
                            'Confidence': f"{confidence:.2f}%",
                            'Full Text': text
                        })
                    
                    progress_bar.progress((idx + 1) / len(texts))
                    status_text.text(f"Processing {idx + 1}/{len(texts)} texts...")
                
                status_text.empty()
                progress_bar.empty()
                
                results_df = pd.DataFrame(predictions)
                
                # Display statistics
                st.markdown("<div class='section-title'>📈 Processing Statistics</div>", unsafe_allow_html=True)
                
                stat_col1, stat_col2, stat_col3, stat_col4 = st.columns(4)
                
                with stat_col1:
                    st.metric("Total Texts", len(results_df))
                
                with stat_col2:
                    st.metric("Dominant Emotion", results_df['Emotion'].mode()[0] if len(results_df) > 0 else "N/A")
                
                with stat_col3:
                    avg_confidence = pd.to_numeric(results_df['Confidence'].str.rstrip('%'), errors='coerce').mean()
                    st.metric("Avg Confidence", f"{avg_confidence:.1f}%")
                
                with stat_col4:
                    st.metric("Unique Emotions", results_df['Emotion'].nunique())
                
                # Display results table
                st.markdown("<div class='section-title'>📋 Results Table</div>", unsafe_allow_html=True)
                st.dataframe(results_df[['Text', 'Emotion', 'Confidence']], use_container_width=True)
                
                # Emotion distribution chart
                st.markdown("<div class='section-title'>📊 Emotion Distribution</div>", unsafe_allow_html=True)
                
                emotion_counts = results_df['Emotion'].value_counts()
                fig = px.bar(
                    x=emotion_counts.values,
                    y=emotion_counts.index,
                    orientation='h',
                    title='Emotion Distribution in Batch',
                    labels={'x': 'Count', 'y': 'Emotion'},
                    color=emotion_counts.index,
                    color_discrete_map={emotion: get_emotion_color(emotion) for emotion in emotion_counts.index}
                )
                fig.update_layout(
                    height=300,
                    paper_bgcolor='rgba(0,0,0,0)',
                    plot_bgcolor='rgba(0,0,0,0)',
                    font={'color': 'white'},
                    xaxis={'color': 'white'},
                    yaxis={'color': 'white'},
                    showlegend=False
                )
                st.plotly_chart(fig, use_container_width=True)
                
                # Download option
                csv = results_df.to_csv(index=False)
                st.download_button(
                    label="📥 Download Full Results (CSV)",
                    data=csv,
                    file_name=f"emotion_predictions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                    mime="text/csv",
                    use_container_width=True
                )
    
    with tab3:
        st.markdown("<div class='section-title'>📈 Prediction Analytics & History</div>", unsafe_allow_html=True)
        
        if st.session_state.prediction_history:
            history_df = pd.DataFrame(st.session_state.prediction_history)
            
            # Statistics
            stat_col1, stat_col2, stat_col3 = st.columns(3)
            
            with stat_col1:
                st.metric("Total Predictions", len(history_df))
            
            with stat_col2:
                avg_conf = history_df['confidence'].mean()
                st.metric("Avg Confidence", f"{avg_conf:.1f}%")
            
            with stat_col3:
                dominant = history_df['emotion'].mode()[0]
                st.metric("Most Common", dominant)
            
            # Charts
            col1, col2 = st.columns(2)
            
            with col1:
                emotion_dist = history_df['emotion'].value_counts()
                fig = px.pie(
                    values=emotion_dist.values,
                    names=emotion_dist.index,
                    title='Emotion Distribution',
                    color_discrete_map={emotion: get_emotion_color(emotion) for emotion in emotion_dist.index}
                )
                fig.update_layout(
                    height=400,
                    paper_bgcolor='rgba(0,0,0,0)',
                    font={'color': 'white'}
                )
                st.plotly_chart(fig, use_container_width=True)
            
            with col2:
                fig = px.line(
                    history_df,
                    x='timestamp',
                    y='confidence',
                    title='Confidence Over Time',
                    markers=True
                )
                fig.update_layout(
                    height=400,
                    paper_bgcolor='rgba(0,0,0,0)',
                    plot_bgcolor='rgba(0,0,0,0)',
                    font={'color': 'white'},
                    xaxis={'color': 'white'},
                    yaxis={'color': 'white'}
                )
                st.plotly_chart(fig, use_container_width=True)
            
            # History table
            st.markdown("<div class='section-title'>📜 Prediction History</div>", unsafe_allow_html=True)
            st.dataframe(history_df, use_container_width=True)
            
            if st.button("🗑️ Clear History", use_container_width=True):
                st.session_state.prediction_history = []
                st.rerun()
        else:
            st.info("📝 No predictions yet. Start analyzing texts to see analytics!", icon="ℹ️")
    
    with tab4:
        st.markdown("<div class='section-title'>ℹ️ About This Application</div>", unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("""
            ### 🤖 Model Information
            - **Architecture**: Deep Learning Neural Network
            - **Input Layer**: Text Embedding (64 dimensions)
            - **Hidden Layer**: Dense Layer with ReLU Activation (64 units)
            - **Output Layer**: 7 Emotion Classes with Softmax
            - **Training Data**: 16,000+ emotion-labeled texts
            
            ### 🎯 Emotions Detected
            - 😠 **Anger** - Expressing frustration or rage
            - 😨 **Fear** - Showing anxiety or worry
            - 😊 **Joy** - Displaying happiness or excitement
            - ❤️ **Love** - Expressing affection or care
            - 😐 **Neutral** - Unemotional or factual statements
            - 😢 **Sadness** - Showing grief or sorrow
            - 😲 **Surprise** - Expressing astonishment
            """)
        
        with col2:
            st.markdown("""
            ### ⚡ Features
            - **Real-time Analysis** - Instant emotion detection
            - **Batch Processing** - Analyze multiple texts at once
            - **Confidence Scores** - Detailed probability breakdown
            - **Visual Analytics** - Charts and statistics
            - **History Tracking** - Keep records of predictions
            - **Export Capability** - Download results as CSV
            
            ### 📊 How It Works
            1. Your text is tokenized into word sequences
            2. Sequences are padded to uniform length
            3. The model processes through embedding layer
            4. Dense layers extract emotional features
            5. Output layer predicts emotion probabilities
            6. Highest probability determines final emotion
            """)

else:
    st.error("❌ Failed to load model. Please check your data files.")
    st.info("Make sure you have run the Jupyter notebook to train and save the model.")
