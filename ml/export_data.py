# ml/export_data.py
"""
Export actual data from Supabase for ML training.
This exports real student data with AI-analyzed scores.
"""

import os
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv(dotenv_path="ml/.env")

# Configuration
OUTPUT_DIR = Path("ml/output")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def export_from_supabase():
    """Export data from Supabase to CSV files."""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in ml/.env")
    
    print("Connecting to Supabase...")
    supabase = create_client(url, key)
    
    # Export students
    print("Exporting students...")
    students_response = supabase.table("students").select("*").execute()
    students_data = students_response.data
    print(f"Found {len(students_data)} students")
    
    # Export courses
    print("Exporting courses...")
    courses_response = supabase.table("courses").select("*").execute()
    courses_data = courses_response.data
    print(f"Found {len(courses_data)} courses")
    
    # Export comments (excluding deleted ones for stats)
    print("Exporting comments...")
    comments_response = supabase.table("student_comments").select("*").execute()
    comments_data = comments_response.data
    print(f"Found {len(comments_data)} comments")
    
    # Convert to DataFrames
    df_students = pd.DataFrame(students_data)
    df_courses = pd.DataFrame(courses_data)
    df_comments = pd.DataFrame(comments_data) if comments_data else pd.DataFrame()
    
    # Save to CSV
    students_path = OUTPUT_DIR / "students.csv"
    courses_path = OUTPUT_DIR / "courses.csv"
    comments_path = OUTPUT_DIR / "student_comments.csv"
    
    df_students.to_csv(students_path, index=False)
    print(f"✅ Saved: {students_path}")
    
    df_courses.to_csv(courses_path, index=False)
    print(f"✅ Saved: {courses_path}")
    
    if not df_comments.empty:
        df_comments.to_csv(comments_path, index=False)
        print(f"✅ Saved: {comments_path}")
    else:
        print("⚠️ No comments to export")
    
    # Display summary statistics
    print("\n📊 Data Summary:")
    print(f"Total Students: {len(df_students)}")
    print(f"Total Courses: {len(df_courses)}")
    print(f"Total Comments: {len(df_comments)}")
    
    if not df_students.empty:
        # Show how many students have AI-analyzed scores
        has_feedback = df_students['feedback_sentiment_score'].notna().sum()
        has_engagement = df_students['professional_engagement_score'].notna().sum()
        
        print(f"\nAI-Analyzed Scores:")
        print(f"  - Feedback Sentiment: {has_feedback} students")
        print(f"  - Professional Engagement: {has_engagement} students")
        
        if has_feedback > 0:
            avg_sentiment = df_students['feedback_sentiment_score'].mean()
            print(f"  - Average Feedback Sentiment: {avg_sentiment:.2f}")
    
    print("\n✅ Export complete! Ready for ML training.")
    print("Next step: Run 'python train_and_upload.py' to train the model")

if __name__ == "__main__":
    try:
        export_from_supabase()
    except Exception as e:
        print(f"❌ Export failed: {e}")
        exit(1)
