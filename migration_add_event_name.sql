-- Migration: Add event_name column to cocurricular_activities table
-- Run this in Supabase SQL Editor if you have existing data

-- Step 1: Add the event_name column (nullable first)
ALTER TABLE public.cocurricular_activities 
ADD COLUMN IF NOT EXISTS event_name text;

-- Step 2: Update existing records with a default value
-- (You can modify this to set more meaningful values based on organization_name)
UPDATE public.cocurricular_activities 
SET event_name = organization_name || ' Activity'
WHERE event_name IS NULL;

-- Step 3: Make the column NOT NULL
ALTER TABLE public.cocurricular_activities 
ALTER COLUMN event_name SET NOT NULL;

-- Step 4: Add comment
COMMENT ON COLUMN public.cocurricular_activities.event_name IS 
  'Name of the specific event or activity (e.g., Hackathon 2023, Workshop Series, Community Service Project)';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cocurricular_activities' 
ORDER BY ordinal_position;
