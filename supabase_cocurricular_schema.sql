-- Co-curricular Activities Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.cocurricular_activities (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  student_id bigint NOT NULL,
  activity_name text NOT NULL,
  activity_type text,
  activity_date date,
  description text,
  points numeric DEFAULT 1,
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
  'Stores co-curricular activities for students including clubs, competitions, volunteering, etc.';
COMMENT ON COLUMN public.cocurricular_activities.activity_type IS 
  'Type of activity: Sports, Club, Competition, Volunteering, Leadership, etc.';
COMMENT ON COLUMN public.cocurricular_activities.points IS 
  'Point value for the activity (default 1, can be weighted for major achievements)';
