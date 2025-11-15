# ml/train_and_upload.py

import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from dotenv import load_dotenv

# ─────────────────────────────────────────────
# Load environment variables
# ─────────────────────────────────────────────
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
BUCKET = os.environ.get("SUPABASE_BUCKET", "ml-models")
MODEL_FILE = os.environ.get("MODEL_FILE_NAME", "model.joblib")
LOCAL_MODEL_PATH = f"ml/{MODEL_FILE}"

# ─────────────────────────────────────────────
# Load dataset from ml/output
# ─────────────────────────────────────────────
df_students = pd.read_csv("ml/output/students.csv")
df_courses = pd.read_csv("ml/output/courses.csv")
df_comments = pd.read_csv("ml/output/student_comments.csv", on_bad_lines="skip")


# ─────────────────────────────────────────────
# Feature Engineering
# ─────────────────────────────────────────────
def build_training_df(df_students, df_courses, df_comments):

    grade_map = {
        "A+": 4.0, "A": 4.0, "A-": 3.67,
        "B+": 3.33, "B": 3.0, "B-": 2.67,
        "C+": 2.33, "C": 2.0,
        "D+": 1.33, "D": 1.0,
        "F": 0.0
    }

    df_courses["grade_norm"] = df_courses["grade"].fillna("").str.upper().str.strip()
    df_courses["grade_point"] = df_courses["grade_norm"].map(grade_map)

    course_stats = df_courses.groupby("student_id").agg(
        total_units=("credit_hour", "sum"),
        avg_grade_point=("grade_point", "mean"),
        num_courses=("id", "count"),
    ).reset_index()

    # Comments
    if not df_comments.empty:
        comment_stats = df_comments.groupby("student_id")["content"] \
            .apply(lambda s: s.str.len().sum()) \
            .reset_index(name="comments_total_len")
    else:
        comment_stats = pd.DataFrame(columns=["student_id", "comments_total_len"])

    df = (
        df_students[["id"]]
        .merge(course_stats, left_on="id", right_on="student_id", how="left")
        .merge(comment_stats, left_on="id", right_on="student_id", how="left")
        .fillna(0)
        .set_index("id")
    )

    X = df[["total_units", "avg_grade_point", "num_courses", "comments_total_len"]]

    # Synthetic labels
    y = pd.DataFrame({
        "programming_score": X['avg_grade_point'] * 25 + X['num_courses'] * 0.5,
        "design_score": X['avg_grade_point'] * 20 + X['comments_total_len'] * 0.01,
        "it_infrastructure_score": X['avg_grade_point'] * 22,
        "co_curricular_points": X['num_courses'] * 2 + X['total_units'],
        "feedback_sentiment_score": X['comments_total_len'] * 0.05
    }, index=X.index)

    return X, y


# ─────────────────────────────────────────────
# Train Model
# ─────────────────────────────────────────────
def train_local_model():

    X, y = build_training_df(df_students, df_courses, df_comments)

    print("Training dataset shape:", X.shape)

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = MultiOutputRegressor(
        RandomForestRegressor(n_estimators=200, random_state=42)
    )

    print("Training model...")
    model.fit(X_train, y_train)

    # Save model
    os.makedirs(os.path.dirname(LOCAL_MODEL_PATH), exist_ok=True)
    joblib.dump(model, LOCAL_MODEL_PATH)
    print("Model saved locally:", LOCAL_MODEL_PATH)

    # ─────────────────────────────────────────────
    # Evaluation
    # ─────────────────────────────────────────────
    y_pred = model.predict(X_test)
    results = {}

    for i, col in enumerate(y.columns):
        mae = mean_absolute_error(y_test.iloc[:, i], y_pred[:, i])
        rmse = mean_squared_error(y_test.iloc[:, i], y_pred[:, i]) ** 0.5  # FIXED
        r2 = r2_score(y_test.iloc[:, i], y_pred[:, i])

        results[col] = {
            "MAE": round(mae, 4),
            "RMSE": round(rmse, 4),
            "R2 Score": round(r2, 4)
        }

    print("\n────────────── ML Evaluation ──────────────")
    for col, metrics in results.items():
        print(f"\n📌 {col}")
        for m, v in metrics.items():
            print(f"   {m}: {v}")

    return model, results


if __name__ == "__main__":
    train_local_model()
