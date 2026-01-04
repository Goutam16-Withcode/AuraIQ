# Use official Python runtime as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Create streamlit config directory
RUN mkdir -p ~/.streamlit/

# Create streamlit config
RUN echo "\
[server]\n\
headless = true\n\
port = 8501\n\
enableCORS = false\n\
enableXsrfProtection = false\n\
\n\
[theme]\n\
primaryColor = \"#7e22ce\"\n\
backgroundColor = \"#0f0f1e\"\n\
secondaryBackgroundColor = \"#1e3c72\"\n\
textColor = \"#ffffff\"\n\
font = \"sans serif\"\n\
" > ~/.streamlit/config.toml

# Expose port
EXPOSE 8501

# Health check
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health

# Run the app
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
