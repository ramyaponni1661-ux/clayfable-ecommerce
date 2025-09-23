# Clayfable.com Production Deployment Guide

## 🚀 Quick Deployment Checklist

### 1. GitHub Repository Setup
- ✅ Repository created: `clayfable-ecommerce`
- ✅ Code pushed to main branch
- ✅ Email: ramyaponni1661@gmail.com

### 2. Domain Configuration
- 🌐 **Domain**: clayfable.com (GoDaddy)
- 📧 **Support Email**: support@clayfable.com
- 📧 **No-Reply Email**: noreply@clayfable.com

### 3. Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set custom domain: `clayfable.com`
3. Configure environment variables (see below)

## 🔧 Environment Variables for Production

Add these to Vercel Environment Variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://clayfable.com

# YouTube API Configuration
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-youtube-channel-id

# Email Configuration
SUPPORT_EMAIL=support@clayfable.com
NOREPLY_EMAIL=noreply@clayfable.com
```

## 📧 Email Configuration

### Supabase Auth Email Templates

Update your Supabase Auth email templates with:

#### Welcome Email Template
```html
<h2>Welcome to Clayfable!</h2>
<p>Thank you for joining our community of pottery enthusiasts.</p>
<p>Click <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email">here</a> to confirm your email.</p>
<p>Best regards,<br>The Clayfable Team</p>
<p><small>From: noreply@clayfable.com</small></p>
```

#### Reset Password Template
```html
<h2>Reset Your Clayfable Password</h2>
<p>Click <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery">here</a> to reset your password.</p>
<p>If you didn't request this, please ignore this email.</p>
<p>Best regards,<br>The Clayfable Team</p>
<p><small>From: noreply@clayfable.com</small></p>
```

### Email Settings in Supabase
1. Go to Authentication > Settings
2. Update Site URL to: `https://clayfable.com`
3. Add redirect URLs:
   - `https://clayfable.com/auth/callback`
   - `https://clayfable.com/**`

## 🔐 Google OAuth Configuration

Update Google Cloud Console OAuth settings:

### Authorized JavaScript Origins
- `https://clayfable.com`
- `https://your-project-id.supabase.co`

### Authorized Redirect URIs
- `https://your-project-id.supabase.co/auth/v1/callback`

## 🌐 Domain DNS Configuration

### GoDaddy DNS Settings
Configure these DNS records in GoDaddy:

```
Type    Name    Value                           TTL
A       @       76.76.19.61                     600
CNAME   www     cname.vercel-dns.com.           600
```

### Vercel Domain Setup
1. Go to Vercel Dashboard > Project > Settings > Domains
2. Add domain: `clayfable.com`
3. Add domain: `www.clayfable.com` (redirect to main)
4. Follow Vercel's DNS configuration instructions

## 📊 Analytics & Monitoring

### Vercel Analytics
Already configured with `@vercel/analytics` package

### Additional Recommendations
- Set up Google Analytics
- Configure error monitoring (Sentry)
- Set up uptime monitoring

## 🛡️ Security Configuration

### Headers (Already Configured)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

### SSL/TLS
- Vercel provides automatic SSL certificates
- Force HTTPS redirects configured

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial Clayfable ecommerce deployment"
git branch -M main
git remote add origin https://github.com/ramyaponni1661/clayfable-ecommerce.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to vercel.com
2. Import GitHub repository
3. Configure environment variables
4. Deploy

### Step 3: Configure Domain
1. Add clayfable.com in Vercel domains
2. Update DNS records in GoDaddy
3. Wait for DNS propagation (up to 48 hours)

### Step 4: Test Everything
- [ ] Website loads at clayfable.com
- [ ] Google OAuth login works
- [ ] Videos page functions
- [ ] Email notifications work
- [ ] All pages are responsive

## 🔄 Continuous Deployment

Automatic deployment configured for:
- Push to `main` branch → Production deployment
- Pull requests → Preview deployments

## 📞 Support & Maintenance

### Email Addresses
- **Support**: support@clayfable.com
- **No-Reply**: noreply@clayfable.com
- **Admin**: ramyaponni1661@gmail.com

### Monitoring
- Vercel Dashboard for deployment status
- Supabase Dashboard for database/auth
- Google Cloud Console for YouTube API usage

## 🎯 Post-Deployment Tasks

1. **SEO Setup**
   - Add Google Search Console
   - Submit sitemap
   - Configure robots.txt

2. **Social Media Integration**
   - Add social meta tags
   - Configure Open Graph images

3. **Email Marketing**
   - Set up email sequences
   - Configure newsletters

4. **Customer Support**
   - Set up support ticketing system
   - Configure WhatsApp business integration

5. **Analytics**
   - Track user behavior
   - Monitor conversion rates
   - A/B test key pages

## 🆘 Troubleshooting

### Common Issues
1. **Domain not resolving**: Check DNS propagation
2. **OAuth not working**: Verify redirect URIs
3. **Email not sending**: Check Supabase email settings
4. **YouTube videos not loading**: Verify API key

### Emergency Contacts
- Vercel Support: help@vercel.com
- Supabase Support: support@supabase.com
- GoDaddy Support: 1-480-505-8877

---

**Last Updated**: $(date)
**Deployed By**: ramyaponni1661@gmail.com
**Domain**: clayfable.com