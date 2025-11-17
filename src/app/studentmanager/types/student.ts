// src/app/studentmanager/types/student.ts
export interface Student {
  id: number;
  name: string | null;
  gender: string | null;
  program: string | null;
  cgpa: number | null;
  design_score?: number | null;
  it_infrastructure_score?: number | null;
  co_curricular_points?: number | null;
  feedback_score?: number | null;
  engagement_score?: number | null;
  image_url?: string | null;
  description?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  programming_score?: string | null;
  feedback_sentiment_score?: number | null;
  professional_engagement_score?: number | null;
  recommended_career?: string | null;
  feedback?: string | null;
  social_media?: string | null;
  last_summary_updated?: string | null;
  last_hash?: string | null;
  level?: string | null;
  dob?: string | null;
  analysis?: unknown;
  created_at?: string | null;
}

