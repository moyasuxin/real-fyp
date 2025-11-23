# ML Model Setup - Local & Railway Deployment

This folder contains the Python ML model for student performance prediction. It can run **both locally for testing** and **on Railway for production**.

---

## 🏠 Local Development Setup

### 1. Install Python Dependencies

```powershell
cd ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Test the API Server Locally

```powershell
# Start the FastAPI server
python api_server.py
```

Server will run on `http://localhost:8000`

**Test endpoints:**

- Health check: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`
- Predict: POST to `http://localhost:8000/predict` with `{"student_id": 1}`

### 3. Configure Local Mode

In your `.env.local` file:

```env
USE_LOCAL_ML=true
ML_API_URL=http://localhost:8000
```

Your Next.js app will now use **local Python execution**.

---

## ☁️ Railway Deployment (Production)

### 1. Push to GitHub

Ensure all ML files are committed:

```
ml/
├── api_server.py       # FastAPI server
├── predict_student.py  # ML prediction script
├── model.joblib        # Trained model
├── requirements.txt    # Python dependencies
├── Procfile           # Railway start command
└── railway.json       # Railway config
```

### 2. Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python and deploy
5. **Important:** Set the root directory to `/ml` in Railway settings

### 3. Configure Environment Variables on Railway

In Railway dashboard → Variables:

```
DATABASE_URL=your_supabase_connection_string
PORT=8000
```

### 4. Get Your Railway URL

After deployment, Railway gives you a URL like:

```
https://your-app-name.up.railway.app
```

### 5. Update Vercel Environment Variables

In your Vercel project settings:

```env
USE_LOCAL_ML=false
ML_API_URL=https://your-app-name.up.railway.app
```

Now your **Vercel app calls Railway ML API** instead of local Python!

---

## 🔄 Switching Between Local and Remote

### For Local Testing:

```env
USE_LOCAL_ML=true
ML_API_URL=http://localhost:8000
```

### For Production (Vercel → Railway):

```env
USE_LOCAL_ML=false
ML_API_URL=https://your-app-name.up.railway.app
```

---

## 📊 Files Explained

| File                 | Purpose                               |
| -------------------- | ------------------------------------- |
| `api_server.py`      | FastAPI wrapper for ML model          |
| `predict_student.py` | Core ML prediction logic              |
| `model.joblib`       | Trained Random Forest model           |
| `requirements.txt`   | Python dependencies                   |
| `Procfile`           | Tells Railway how to start the server |
| `railway.json`       | Railway deployment configuration      |

---

## 🧪 Testing the API

### Using curl:

```powershell
# Health check
curl http://localhost:8000/health

# Predict student scores
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d "{\"student_id\": 1}"
```

### Using Python:

```python
import requests

response = requests.post(
    "http://localhost:8000/predict",
    json={"student_id": 1}
)
print(response.json())
```

---

## 💰 Cost

- **Local development**: Free
- **Railway**: $5/month free credit (enough for FYP)
- **Vercel**: Free (Hobby tier)

---

## 🐛 Troubleshooting

### "Module not found" error:

```powershell
pip install -r requirements.txt
```

### Railway deployment fails:

- Check that `/ml` is set as root directory
- Verify `model.joblib` is committed to Git
- Check Railway logs for errors

### Vercel can't connect to Railway:

- Verify `ML_API_URL` environment variable
- Check Railway service is running
- Ensure Railway URL is public (not private)

---

## 📝 Summary

✅ **Local mode**: Fast testing, direct Python execution  
✅ **Railway mode**: Production-ready, no Python needed on Vercel  
✅ **Flexible**: Switch modes with one environment variable  
✅ **Same code**: No changes needed to switch between local/remote
