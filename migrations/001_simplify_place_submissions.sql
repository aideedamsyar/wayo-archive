-- ============================================
-- WAYO WEB APP - Simplified Place Submissions
-- ============================================
-- Drop the overly complex table and recreate with only essentials
-- Migration: 001_simplify_place_submissions
-- Date: 2024-11-18

-- Drop existing table if it exists
DROP TABLE IF EXISTS place_submissions CASCADE;

-- Create simplified table (7 columns only)
CREATE TABLE place_submissions (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Required user input
  place_name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  photo_url TEXT NOT NULL,  -- Single R2 URL from direct client upload

  -- Optional user input
  email TEXT,  -- For follow-up communication (not required for submission)

  -- System fields
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable Row Level Security
ALTER TABLE place_submissions ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can insert (no auth required for public submissions)
CREATE POLICY "Anyone can submit places"
  ON place_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Only service role can read (admin access via Supabase dashboard)
CREATE POLICY "Only admins can read submissions"
  ON place_submissions FOR SELECT
  USING (auth.role() = 'service_role');

-- Policy 3: Only service role can update (manual approval)
CREATE POLICY "Only admins can update status"
  ON place_submissions FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX idx_submissions_created_at ON place_submissions(submitted_at DESC);
CREATE INDEX idx_submissions_status ON place_submissions(status);
CREATE INDEX idx_submissions_country ON place_submissions(country);

-- Add comment for documentation
COMMENT ON TABLE place_submissions IS 'Simple place submissions from web-app landing page. Users submit favorite travel places with name, location, and photo.';
COMMENT ON COLUMN place_submissions.photo_url IS 'Cloudflare R2 URL from direct client-side upload (e.g., https://gallery.wayo.com/gallery/timestamp-filename.jpg)';
COMMENT ON COLUMN place_submissions.email IS 'Optional email for follow-up. Not required for anonymous submissions.';
COMMENT ON COLUMN place_submissions.status IS 'Manual approval status: pending (default), approved (show in gallery), rejected (spam/inappropriate)';
