# 🚀 Deployment Guide

## Deploy to Streamlit Cloud (FREE & EASIEST)

### Prerequisites
- GitHub account (free at https://github.com)
- Streamlit account (free at https://streamlit.io/cloud)

### Step 1: Push Code to GitHub

```bash
# Initialize git in your project folder
cd "d:\Text Emotion Classification"
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Emotion Classification App"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/Text-Emotion-Classification.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Streamlit Cloud

1. Go to https://streamlit.io/cloud
2. Click **"New app"**
3. Select:
   - **Repository**: Your-Username/Text-Emotion-Classification
   - **Branch**: main
   - **Main file path**: app.py
4. Click **"Deploy!"**

That's it! Your app will be live in minutes! 🎉

### Step 3: Share Your App

Your app URL will be: `https://your-username-text-emotion-classification.streamlit.app`

---

## Alternative: Deploy to Heroku (Paid)

### Files Needed:
1. `Procfile` - tells Heroku how to run the app
2. `setup.sh` - configuration script

### Step 1: Create Procfile

```
web: sh setup.sh && streamlit run app.py
```

### Step 2: Create setup.sh

```bash
mkdir -p ~/.streamlit/
echo "[server]
headless = true
port = $PORT
enableCORS = false
" > ~/.streamlit/config.toml
```

### Step 3: Deploy

```bash
heroku login
heroku create your-app-name
git push heroku main
```

---

## Alternative: Deploy to HuggingFace Spaces

1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Name: `text-emotion-classification`
4. License: `openrail`
5. Space SDK: **Streamlit**
6. Click **"Create Space"**
7. Upload files to the space
8. It auto-deploys! ✨

---

## Alternative: Deploy to AWS, Google Cloud, or Azure

### AWS EC2
```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance

# Install Python and dependencies
sudo yum install python3
pip install -r requirements.txt

# Run Streamlit
streamlit run app.py --server.port 80
```

### Google Cloud Run
```bash
# Create Dockerfile (include in project)
gcloud run deploy emotion-classifier \
  --source . \
  --platform managed \
  --region us-central1
```

### Azure App Service
```bash
# Create app service
az webapp create --resource-group mygroup --plan myplan --name myapp

# Deploy
az webapp up --name myapp --runtime PYTHON:3.9
```

---

## Recommended: Streamlit Cloud (Best for Beginners)

**Why Streamlit Cloud?**
✅ FREE tier available
✅ Auto-deploys from GitHub
✅ Auto-HTTPS
✅ No server management
✅ Built-in sharing
✅ Community support

**Pros:**
- Simplest setup
- Automatic updates when you push to GitHub
- Free tier is generous
- Perfect for portfolios

**Cons:**
- Limited to Streamlit apps
- Free tier has some resource limits

---

## After Deployment

### Share with Others
- Send your Streamlit Cloud URL
- No installation needed!
- Works on any device with a browser

### Update Your App
1. Edit files locally
2. Git push to GitHub
3. Streamlit Cloud auto-updates! 🎉

### Monitor Usage
- Streamlit Cloud dashboard shows:
  - Visitors
  - Usage stats
  - App performance

---

## Security Notes

🔒 **Before Production:**
1. Don't commit sensitive data (API keys, passwords)
2. Use `.gitignore` for private files
3. Add environment variables in Streamlit Cloud settings
4. Use secrets management

Example: Add to `.streamlit/secrets.toml` (add to .gitignore):
```toml
[passwords]
email = "your-email@example.com"
api_key = "your-secret-key"
```

---

## Troubleshooting Deployment

**App won't load?**
- Check `requirements.txt` has all dependencies
- Ensure `app.py` is in root folder
- Check Streamlit Cloud logs

**Model files missing?**
- Ensure `.h5` and `.pkl` files are committed to GitHub
- Check file paths in `app.py`

**App too slow?**
- Upgrade Streamlit Cloud tier
- Optimize model (reduce size)
- Use caching: `@st.cache_resource`

**Permission errors?**
- Check .gitignore isn't hiding important files
- Ensure all files have read permissions

---

## Next Steps

1. **Deploy to Streamlit Cloud** (recommended for beginners)
2. **Get your shareable URL**
3. **Share with friends/colleagues**
4. **Collect feedback**
5. **Iterate and improve**

Happy deploying! 🚀

