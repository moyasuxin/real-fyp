from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

# Fetch all co-curricular activities
activities = supabase.table('cocurricular_activities').select('*').execute()

print(f'Total activities: {len(activities.data)}')
print()

for a in activities.data[:20]:
    print(f"Student {a['student_id']}: {a.get('activity_name', 'N/A')}")
    print(f"  Impact: {a.get('ai_impact_score', 0)}, Leadership: {a.get('ai_leadership_score', 0)}, Relevance: {a.get('ai_relevance_score', 0)}")
    print()
