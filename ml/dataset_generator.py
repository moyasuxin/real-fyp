# ml/dataset_generator.py
"""
Synthetic dataset generator for Nilai University computing programmes.

Outputs:
- ml/output/students.csv
- ml/output/courses.csv
- ml/output/student_comments.csv

Optional: uploads to Supabase if environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
"""

import os
import random
import csv
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict
from dotenv import load_dotenv
load_dotenv(dotenv_path="ml/.env")

# Optional supabase client upload
try:
    from supabase import create_client
    SUPABASE_AVAILABLE = True
except Exception:
    SUPABASE_AVAILABLE = False

# ---------- CONFIG ----------
OUTPUT_DIR = Path("ml/output")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

NUM_STUDENTS = 500  # adjust large as you want
RANDOM_SEED = 42

# Program list you provided
PROGRAMS = [
    "Bachelor in Computer Science (Honours) (Artificial Intelligence)",
    "Bachelor in Information Technology (Cybersecurity) (Honours)",
    "Bachelor of Software Engineering (Honours) (Application Development) ODL",
    "Bachelor of Computer Science (Honours) (Data Science)",
    "Bachelor of Information Technology (Hons)",
    "Bachelor of Information Technology (Hons) (Internet Engineering and Cloud Computing)",
    "Bachelor in Software Engineering (Honours)",
    "Diploma in Computer Science",
    "Diploma in Information Technology",
]

# Base course pool derived from your CMS example — extendable
# Each tuple: (course_code_prefix, course_name_template, credit_hour, is_degree_course)
BASE_COURSES = [
    ("BM2001","BASIC BUSINESS ADMINISTRATION",3, False),
    ("BM2002","PRINCIPLES OF MICROECONOMICS",3, False),
    ("BM2003","PRINCIPLES OF MACROECONOMICS",3, False),
    ("EC2100","UNDERSTANDING COMPUTING",3, True),
    ("EC2103","COMPUTER ORGANISATION",3, True),
    ("EC2104","STRUCTURED PROGRAMMING",3, True),
    ("EC2106","WEB DEVELOPMENT",3, True),
    ("EC2107","CALCULUS AND ALGEBRA",3, True),
    ("EC2306","OBJECT ORIENTED PROGRAMMING",3, True),
    ("EC2310","DATABASE DEVELOPMENT",3, True),
    ("EC2312","OPERATING SYSTEMS",3, True),
    ("EC2314","INFORMATION SYSTEMS",3, True),
    ("EC2320","SUMMATIVE (COMPUTING PROJECT)",4, True),
    ("EC2321","DATA COMM AND NETWORKING",3, True),
    ("EC3328","SE PROJECT I",2, True),
    ("EC3329","SE PROJECT II",4, True),
    ("EC3357","MACHINE LEARNING",3, True),
    ("EC3374","BACK-END WEB DEVELOPMENT",3, True),
    ("MPU3112","PHILOSOPHY & CURRENT ISSUES",2, True),
]

# Grade distribution probabilities for degree-level courses
GRADE_CHOICES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D+", "D", "F", "CR", "SC", "EX"]
GRADE_WEIGHTS = [0.06, 0.08, 0.07, 0.12, 0.20, 0.12, 0.10, 0.08, 0.06, 0.05, 0.03, 0.02, 0.01, 0.00]
# Note: 'CR' appears for transfer/diploma; 'SC' internship special code; 'EX' exempt etc.

# ---------- HELPERS ----------
random.seed(RANDOM_SEED)

def random_name(i):
    first = ["Ahmad","Aisha","Lim","Chun","Siti","John","Mary","Ali","Nur","Hassan","Wei","Sofia","Ibrahim"]
    last = ["Bin","Binti","Tan","Lim","Kumar","Smith","Lee","Wong","Ng","Hussein"]
    return f"{random.choice(first)} {random.choice(last)}_{i}"

def random_dob():
    # ages between 19 and 30 for undergrad/diploma (approx)
    age = random.randint(18, 28)
    days = random.randint(0, 365)
    d = datetime.now() - timedelta(days=age*365 + days)
    return d.strftime("%Y-%m-%d")

def pick_courses_for_student(program: str):
    # Determine level and expected year length
    is_diploma = program.lower().startswith("diploma")
    courses = []
    # diploma shorter: assume 2-3 years; degree 3-4 years
    years = random.choice([2,3]) if is_diploma else random.choice([3,4])
    semesters = years * 3  # 3 sems per year (2 long, 1 short)
    for sem in range(1, semesters+1):
        # long semesters -> 5-6 courses, short -> 3-4
        if sem % 3 == 0:  # treat every 3rd as short
            num = random.randint(3,4)
        else:
            num = random.randint(5,6) if not is_diploma else random.randint(4,6)
        # draw from base course pool (degree vs diploma)
        for _ in range(num):
            base = random.choice(BASE_COURSES)
            code_prefix, cname, credit_hour, is_degree_course = base
            # If student is diploma, use 2000-level codes mostly:
            if is_diploma:
                # convert degree code to 2000-ish if needed
                if code_prefix.startswith("EC3") or code_prefix.startswith("EC33") or code_prefix.startswith("EC32"):
                    course_code = code_prefix.replace("3", "2", 1)  # rough conversion
                else:
                    course_code = code_prefix
            else:
                # degree: prefer 3000 series for many courses
                if code_prefix.startswith("EC2") and random.random() < 0.5:
                    course_code = code_prefix.replace("2", "3", 1)
                else:
                    course_code = code_prefix
            # grade logic:
            # - diploma courses in degree student's record often become CR (if transferred)
            grade = random.choices(GRADE_CHOICES, weights=GRADE_WEIGHTS, k=1)[0]
            # set 'CR' more likely if course_code starts with 2xx and student is degree and random
            if not is_diploma and course_code.startswith(("BM","EC2","MPU")) and random.random() < 0.25:
                grade = "CR"
            # add interns & special codes rarely
            courses.append({
                "course_name": cname,
                "course_code": course_code,
                "grade": grade,
                "credit_hour": float(credit_hour),
            })
    return courses

def generate_students_and_courses(num_students: int):
    students = []
    courses = []
    comments = []
    sid = 1
    for i in range(1, num_students+1):
        program = random.choice(PROGRAMS)
        name = random_name(i)
        dob = random_dob()
        gender = random.choice(["Male","Female","Other"])
        image_url = f"https://api.example.com/avatar/{i}.jpg"  # default placeholder URL
        created_at = datetime.now().isoformat()
        analysis = {}  # empty until ML processes
        level = "Diploma" if program.lower().startswith("diploma") else "Degree"
        cgpa = None
        students.append({
            "id": sid,
            "name": name,
            "gender": gender,
            "dob": dob,
            "image_url": image_url,
            "description": None,
            "analysis": json.dumps(analysis),
            "level": level,
            "program": program,
            "created_at": created_at,
            "cgpa": None,
        })
        # generate course history
        student_courses = pick_courses_for_student(program)
        # allow duplicates for repeated courses if failed earlier
        # convert to rows, assign unique course ids
        for c in student_courses:
            courses.append({
                "id": len(courses) + 1,
                "student_id": sid,
                "course_name": c["course_name"],
                "course_code": c["course_code"],
                "course_description": None,
                "grade": c["grade"],
                "credit_hour": c["credit_hour"],
                "score": None,
                "created_at": datetime.now().isoformat()
            })
        # Skipping comments: commenter_id requires valid UUID from admin_users table
        # Comments table has FK constraint on commenter_id -> admin_users(id)
        # You can populate comments manually after creating admin users
        sid += 1
    return students, courses, comments

# ---------- MAIN ----------
def save_csv(data: List[Dict], path: Path, fieldnames: List[str]):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            # ensure all keys exist
            out = {k: row.get(k, "") for k in fieldnames}
            writer.writerow(out)
    print("Saved:", path)

def upload_to_supabase_if_configured(students_path, courses_path, comments_path):
    if not SUPABASE_AVAILABLE:
        print("Supabase client not installed, skipping upload.")
        return

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        print("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing — skipping upload.")
        return

    supabase = create_client(url, key)
    import pandas as pd

    print("Uploading CSVs to Supabase (batch insert with ID mapping)...")

    df_students = pd.read_csv(students_path)
    df_courses = pd.read_csv(courses_path)

    # Only read comments if path is provided
    df_comments = None
    if comments_path:
        df_comments = pd.read_csv(comments_path)

    def clean(row_dict):
        for k, v in row_dict.items():
            if isinstance(v, float) and (v != v):  # NaN
                row_dict[k] = None
        return row_dict

    # Build old_id → new_id mapping
    id_map = {}

    # Insert students
    print("Inserting students...")
    for _, r in df_students.iterrows():
        payload = clean(r.to_dict())
        old_id = payload.pop("id", None)
        result = supabase.table("students").insert(payload).execute()
        if result.data and len(result.data) > 0:
            new_id = result.data[0].get("id")
            if new_id:
                id_map[old_id] = new_id

    print(f"Inserted {len(id_map)} students")

    # Insert courses
    print("Inserting courses...")
    for _, r in df_courses.iterrows():
        payload = clean(r.to_dict())
        payload.pop("id", None)
        old_sid = payload.get("student_id")
        if old_sid in id_map:
            payload["student_id"] = id_map[old_sid]
        supabase.table("courses").insert(payload).execute()

    # Insert comments only if CSV exists
    if df_comments is not None:
        print("Inserting comments...")
        for _, r in df_comments.iterrows():
            payload = clean(r.to_dict())
            payload.pop("id", None)
            old_sid = payload.get("student_id")
            if old_sid in id_map:
                payload["student_id"] = id_map[old_sid]
            supabase.table("student_comments").insert(payload).execute()

    print("✅ Upload done (batch with ID mapping).")



def main(save_and_upload=False, num=NUM_STUDENTS):
    print("Generating synthetic dataset ...")
    students, courses, comments = generate_students_and_courses(num)
    s_path = OUTPUT_DIR / "students.csv"
    c_path = OUTPUT_DIR / "courses.csv"
    com_path = OUTPUT_DIR / "student_comments.csv"

    save_csv(students, s_path, [
        "id","name","gender","dob","image_url","description","analysis",
        "level","program","created_at","cgpa"
    ])
    save_csv(courses, c_path, [
        "id","student_id","course_name","course_code","course_description",
        "grade","credit_hour","score","created_at"
    ])
    # Skip saving comments CSV since we don't have valid commenter_id UUIDs
    # print("Skipped: ml/output/student_comments.csv (no valid admin_users)")

    if save_and_upload:
        # Only upload students and courses; skip comments (no valid admin_users)
        upload_to_supabase_if_configured(s_path, c_path, None)

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--num", type=int, default=NUM_STUDENTS, help="Number of students to generate")
    p.add_argument("--upload", action="store_true", help="Upload generated CSVs to Supabase (requires env vars & supabase lib)")
    args = p.parse_args()
    main(save_and_upload=args.upload, num=args.num)
