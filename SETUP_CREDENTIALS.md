# 🔐 Credentials Setup Guide

## IMPORTANT: Security Notice
The live Razorpay credentials have been removed from this codebase for security reasons. You need to set up your own credentials to run the application.

## 📋 Required Credentials

### 1. Razorpay Payment Gateway
**For Development:**
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX  # Your test key
RAZORPAY_KEY_SECRET=your_test_secret_here        # Your test secret
```

**For Production:**
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX  # Your live key
RAZORPAY_KEY_SECRET=your_live_secret_here        # Your live secret
```

**Where to get them:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → API Keys
3. Generate/Copy your Test and Live keys

### 2. Supabase Database
```bash
SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to get them:**
1. Go to [Supabase](https://supabase.com/dashboard)
2. Navigate to your project → Settings → API
3. Copy the Project URL and API keys

### 3. OAuth Providers (Optional)
**Google OAuth:**
```bash
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## 🚀 Setup Instructions

### Step 1: Copy Environment Template
```bash
cp .env.example .env.local
```

### Step 2: Update .env.local
Open `.env.local` and replace all placeholder values with your actual credentials.

### Step 3: Verify Setup
```bash
npm run dev
```

The application should start without errors. If you see Razorpay errors, your keys are not set correctly.

## 🔒 Security Best Practices

### ✅ DO:
- Use test keys for development
- Use live keys only for production
- Keep `.env.local` in `.gitignore` (already done)
- Never commit credentials to git
- Use environment variables in deployment

### ❌ DON'T:
- Never expose live keys in code
- Never commit .env.local to git
- Never share credentials in chat/email
- Never use live keys for testing

## 🚨 If You Had Live Keys Exposed

If you accidentally exposed live Razorpay keys:

1. **Immediately regenerate keys** in Razorpay Dashboard
2. **Update your production deployment** with new keys
3. **Monitor your Razorpay transactions** for any unauthorized activity
4. **Contact Razorpay support** if you notice suspicious activity

## 📚 Documentation

- [Razorpay API Documentation](https://razorpay.com/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## 🆘 Troubleshooting

**"Key ID is missing" error:**
- Check that `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set in `.env.local`
- Restart your development server after adding credentials

**"Payment verification failed":**
- Check that `RAZORPAY_KEY_SECRET` matches your key ID
- Ensure you're using test keys for development

**Database connection errors:**
- Verify your Supabase credentials
- Check that your database tables are created (run SQL scripts in `/scripts/`)

## 📞 Support

If you need help setting up credentials:
1. Check the troubleshooting section above
2. Refer to the provider's official documentation
3. Contact your development team