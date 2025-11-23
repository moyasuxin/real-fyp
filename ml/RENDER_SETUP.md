# ML Model Setup - Local & Render Deployment (FREE)

This folder contains the Python ML model for student performance prediction. It can run **both locally for testing** and **on Render for production** (permanent free tier).

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

---

## ☁️ Render Deployment (Production - FREE Forever)

### Step 1: Push to GitHub

Use GitHub Desktop to commit and push these files:

```
ml/
├── api_server.py       # FastAPI server
├── predict_student.py  # ML prediction script
├── model.joblib        # Trained model
├── requirements.txt    # Python dependencies
├── .env               # DON'T PUSH THIS! (has secrets)
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com) and sign up (FREE, no credit card needed)
2. Connect your GitHub account

### Step 3: Deploy Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your GitHub repository
3. Configure:

**Basic Settings:**

- **Name**: `student-ml-api` (or any name you like)
- **Root Directory**: `ml`
- **Environment**: `Python 3`
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)

**Build & Deploy:**

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python api_server.py`

**Instance Type:**

- **Plan**: **Free** ⭐ (select this!)

4. Click **"Create Web Service"**

### Step 4: Add Environment Variables

In Render Dashboard → Your Service → Environment:

Click "Add Environment Variable" and add these (from your `ml/.env` file):

```
SUPABASE_URL = https://uwokktuhfyqcrdrxqbhx.supabase.co
SUPABASE_ANON_KEY = your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key_here
PORT = 8000
```

Click "Save Changes" - service will auto-redeploy.

### Step 5: Get Your Render URL

After deployment completes, you'll see:

```
https://student-ml-api.onrender.com
```

Test it: `https://student-ml-api.onrender.com/health`

### Step 6: Update Your Next.js App

Update `.env.local` in your Next.js project:

```env
USE_LOCAL_ML=false
ML_API_URL=https://student-ml-api.onrender.com
```

When deploying to Vercel, add these environment variables there too.

---

## 🔄 Switching Modes

### Local Testing (Development):

```env
USE_LOCAL_ML=true
ML_API_URL=http://localhost:8000
```

Runs Python directly on your computer.

### Remote API (Production):

```env
USE_LOCAL_ML=false
ML_API_URL=https://student-ml-api.onrender.com
```

Calls Render API from Vercel.

---

## ⚠️ Render Free Tier Limitations

- ✅ **750 hours/month** (more than enough for FYP)
- ✅ **No credit card required**
- ✅ **Permanent free tier** (won't expire)
- ⚠️ **Spins down after 15 min** of inactivity
- ⚠️ **First request takes ~30s** to wake up (cold start)
- ⚠️ **512MB RAM limit**

For FYP demos: This is perfect! Just make the first API call before your presentation to wake it up.

---

## 🧪 Test Your Deployment

### Test Health Endpoint:

```powershell
curl https://student-ml-api.onrender.com/health
```

Should return:

```json
{ "status": "healthy" }
```

### Test Prediction:

```powershell
curl -X POST https://student-ml-api.onrender.com/predict `
  -H "Content-Type: application/json" `
  -d '{"student_id": 1}'
```

---

## 🐛 Troubleshooting

### Deployment failed:

- Check Render logs (Dashboard → Logs tab)
- Verify `model.joblib` is in GitHub repo
- Make sure root directory is set to `ml`

### Service is slow:

- Free tier sleeps after 15 min - first request wakes it up
- Test URL before presentations
- Consider paid tier ($7/month) for always-on

### Can't connect from Vercel:

- Check `ML_API_URL` in Vercel environment variables
- Test Render URL directly in browser
- Make sure Render service shows "Live" (green)

---

## 💰 Cost Summary

| Service   | Cost     | Usage            |
| --------- | -------- | ---------------- |
| Render    | **FREE** | ML API hosting   |
| Vercel    | **FREE** | Next.js frontend |
| Supabase  | **FREE** | Database         |
| **Total** | **$0**   | Perfect for FYP! |

---

## 📝 Quick Deployment Checklist

- [ ] Files pushed to GitHub (via GitHub Desktop)
- [ ] Render account created
- [ ] Web service configured with `ml` root directory
- [ ] Environment variables added to Render
- [ ] Service deployed successfully (green "Live" status)
- [ ] Test `/health` endpoint works
- [ ] Update `ML_API_URL` in `.env.local`
- [ ] Set `USE_LOCAL_ML=false` for production

---

✅ **Done!** Your ML model is now deployed on Render (free forever) and your Vercel app can call it via API!
