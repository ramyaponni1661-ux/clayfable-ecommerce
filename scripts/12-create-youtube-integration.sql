-- New file for YouTube API integration tables
-- YouTube video metadata and analytics
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL, -- YouTube video ID
    title TEXT,
    description TEXT,
    thumbnail_url TEXT,
    duration INTEGER, -- in seconds
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for YouTube videos
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "youtube_videos_public_read" ON public.youtube_videos FOR SELECT USING (is_active = true);
CREATE POLICY "youtube_videos_admin_all" ON public.youtube_videos FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- YouTube playlists for product categories
CREATE TABLE IF NOT EXISTS public.youtube_playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    playlist_id TEXT NOT NULL, -- YouTube playlist ID
    title TEXT,
    description TEXT,
    thumbnail_url TEXT,
    video_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for YouTube playlists
ALTER TABLE public.youtube_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "youtube_playlists_public_read" ON public.youtube_playlists FOR SELECT USING (is_active = true);
CREATE POLICY "youtube_playlists_admin_all" ON public.youtube_playlists FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_youtube_videos_product_id ON public.youtube_videos(product_id);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_video_id ON public.youtube_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_playlists_category_id ON public.youtube_playlists(category_id);
