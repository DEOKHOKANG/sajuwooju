# Deployment Guide - Sajuwooju Clone

**Project**: sajuwooju-v2
**Framework**: Next.js 16.0.1
**Status**: Production Ready

---

## Quick Start

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
http://localhost:3000
```

---

## Production Deployment

### Option 1: Vercel (Recommended)

Vercel is built for Next.js and offers zero-configuration deployment.

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Deploy**
```bash
# From project root
vercel --prod
```

**Step 3: Follow prompts**
- Connect to Git repository (optional)
- Configure project settings
- Deploy

**Result**: Live URL provided instantly

**Advantages**:
- Automatic deployments on git push
- CDN distribution worldwide
- Automatic HTTPS
- Preview deployments for branches
- Zero configuration needed

---

### Option 2: Netlify

**Step 1: Build project**
```bash
npm run build
```

**Step 2: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

**Step 3: Deploy**
```bash
netlify deploy --prod
```

**Configuration**:
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: `netlify/functions` (if needed)

---

### Option 3: Docker Container

**Step 1: Create Dockerfile**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Step 2: Update next.config.ts**
```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // Add this line
  images: {
    // ... existing config
  },
};
```

**Step 3: Build and run**
```bash
# Build image
docker build -t sajuwooju-v2 .

# Run container
docker run -p 3000:3000 sajuwooju-v2
```

---

### Option 4: Traditional Hosting (VPS/Dedicated)

**Step 1: Build project**
```bash
npm run build
```

**Step 2: Install dependencies on server**
```bash
# On server
npm ci --production
```

**Step 3: Start production server**
```bash
npm start
```

**Step 4: Use PM2 for process management**
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "sajuwooju" -- start

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

**Step 5: Configure Nginx reverse proxy**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Environment Variables

### Current Phase (Homepage Only)

No environment variables required for current implementation.

### Future Phases (User Features)

When implementing Phase 6-7 (Kakao login, user features):

```env
# .env.local
NEXT_PUBLIC_KAKAO_APP_KEY=your_kakao_javascript_key
KAKAO_REST_API_KEY=your_kakao_rest_api_key
NEXT_PUBLIC_API_URL=https://api.your-domain.com
DATABASE_URL=your_database_connection_string
```

**Important**:
- Add `.env.local` to `.gitignore`
- Use environment variable management on your deployment platform
- Never commit secrets to version control

---

## Build Configuration

### package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",      // Development with Turbopack
    "build": "next build",                // Production build
    "start": "next start",                // Start production server
    "lint": "next lint",                  // Run ESLint
    "type-check": "tsc --noEmit"         // TypeScript check
  }
}
```

### Build Output

```bash
npm run build
```

**Expected output**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB        90.3 kB
└ ○ /_not-found                          871 B         85.9 kB

○  (Static)  prerendered as static content
```

**Build artifacts**:
- `.next/static/` - Static assets (JS, CSS, images)
- `.next/server/` - Server-side code
- `public/` - Public assets

---

## Performance Optimization

### Image Optimization

Current configuration in [next.config.ts](next.config.ts):

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io',
    },
    {
      protocol: 'https',
      hostname: 'raw.githubusercontent.com',
    },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

**Features**:
- Automatic format conversion (AVIF/WebP)
- Responsive image sizing
- Lazy loading (below-fold images)
- Priority loading (first hero slide)

### Font Optimization

Font preloading configured in [app/layout.tsx](app/layout.tsx:18-28):

```typescript
<head>
  <link
    rel="preload"
    as="style"
    crossOrigin="anonymous"
    href="https://cdn.jsdelivr.net/.../pretendardvariable.min.css"
  />
</head>
```

**Benefit**: Eliminates FOUT (Flash of Unstyled Text)

---

## CDN Configuration

### Vercel (Automatic)

Vercel automatically distributes your site via Edge Network:
- Automatic CDN distribution
- Smart caching strategies
- Edge functions support

### Cloudflare (Manual Setup)

If using other hosting, add Cloudflare:

**Step 1**: Add site to Cloudflare
**Step 2**: Update DNS to Cloudflare nameservers
**Step 3**: Configure caching rules

```
/* cache everything
Cache Level: Standard
Browser Cache TTL: 4 hours
Edge Cache TTL: 1 day
```

---

## SSL/HTTPS Configuration

### Vercel/Netlify
- Automatic HTTPS with Let's Encrypt
- No configuration needed

### Manual Setup (VPS)

**Using Certbot (Let's Encrypt)**:
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (automatic)
sudo certbot renew --dry-run
```

---

## Monitoring & Analytics

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics

```typescript
// app/layout.tsx
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
  <script dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    `
  }} />
</head>
```

---

## Troubleshooting

### Build Errors

**Issue**: `Module not found`
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Issue**: `Image optimization error`
```bash
# Solution: Check next.config.ts remote patterns
# Ensure hostname matches exactly
```

### Runtime Errors

**Issue**: Images not loading
```bash
# Check browser console for CORS errors
# Verify remotePatterns in next.config.ts
# Ensure CDN allows hotlinking
```

**Issue**: Fonts not loading
```bash
# Verify CDN URL is accessible
# Check CORS headers
# Ensure preload link is correct
```

### Performance Issues

**Issue**: Slow initial load
```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Check for:
# - Unoptimized images
# - Blocking resources
# - Large JavaScript bundles
```

---

## Pre-Deployment Checklist

### Code Quality
- [ ] Run type check: `npm run type-check`
- [ ] Run linter: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in browser

### Content
- [ ] All images loading correctly
- [ ] All text content accurate
- [ ] Links working (if any)
- [ ] Meta tags configured

### Performance
- [ ] Images optimized (Next.js Image)
- [ ] Fonts preloaded
- [ ] No blocking resources
- [ ] Lighthouse score reviewed

### SEO
- [ ] Title tag set
- [ ] Meta description set
- [ ] Open Graph tags (optional)
- [ ] Sitemap generated (if needed)

### Security
- [ ] No API keys exposed
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS configured properly

---

## Post-Deployment Verification

### Functional Testing

**Homepage**:
- [ ] Hero slider auto-plays (3s interval)
- [ ] Hero slider pauses on hover
- [ ] Category items animate on scroll
- [ ] Event banner animates on scroll
- [ ] Ranking section animates on scroll
- [ ] Hover effects work on interactive elements
- [ ] Chat button appears and is clickable

**Visual Testing**:
- [ ] Layout matches original (600px max-width)
- [ ] Colors accurate
- [ ] Typography correct
- [ ] Spacing consistent
- [ ] Border radius accurate
- [ ] Images display correctly

**Performance Testing**:
- [ ] Initial load < 3 seconds
- [ ] Images load progressively
- [ ] Animations smooth (60fps)
- [ ] No layout shifts (CLS < 0.1)

### Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (iOS/Android)
- [ ] Mobile Safari (iOS)

### Lighthouse Audit

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

```bash
lighthouse https://your-deployed-url.com --view
```

---

## Rollback Procedure

### Vercel
```bash
# View deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Git-based Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard [commit-hash]
git push -f origin main
```

### PM2 (VPS)
```bash
# Stop current process
pm2 stop sajuwooju

# Pull previous version
git checkout [previous-commit]
npm run build

# Restart
pm2 restart sajuwooju
```

---

## Scaling Considerations

### Current Architecture
- Static site generation (SSG)
- No database required
- No API endpoints
- Edge-ready

### Future Scaling (Phase 6-7)

When adding user features:

**Database**:
- PostgreSQL (Vercel Postgres recommended)
- Prisma ORM for type-safe queries
- Connection pooling

**API Routes**:
- Next.js API routes for backend
- Rate limiting for security
- Caching strategies

**Authentication**:
- Kakao OAuth integration
- Session management (NextAuth.js)
- Secure cookie handling

**Caching**:
- Redis for session storage
- ISR (Incremental Static Regeneration)
- API response caching

---

## Maintenance Schedule

### Weekly
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Review analytics

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Security audit: `npm audit`
- [ ] Lighthouse performance check
- [ ] Backup configuration

### Quarterly
- [ ] Major dependency updates
- [ ] Framework upgrades (Next.js)
- [ ] Content review and updates
- [ ] Performance optimization review

---

## Support Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [FINAL_REPORT.md](FINAL_REPORT.md) - Project overview

### Community
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Next.js Discord](https://discord.gg/nextjs)

### Project-Specific
- [PHASE_3_COMPLETE_REPORT.md](PHASE_3_COMPLETE_REPORT.md) - Interactions & animations
- [Production Clone Skill](.claude/skills/production-clone.md) - Methodology

---

## Emergency Contacts

**Critical Issues**:
1. Check error logs on hosting platform
2. Review recent deployments
3. Roll back if necessary
4. Contact hosting support

**Non-Critical Issues**:
1. Create GitHub issue
2. Review documentation
3. Check community forums

---

## Deployment Summary

**Recommended Path**: Vercel (zero-config, optimized for Next.js)

**Alternative Paths**: Netlify, Docker, VPS (more control)

**Current Status**: Production-ready, no blockers

**Deployment Time**: < 5 minutes (Vercel), < 30 minutes (VPS)

**Post-Deployment**: Verify all functionality, run Lighthouse audit

---

**Guide Version**: 1.0
**Last Updated**: 2025-11-05
**Project Status**: Production Ready
**Framework**: Next.js 16.0.1
**Author**: Claude Code (Sonnet 4.5)
