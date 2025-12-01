# Fix ML Retrain on Vercel

## The Problem

You're running the app on **Vercel** (online environment), but your `.env.local` has:

```
USE_LOCAL_ML=true
```

This means the system tries to run Python scripts locally, which **doesn't work on Vercel** because:

1. Vercel is serverless (no persistent Python environment)
2. It can't execute `python predict_student.py` commands
3. Your ML model file (`model.joblib`) isn't accessible

## The Solution

You have **2 options**:

### Option 1: Use Render ML API (Recommended for Vercel)

1. **Update your `.env.local` (or create `.env.production` for Vercel):**

   ```env
   USE_LOCAL_ML=false
   ML_API_URL=https://real-fyp.onrender.com
   ```

2. **Make sure your Render ML service is running:**

   - Go to https://dashboard.render.com
   - Check if `real-fyp` service is live
   - The API endpoint should be: `https://real-fyp.onrender.com/predict`

3. **Redeploy on Vercel:**
   - Push changes to GitHub
   - Vercel will auto-deploy with the new environment variable
   - Or manually set environment variables in Vercel dashboard:
     - `USE_LOCAL_ML` = `false`
     - `ML_API_URL` = `https://real-fyp.onrender.com`

### Option 2: Run Locally (For Development)

1. **Keep `.env.local` as is:**

   ```env
   USE_LOCAL_ML=true
   ML_API_URL=http://localhost:8000
   ```

2. **Run the app on your local machine instead of Vercel:**

   ```powershell
   npm run dev
   ```

3. **Access at:** http://localhost:3000

---

## How to Test After Fix

1. Add a co-curricular activity in Student Manager
2. Go to Dashboard
3. Click "Refresh AI Summary & Scores"
4. Open **Browser Console** (F12 → Console tab)
5. Look for logs showing:

   ```
   === CO-CURRICULAR ACTIVITIES DEBUG ===
   Activities found: 1
   Activity: Impact=55, Leadership=45, Relevance=35
   FINAL CO-CURRICULAR SCORE: 32.50
   ```

6. The co-curricular score should update from **8.17 → 32-45** (depending on AI scores)

---

## Quick Fix Right Now

**If you want it working immediately on Vercel:**

1. Go to **Vercel Dashboard** → Your Project → Settings → Environment Variables
2. Add/Update these variables:
   - Key: `USE_LOCAL_ML`, Value: `false`
   - Key: `ML_API_URL`, Value: `https://real-fyp.onrender.com`
3. Click "Redeploy" (Deployments tab → latest deployment → ⋮ → Redeploy)
4. Wait 2 minutes for redeployment
5. Try again!

---

## Why This Happens

- **Vercel** = Serverless platform (can only run Node.js/Next.js)
- **Python ML** = Needs separate server (Render, Railway, or local)
- When `USE_LOCAL_ML=true` on Vercel, it fails silently because Python doesn't exist
- The system falls back to default scores (8.17) without errors

**TL;DR:** Change `USE_LOCAL_ML=false` in Vercel environment variables to use your Render ML API! 🚀
