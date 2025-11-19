// Dashboard Student Types
export interface Student {
  id: number;
  name: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  image_url: string;
  description: string | null;
  level: string;
  program: string;
  created_at?: string | null;
  cgpa?: string | null;
  programming_score?: string | null;
  design_score?: string | null;
  it_infrastructure_score?: string | null;
  co_curricular_points?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  recommended_career?: string | null;
  feedback?: string | null;
  social_media?: string | null;
  last_summary_updated?: string | null;
  last_hash?: string | null;
  feedback_sentiment_score?: number | null;
  professional_engagement_score?: number | null;
}

export interface StudentCardData {
  id: number;
  name: string | null;
  alias?: string | null;
  image_url: string | null;
  bgColor?: string;
}

export interface StudentChartData {
  programming_score?: string | number;
  design_score?: string | number;
  it_infrastructure_score?: string | number;
  co_curricular_points?: string | number;
  feedback_sentiment_score?: string | number;
  professional_engagement_score?: string | number;
}
