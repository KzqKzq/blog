-- ====================================
-- Blog Admin Dashboard - Database Schema
-- ====================================
-- Run this script in your Supabase SQL Editor
-- ====================================

-- 1. Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- Indexes for Performance
-- ====================================

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

-- ====================================
-- Row Level Security (RLS) Policies
-- ====================================

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Posts Policies
-- Anyone can view published posts
CREATE POLICY "Public can view published posts"
  ON posts FOR SELECT
  USING (status = 'published');

-- Authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can manage posts"
  ON posts FOR ALL
  USING (auth.role() = 'authenticated');

-- Comments Policies
-- Anyone can view approved comments
CREATE POLICY "Public can view approved comments"
  ON comments FOR SELECT
  USING (status = 'approved');

-- Authenticated users can manage all comments
CREATE POLICY "Authenticated users can manage comments"
  ON comments FOR ALL
  USING (auth.role() = 'authenticated');

-- Site Settings Policies
-- Anyone can read settings
CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

-- Only authenticated users can update settings
CREATE POLICY "Authenticated users can manage settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- ====================================
-- Trigger: Auto-update updated_at timestamp
-- ====================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- Initial Data Seeding (Optional)
-- ====================================

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('site_info', '{"title": "我的博客", "description": "一个极简的个人博客", "logo_url": ""}'::jsonb),
  ('comment_settings', '{"enabled": true, "require_moderation": true}'::jsonb),
  ('seo_defaults', '{"meta_description": "分享技术文章与生活感悟", "keywords": "博客,技术,编程"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ====================================
-- Verification Queries
-- ====================================
-- Run these to verify everything is set up correctly:

-- Check tables exist
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('posts', 'comments', 'site_settings');

-- Check policies
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Check default settings
-- SELECT * FROM site_settings;
