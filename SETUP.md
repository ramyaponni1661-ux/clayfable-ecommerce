# Clayfable Ecommerce Setup Guide

This guide will help you set up the Google OAuth login flow and YouTube API integration for your Clayfable ecommerce website.

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Google Cloud Console account
- YouTube channel for video content

## 1. Supabase Setup

### Authentication Configuration

1. **Enable Google OAuth Provider:**
   - Go to your Supabase Dashboard
   - Navigate to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials (see Google setup below)

2. **Add Facebook OAuth (Optional):**
   - Enable Facebook provider in Supabase
   - Add your Facebook App credentials

3. **Configure Site URL:**
   - In Authentication > URL Configuration
   - Add your site URL: `http://localhost:3000` (development) or your production domain
   - Add redirect URLs: `http://localhost:3000/auth/callback`

### Database Setup

Run the SQL script to create YouTube integration tables:

```sql
-- Run the script in scripts/12-create-youtube-integration.sql
-- This creates tables for youtube_videos and youtube_playlists
```

## 2. Google Cloud Console Setup

### Enable YouTube Data API v3

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3:
   - Go to APIs & Services > Library
   - Search for "YouTube Data API v3"
   - Click Enable

### Create API Key

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "API Key"
3. Copy the API key for your `.env` file
4. (Optional) Restrict the API key to YouTube Data API v3 for security

### Setup OAuth 2.0 (for Google Login)

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Configure the consent screen first if prompted
4. Select "Web application"
5. Add authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
   - Replace `your-project-id` with your actual Supabase project ID
6. Copy the Client ID and Client Secret for Supabase configuration

### Get YouTube Channel ID

1. Go to your YouTube channel
2. Click on your profile picture > "Your channel"
3. The URL will show your channel ID: `https://www.youtube.com/channel/YOUR_CHANNEL_ID`
4. Copy the channel ID for your `.env` file

## 3. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from .env.example and fill in your values
cp .env.example .env.local
```

Fill in the required values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# YouTube API Configuration
YOUTUBE_API_KEY=your-youtube-api-key-here
YOUTUBE_CHANNEL_ID=your-youtube-channel-id-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Supabase Google OAuth Configuration

1. In your Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console OAuth setup
   - **Client Secret**: From Google Cloud Console OAuth setup

## 5. Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 6. Testing the Integration

### Test Google OAuth Login
1. Go to `/auth/login`
2. Click "Sign in with Google"
3. Complete the OAuth flow
4. You should be redirected to `/account/dashboard`

### Test YouTube Videos Page
1. Go to `/videos`
2. You should see your YouTube videos (or demo data if API key not configured)
3. Test video playback by clicking on video thumbnails

## 7. Features Implemented

### Enhanced Google OAuth Flow
- ✅ Improved error handling
- ✅ Loading states on login buttons
- ✅ Automatic profile creation on first login
- ✅ Better callback page with error states
- ✅ Support for Facebook OAuth

### YouTube API Integration
- ✅ Dedicated videos page (`/videos`)
- ✅ YouTube Data API v3 integration
- ✅ Video search and filtering
- ✅ Playlist support
- ✅ Responsive video player component
- ✅ Fallback to demo data when API not configured
- ✅ Video metadata display (views, likes, duration)

### Database Integration
- ✅ YouTube videos and playlists tables
- ✅ Row Level Security (RLS) policies
- ✅ Admin management capabilities

## 8. Deployment

### Environment Variables for Production

Update your production environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
# Update other variables with production values
```

### Supabase Production Configuration

1. Update redirect URLs in Supabase for production domain
2. Update Google OAuth redirect URIs for production
3. Ensure all environment variables are set in your deployment platform

## 9. Troubleshooting

### Common Issues

1. **Google OAuth not working:**
   - Check redirect URIs in Google Cloud Console
   - Verify Supabase Google provider configuration
   - Ensure NEXT_PUBLIC_SUPABASE_URL is correct

2. **YouTube videos not loading:**
   - Verify YOUTUBE_API_KEY is correct
   - Check that YouTube Data API v3 is enabled
   - Verify YOUTUBE_CHANNEL_ID is correct

3. **Database errors:**
   - Ensure the SQL script has been run in Supabase
   - Check RLS policies are properly configured

### Debug Mode

To see detailed error logs, check the browser console and your deployment logs.

## 10. Next Steps

- Customize the video categories and playlists
- Add video analytics and tracking
- Implement video recommendations
- Add video comments and ratings
- Integrate with your product catalog