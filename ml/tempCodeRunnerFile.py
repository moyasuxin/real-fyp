# ml/train_and_upload.py
import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()  # loads .env

SUPABASE_URL = os.environ["SUPABASE_URL"]
SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
BUCKET = os.environ.get("SUPABASE_BUCKET", "ml-models")
MODEL_FILE = os.environ.get("MODEL_FILE_NAME", "model.joblib")
LOCAL_MODEL_PATH = f"ml/{MODEL_FILE}"

supabase = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

# --- Replace this with your real feature-engineering ---
def build_training_df(df_students, df_courses, df_comments):
    print("Courses columns:", df_courses.columns.tolist())  # 👈 Add this line
    grade_map = {"A+":4.0,"A":4.0,"A-":3.67,"B+":3.33,"B":3.0,"B-":2.67,"C+":2.33,"C":2.0,"D+":1.33,"D":1.0,"F":0.0}
    df_courses['grade_norm'] = df_courses['grade'].fillna('').str.upper().str.strip()
    df_courses['grade_point'] = df_courses['grade_norm'].map(grade_map)
    agg = df_courses.groupby('student_id').agg(
        total_units=('credit_hour', 'sum'),
        avg_grade_point=('grade_point', 'mean'),
        num_courses=('id','count')
    ).reset_index().fillna(0)
    comments_len = df_comments.groupby('student_id').content.apply(lambda s: s.str.len().sum()).reset_index(name='comments_total_len')
    df = df_students[['id']].merge(agg, left_on='id', right_on='student_id', how='left').merge(comments_len, left_on='id', right_on='student_id', how='left').fillna(0).set_index('id')
    X = df[['total_units','avg_grade_point','num_courses','comments_total_len']]
    # Toy synthetic targets (replace with real labeled targets or rule-based labels)
    y = pd.DataFrame({
        "programming_score": X['avg_grade_point'] * 25 + X['num_courses'] * 0.5,
        "design_score": X['avg_grade_point'] * 20 + X['comments_total_len'] * 0.01,
        "it_infrastructure_score": X['avg_grade_point'] * 22,
        "co_curricular_points": X['num_courses'] * 2 + X['total_units'] * 1,
        "feedback_sentiment_score": X['comments_total_len'] * 0.05
    }, index=X.index)
    return X, y

def fetch_from_supabase():
    students = supabase.table("students").select("*").execute().data
    courses = supabase.table("courses").select("*").execute().data
    comments = supabase.table("student_comments").select("*").execute().data

    # ✅ Change to OR, so fallback triggers if either table has no data
    if len(students) == 0 or len(courses) == 0:
        print("⚠️ Supabase empty — loading sample dataset (UCI Student Performance).")
        df = pd.read_csv("ml/sample_data.csv", sep=";")

        # mimic your structure
        df_students = pd.DataFrame({
            "id": df.index + 1,
            "name": [f"Student {i}" for i in range(len(df))],
        })

        df_courses = pd.DataFrame({
            "id": df.index + 1,  # ✅ add this
            "student_id": df.index + 1,
            "course_name": "Math",
            "grade": df["G3"].apply(lambda g: "A" if g >= 15 else ("B" if g >= 10 else "C")),
            "credit_hour": 3,
            "score": df["G3"]
        })

        df_comments = pd.DataFrame(columns=["student_id", "content"])
        return df_students, df_courses, df_comments


    return pd.DataFrame(students), pd.DataFrame(courses), pd.DataFrame(comments)


def train_and_upload():
    print("Fetching data from Supabase...") 
    ds, dc, dcom = fetch_from_supabase()

    if dc.empty or ds.empty:
        print("⚠️ No training data found in Supabase. Please insert students and courses first.")
        return

    X, y = build_training_df(ds, dc, dcom)
    if X.empty:
        print("⚠️ Feature matrix is empty, skipping training.")
        return
    print("Training model on", X.shape[0], "students ...")
    model = MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42))
    model.fit(X, y)
    os.makedirs(os.path.dirname(LOCAL_MODEL_PATH), exist_ok=True)
    joblib.dump(model, LOCAL_MODEL_PATH)
    print("Model saved locally:", LOCAL_MODEL_PATH)

    # upload to Supabase Storage bucket
    print("Uploading model to Supabase Storage bucket:", BUCKET)
    try:
        with open(LOCAL_MODEL_PATH, "rb") as f:
            try:
                # Try to create bucket if it doesn't exist
                try:
                    supabase.storage.create_bucket(BUCKET, options={"public": False})
                    print(f"ℹ️ Created bucket '{BUCKET}'")
                except Exception:
                    # Bucket might already exist, continue
                    pass
                
                # Note: some HTTP clients normalize headers and expect string values.
                # Passing a boolean here caused `Header value must be str or bytes`.
                # Use string "true" for upsert to avoid boolean being treated as header value.
                res = supabase.storage.from_(BUCKET).upload(
                    MODEL_FILE,
                    f,
                    file_options={
                        "cache_control": "3600",
                        "upsert": "true"
                    }
                )
                print("Upload result:", res)
                print("✅ Model uploaded successfully to Supabase!")
            except Exception as e:
                print(f"⚠️ Upload to Supabase failed: {type(e).__name__}: {e}")
                print("ℹ️ Model saved locally at:", LOCAL_MODEL_PATH)
                print("ℹ️ You can manually upload it later or check your Supabase bucket configuration.")
    except Exception as e:
        print(f"❌ Critical error: {e}")
        raise




if __name__ == "__main__":
    train_and_upload()
