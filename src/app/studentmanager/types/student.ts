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
  image_url?: string | null; // optional
  description?: string | null; // optional
}

