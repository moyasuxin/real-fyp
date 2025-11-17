-- Co-curricular Activities Table (AI-Analyzed Version)
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.cocurricular_activities (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  student_id bigint NOT NULL,
  
  -- Structured input fields
  organization_name text NOT NULL,
  organization_type text,
  position text,
  responsibilities text,
  activity_period text,
  
  -- AI-generated analysis
  ai_impact_score numeric DEFAULT 0,
  ai_leadership_score numeric DEFAULT 0,
  ai_relevance_score numeric DEFAULT 0,
  ai_summary text,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT cocurricular_activities_pkey PRIMARY KEY (id),
  CONSTRAINT cocurricular_activities_student_id_fkey FOREIGN KEY (student_id) 
    REFERENCES public.students(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cocurricular_student_id 
  ON public.cocurricular_activities(student_id);

-- Optional: Add RLS (Row Level Security) policies if needed
-- ALTER TABLE public.cocurricular_activities ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.cocurricular_activities IS 
  'Stores co-curricular activities with AI-analyzed impact scores';
COMMENT ON COLUMN public.cocurricular_activities.organization_name IS 
  'Name of the club/organization (e.g., Computing Club, School Basketball Team, Red Cross)';
COMMENT ON COLUMN public.cocurricular_activities.organization_type IS 
  'Type: Computing Club, School Club, Outside Organization, Sports Team, NGO, etc.';
COMMENT ON COLUMN public.cocurricular_activities.position IS 
  'Role/position held (e.g., President, Member, Vice President, Volunteer)';
COMMENT ON COLUMN public.cocurricular_activities.responsibilities IS 
  'Description of duties and achievements';
COMMENT ON COLUMN public.cocurricular_activities.activity_period IS 
  'Duration of involvement (e.g., Jan 2023 - Dec 2023, 1 year)';
COMMENT ON COLUMN public.cocurricular_activities.ai_impact_score IS 
  'AI-analyzed impact level (0-100) based on responsibilities and achievements';
COMMENT ON COLUMN public.cocurricular_activities.ai_leadership_score IS 
  'AI-analyzed leadership level (0-100) based on position and activities';
COMMENT ON COLUMN public.cocurricular_activities.ai_relevance_score IS 
  'AI-analyzed computing relevance (0-100) for technical activities';
