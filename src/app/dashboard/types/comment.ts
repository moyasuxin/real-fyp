// Dashboard Comment Types
export interface Comment {
  id: number;
  student_id: number;
  commenter_id: string;
  commenter_name: string;
  content: string;
  created_at: string;
}

export interface AnalysisResult {
  sentiment_score: number;
  is_useful: boolean;
  summary: string;
  average_score: number;
}
