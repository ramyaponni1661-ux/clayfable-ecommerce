# Clayfable Ecommerce Website

🏺 **Authentic Terracotta Crafted with Heritage | EST. 1952**

A modern ecommerce platform for Clayfable's premium terracotta cookware and serveware, built with Next.js and featuring Google OAuth authentication and YouTube integration.

## 🌟 Features

- **🔐 Enhanced Authentication**: Google OAuth integration with Supabase
- **🎥 YouTube Integration**: Educational videos showcasing pottery techniques
- **🛒 Modern Ecommerce**: Product catalog, cart, checkout functionality
- **📱 Responsive Design**: Optimized for all devices
- **🎨 Beautiful UI**: Tailwind CSS with custom animations
- **⚡ Fast Performance**: Next.js with Vercel deployment
- **🌐 SEO Optimized**: Meta tags and structured data

## 🚀 Live Website

**Production**: [https://clayfable.com](https://clayfable.com)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics
- **APIs**: YouTube Data API v3

## 📧 Contact Information

- **Support**: support@clayfable.com
- **Admin**: ramyaponni1661@gmail.com
- **Domain**: clayfable.com (GoDaddy)

## 🏗️ Project Structure

```
clayfable-ecommerce/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── youtube/       # YouTube integration
│   ├── auth/              # Authentication pages
│   ├── videos/            # YouTube videos page
│   ├── products/          # Product catalog
│   └── ...                # Other pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── ...               # Custom components
├── lib/                  # Utilities and configurations
│   └── supabase/         # Supabase client setup
├── scripts/              # Database scripts
└── public/               # Static assets
```

## 🎯 Key Pages

- **Home**: `/` - Landing page with featured products
- **Products**: `/products` - Product catalog
- **Videos**: `/videos` - YouTube educational content
- **Authentication**: `/auth/login`, `/auth/signup`
- **Account**: `/account/dashboard`
- **Cart & Checkout**: `/cart`, `/checkout`

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Google Cloud Console account

### Local Development
```bash
# Clone repository
git clone https://github.com/ramyaponni1661/clayfable-ecommerce.git
cd clayfable-ecommerce

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Fill in your environment variables

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the website.

## 📖 Documentation

- **[Setup Guide](SETUP.md)** - Complete setup instructions
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment guide

## 🎨 Design Features

- **Authentic Branding**: Orange/amber color scheme reflecting terracotta
- **Smooth Animations**: Custom CSS animations and transitions
- **Modern Layout**: Clean, professional design
- **Mobile-First**: Responsive design for all screen sizes

## 🔐 Authentication Features

- **Google OAuth**: One-click sign in with Google
- **Facebook OAuth**: Alternative social login
- **Email/Password**: Traditional authentication
- **Profile Management**: Automatic profile creation
- **Secure Callbacks**: Proper error handling and redirects

## 🎥 YouTube Integration

- **Educational Content**: Pottery making tutorials
- **Video Categories**: Organized by technique and product type
- **Responsive Player**: Embedded YouTube player
- **Search & Filter**: Find specific videos easily
- **Fallback Content**: Demo videos when API not configured

## 📱 Responsive Design

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Great experience on tablets (768px+)
- **Desktop**: Full-featured desktop experience (1024px+)
- **Large Screens**: Enhanced for large displays (1440px+)

## 🛡️ Security Features

- **HTTPS Enforced**: SSL/TLS encryption
- **Security Headers**: XSS protection, content type validation
- **Authentication Security**: Secure OAuth implementation
- **Data Protection**: Row Level Security (RLS) in database

## 📊 Performance

- **Core Web Vitals**: Optimized for Google metrics
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for faster loads
- **Caching**: Optimized caching strategies

## 🌐 SEO Features

- **Meta Tags**: Proper meta descriptions and titles
- **Open Graph**: Social media sharing optimization
- **Structured Data**: Rich snippets for search engines
- **Sitemap**: Automatic sitemap generation

## 🚀 Deployment

The website is deployed on Vercel with automatic deployments from GitHub:

- **Production**: `main` branch → clayfable.com
- **Preview**: Pull requests → automatic preview URLs
- **Analytics**: Vercel Analytics integrated

## 📈 Analytics & Monitoring

- **Vercel Analytics**: Performance and usage metrics
- **Error Tracking**: Built-in error monitoring
- **Performance Monitoring**: Core Web Vitals tracking

## 🔄 CI/CD Pipeline

- **Automatic Builds**: Every push triggers build
- **Type Checking**: TypeScript validation
- **Linting**: Code quality checks
- **Preview Deployments**: PR previews for testing

## 📞 Support & Maintenance

For technical support or questions:
- **Email**: support@clayfable.com
- **Issues**: GitHub Issues for bug reports
- **Documentation**: Check SETUP.md and DEPLOYMENT.md

## 📄 License

© 2024 Clayfable. All rights reserved.

---

**Built with ❤️ for authentic terracotta craftsmanship**

*Clayfable - Preserving 72 years of heritage in every piece*