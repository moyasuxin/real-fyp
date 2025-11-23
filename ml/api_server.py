"""
FastAPI server for ML predictions
Can run locally for testing or deploy to Railway for production
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import os
import sys

app = FastAPI(title="Student ML Prediction API")

# Enable CORS for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    student_id: int

class PredictResponse(BaseModel):
    success: bool
    scores: dict | None = None
    error: str | None = None

@app.get("/")
def read_root():
    return {
        "message": "Student ML Prediction API",
        "status": "running",
        "endpoints": {
            "/predict": "POST - Predict student scores",
            "/health": "GET - Health check"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    """
    Run ML prediction for a student
    """
    try:
        # Get the directory where this script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        predict_script = os.path.join(script_dir, "predict_student.py")
        
        # Check if predict_student.py exists
        if not os.path.exists(predict_script):
            raise HTTPException(
                status_code=500, 
                detail=f"predict_student.py not found at {predict_script}"
            )
        
        # Run the Python prediction script
        result = subprocess.run(
            [sys.executable, predict_script, str(request.student_id)],
            capture_output=True,
            text=True,
            timeout=60,
            cwd=script_dir
        )
        
        if result.returncode != 0:
            error_msg = result.stderr or result.stdout
            raise HTTPException(
                status_code=500,
                detail=f"Prediction failed: {error_msg}"
            )
        
        # Parse the JSON output from predict_student.py
        try:
            output = json.loads(result.stdout.strip())
            
            if not output.get("success"):
                raise HTTPException(
                    status_code=400,
                    detail=output.get("error", "Prediction failed")
                )
            
            return PredictResponse(
                success=True,
                scores=output.get("scores"),
                error=None
            )
            
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse prediction output: {str(e)}\nOutput: {result.stdout}"
            )
    
    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=504,
            detail="Prediction timed out (>60s)"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
