# How to Fix ML Retrain on Render

## Issue: Render ML API returns 500 error

Your Vercel environment variables are correct, but the **Render service** needs configuration.

## Required Steps

### 1. Check Render Service Status

Go to: https://dashboard.render.com/web/srv-YOUR-SERVICE-ID

**Check:**

- ✅ Service is "Live" (green dot)
- ⚠️ Service is "Asleep" (free tier) → Wait 30-50 seconds for first request
- ❌ Service has "Deploy Failed" → Need to fix build errors

### 2. Add Environment Variables to Render

Your Render service needs these environment variables:

1. Go to Render Dashboard → Your Service → Environment
2. Add these variables:

```
SUPABASE_URL=https://uwokktuhfyqcrdrxqbhx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3b2trdHVoZnlxY3JkcnhxYmh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDA4OTc5NSwiZXhwIjoyMDc1NjY1Nzk1fQ.fnVdQC6trjVRI6QpCYxuSixeTXj8m4TYgbUDqq6FJB0
PORT=8000
```

3. Click "Save Changes"
4. Render will automatically redeploy

### 3. Test Render API Directly

After Render finishes deploying, test it:

```powershell
# Wake up service (if asleep)
Invoke-RestMethod -Uri "https://real-fyp.onrender.com/health"

# Test prediction (replace 1 with your actual student ID)
Invoke-RestMethod -Uri "https://real-fyp.onrender.com/predict" -Method POST -ContentType "application/json" -Body '{"student_id": 1}'
```

You should see:

```json
{
  "success": true,
  "scores": {
    "programming_score": 100.0,
    "design_score": 100.0,
    "it_infrastructure_score": 76.25,
    "co_curricular_points": 32.5,  ← This should change!
    "feedback_sentiment_score": 59.05,
    "professional_engagement_score": 56.22
  },
  "error": null
}
```

### 4. Check Render Logs

If it still fails:

1. Go to Render Dashboard → Your Service → Logs
2. Look for errors like:
   - `supabase.exceptions.APIError` → Missing environment variables
   - `ModuleNotFoundError` → Missing Python packages
   - `Connection refused` → Supabase connection issue

**Common errors:**

**Error:** `supabase-py module not found`
**Fix:** Check `requirements.txt` has `supabase==2.4.0`

**Error:** `SUPABASE_URL not set`
**Fix:** Add environment variables (Step 2 above)

**Error:** `503 Service Unavailable`
**Fix:** Render service is deploying - wait 2-3 minutes

### 5. Browser Console Debugging

After fixing Render, test from your app:

1. Open your Vercel app
2. Go to Dashboard
3. Press F12 → Console tab
4. Click "Refresh AI Summary & Scores"
5. Look for these logs:

```
☁️ Using REMOTE ML API: https://real-fyp.onrender.com
📤 Sending prediction request for student: 1
📥 ML API response status: 200
✅ ML API result: { success: true, scores: { ... } }
✅ ML scores received: { co_curricular_points: 32.5, ... }
```

If you see:

- `❌ ML API error response:` → Check Render logs
- `status: 500` → Render Python script error
- `status: 503` → Render service offline/deploying

---

## Quick Test Checklist

- [ ] Render service shows "Live" status
- [ ] Environment variables added to Render
- [ ] `/health` endpoint returns `{"status": "healthy"}`
- [ ] `/predict` endpoint returns scores (not 500 error)
- [ ] Browser console shows "✅ ML scores received"
- [ ] Dashboard shows updated co-curricular score

---

## Alternative: Run Locally

If Render keeps failing, run everything locally:

1. **Update `.env.local`:**

   ```env
   USE_LOCAL_ML=true
   ML_API_URL=http://localhost:8000
   ```

2. **Start ML API locally:**

   ```powershell
   cd ml
   python api_server.py
   ```

3. **Start Next.js locally:**

   ```powershell
   npm run dev
   ```

4. **Access:** http://localhost:3000

This bypasses Render entirely and runs everything on your machine.
