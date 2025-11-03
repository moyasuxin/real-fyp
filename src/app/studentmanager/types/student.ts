// src/app/studentmanager/types/student.ts
export interface Student {
  id: number;
  name: string | null;
  gender: string | null;
  dob: string | null;
  image_url: string | null;
  description: string | null;
  analysis: { [key: string]: number } | null;
  program: string | null;
  cgpa?: number | null;
  programming_score?: number | null;
  design_score?: number | null;
  it_infrastructure_score?: number | null;
  co_curricular_points?: number | null;
  recommended_career?: string | null;
  last_summary_updated?: string | null;
  last_hash?: string | null;
  feedback_score?: number | null;
  engagement_score?: number | null;
}
