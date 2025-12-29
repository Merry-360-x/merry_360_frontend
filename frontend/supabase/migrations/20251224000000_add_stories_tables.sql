-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  location TEXT,
  image TEXT,
  images TEXT[],
  author TEXT,
  user_avatar TEXT,
  category TEXT DEFAULT 'adventure',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story likes table
CREATE TABLE IF NOT EXISTS story_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(story_id, user_id)
);

-- Story comments table
CREATE TABLE IF NOT EXISTS story_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;

-- Stories policies
CREATE POLICY "Anyone can view stories" ON stories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create stories" ON stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories" ON stories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories" ON stories
  FOR DELETE USING (auth.uid() = user_id);

-- Story likes policies
CREATE POLICY "Anyone can view likes" ON story_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like" ON story_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike" ON story_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Story comments policies
CREATE POLICY "Anyone can view comments" ON story_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment" ON story_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON story_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id);
