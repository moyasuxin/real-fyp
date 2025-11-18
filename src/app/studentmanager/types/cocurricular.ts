// src/app/studentmanager/types/cocurricular.ts
export interface CocurricularActivity {
  id: number;
  student_id: number;
  organization_name: string;
  organization_type: string | null;
  position: string | null;
  responsibilities: string | null;
  activity_period: string | null;
  ai_impact_score: number;
  ai_leadership_score: number;
  ai_relevance_score: number;
  ai_summary: string | null;
  created_at: string;
}
