#!/bin/bash

echo "Setting up Vercel environment variables for Clayfable..."

# Add environment variables to Vercel production
echo "http://localhost:3000" | vercel env add NEXTAUTH_URL development
echo "https://www.clayfable.com" | vercel env add NEXTAUTH_URL production

echo "clayfable-super-secret-key-for-local-development-2024" | vercel env add NEXTAUTH_SECRET development
echo "clayfable-super-secret-key-for-production-2024-secure" | vercel env add NEXTAUTH_SECRET production

echo "your-google-oauth-client-id-here" | vercel env add GOOGLE_CLIENT_ID development
echo "your-google-oauth-client-id-here" | vercel env add GOOGLE_CLIENT_ID production

echo "your-google-oauth-client-secret-here" | vercel env add GOOGLE_CLIENT_SECRET development
echo "your-google-oauth-client-secret-here" | vercel env add GOOGLE_CLIENT_SECRET production

echo "your-facebook-client-id-here" | vercel env add FACEBOOK_CLIENT_ID development
echo "your-facebook-client-id-here" | vercel env add FACEBOOK_CLIENT_ID production

echo "your-facebook-client-secret-here" | vercel env add FACEBOOK_CLIENT_SECRET development
echo "your-facebook-client-secret-here" | vercel env add FACEBOOK_CLIENT_SECRET production

echo "https://qpakxnrprgwvddpmbjyv.supabase.co" | vercel env add SUPABASE_URL development
echo "https://qpakxnrprgwvddpmbjyv.supabase.co" | vercel env add SUPABASE_URL production

echo "https://qpakxnrprgwvddpmbjyv.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL development
echo "https://qpakxnrprgwvddpmbjyv.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwYWt4bnJwcmd3dmRkcG1ianl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTM3NTYsImV4cCI6MjA3NDEyOTc1Nn0.qRWZhiPv4CUzQVvPa37XrbqmXTulGp7x-07kHW-IohA" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwYWt4bnJwcmd3dmRkcG1ianl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTM3NTYsImV4cCI6MjA3NDEyOTc1Nn0.qRWZhiPv4CUzQVvPa37XrbqmXTulGp7x-07kHW-IohA" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwYWt4bnJwcmd3dmRkcG1ianl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU1Mzc1NiwiZXhwIjoyMDc0MTI5NzU2fQ.MJiwG_nnCzXdbi56814I7nB1MC1jv3X78Eo7Xfq-Qu4" | vercel env add SUPABASE_SERVICE_ROLE_KEY development
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwYWt4bnJwcmd3dmRkcG1ianl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU1Mzc1NiwiZXhwIjoyMDc0MTI5NzU2fQ.MJiwG_nnCzXdbi56814I7nB1MC1jv3X78Eo7Xfq-Qu4" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo "3Y+PitIp50p9pFoUVHyzcgjAmBsd/YtMfavsVYHR2zsMlMk/ggGBhi4t3V8VdgEQQx37QTgmwapFqSUir6zBtg==" | vercel env add SUPABASE_JWT_SECRET development
echo "3Y+PitIp50p9pFoUVHyzcgjAmBsd/YtMfavsVYHR2zsMlMk/ggGBhi4t3V8VdgEQQx37QTgmwapFqSUir6zBtg==" | vercel env add SUPABASE_JWT_SECRET production

echo "your-youtube-api-key-here" | vercel env add YOUTUBE_API_KEY development
echo "your-youtube-api-key-here" | vercel env add YOUTUBE_API_KEY production

echo "your-youtube-channel-id-here" | vercel env add YOUTUBE_CHANNEL_ID development
echo "your-youtube-channel-id-here" | vercel env add YOUTUBE_CHANNEL_ID production

echo "https://www.clayfable.com" | vercel env add NEXT_PUBLIC_SITE_URL development
echo "https://www.clayfable.com" | vercel env add NEXT_PUBLIC_SITE_URL production

echo "support@clayfable.com" | vercel env add SUPPORT_EMAIL development
echo "support@clayfable.com" | vercel env add SUPPORT_EMAIL production

echo "noreply@clayfable.com" | vercel env add NOREPLY_EMAIL development
echo "noreply@clayfable.com" | vercel env add NOREPLY_EMAIL production

echo "rzp_test_placeholder" | vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID development
echo "rzp_live_placeholder" | vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID production

echo "your-razorpay-key-secret-here" | vercel env add RAZORPAY_KEY_SECRET development
echo "your-razorpay-key-secret-here" | vercel env add RAZORPAY_KEY_SECRET production

echo "Environment variables setup completed!"
echo ""
echo "Next steps:"
echo "1. Make the script executable: chmod +x vercel-env-setup.sh"
echo "2. Run the script: ./vercel-env-setup.sh"
echo "3. Deploy to Vercel: vercel --prod"
echo ""
echo "Make sure you have vercel CLI installed and logged in:"
echo "npm i -g vercel"
echo "vercel login"