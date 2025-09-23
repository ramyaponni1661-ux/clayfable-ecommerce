# Google Console OAuth Setup for Clayfable

## Required Redirect URIs:

Add these URLs to your Google Cloud Console OAuth 2.0 Client ID:

### Development:
- `http://localhost:3000/api/auth/callback/google`

### Production:
- `https://www.clayfable.com/api/auth/callback/google`
- `https://clayfable-ecommerce.vercel.app/api/auth/callback/google`

### All Vercel deployments (add as needed):
- `https://clayfable-ecommerce-*-anands-projects-0cb3ff8d.vercel.app/api/auth/callback/google`

## Steps:
1. Go to Google Cloud Console
2. Navigate to APIs & Services > Credentials
3. Find your OAuth 2.0 Client ID: `724550437020-f3qthemh4j01h61b975jpf5sctd37sbc.apps.googleusercontent.com`
4. Add all the above URLs to "Authorized redirect URIs"
5. Add these to "Authorized JavaScript origins":
   - `http://localhost:3000`
   - `https://www.clayfable.com`
   - `https://clayfable-ecommerce.vercel.app`
6. Save the changes
7. Wait 5-10 minutes for propagation

## Automated Environment Setup:

Instead of manually adding environment variables to Vercel, use the automated script:

```bash
# Make script executable
chmod +x vercel-env-setup.sh

# Install Vercel CLI if needed
npm i -g vercel

# Login to Vercel
vercel login

# Run the environment setup
./vercel-env-setup.sh

# Deploy to production
vercel --prod
```

## Test URLs:
- Local Development: http://localhost:3000/auth/signin
- Production: https://www.clayfable.com/auth/signin
- Vercel Preview: https://clayfable-ecommerce.vercel.app/auth/signin

## Troubleshooting:

If you get "Configuration Error":
1. Verify all environment variables are set in Vercel dashboard
2. Check that Google Console has all redirect URIs added
3. Wait 5-10 minutes after changes for propagation
4. Clear browser cache and cookies
5. Check Vercel function logs for detailed error messages