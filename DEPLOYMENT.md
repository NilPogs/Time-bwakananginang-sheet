# Deployment Checklist

## Pre-Deployment Steps

### 1. Supabase Configuration ✓
- [ ] Create Supabase project at https://supabase.com
- [ ] Note down Project URL and Anon Key from Settings > API
- [ ] Run database migration from `supabase/migrations/001_initial_schema.sql` in SQL Editor
- [ ] Verify tables `profiles` and `timesheet_entries` are created
- [ ] Verify Row Level Security (RLS) policies are enabled

### 2. Google OAuth Setup ✓
- [ ] Create OAuth credentials at https://console.cloud.google.com/
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 Client ID (Web application)
- [ ] Add authorized redirect URIs:
  - For local: `http://localhost:3000/auth/callback`
  - For Supabase: `https://<your-project-ref>.supabase.co/auth/v1/callback`
  - For production: `https://<your-domain>.vercel.app/auth/callback`
- [ ] Copy Client ID and Client Secret
- [ ] Add credentials to Supabase Dashboard > Authentication > Providers > Google

### 3. Local Testing ✓
- [ ] Create `.env.local` file with Supabase credentials
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Test login with Google OAuth
- [ ] Test timer functionality
- [ ] Test manual entry creation
- [ ] Test edit/delete operations
- [ ] Test PDF export
- [ ] Verify RLS - users only see their own data

## Vercel Deployment Steps

### Option A: GitHub + Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Production-ready Amoa ning Timesheet"
   git branch -M main
   git remote add origin https://github.com/yourusername/timesheet-app.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
   
3. **Add Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project-ref.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`
   
4. **Deploy**: Click "Deploy"

### Option B: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Add environment variables interactively
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

## Post-Deployment Configuration

### 1. Update OAuth Redirect URIs
- [ ] Go to Google Cloud Console > Credentials
- [ ] Edit your OAuth 2.0 Client ID
- [ ] Add production redirect URI:
  - `https://your-app.vercel.app/auth/callback`
- [ ] Save changes

### 2. Update Supabase Auth Settings
- [ ] Go to Supabase Dashboard > Authentication > URL Configuration
- [ ] Update Site URL: `https://your-app.vercel.app`
- [ ] Add to Redirect URLs:
  - `https://your-app.vercel.app/auth/callback`
  - `https://your-app.vercel.app/**`
- [ ] Save changes

### 3. Test Production Deployment
- [ ] Visit your Vercel URL
- [ ] Test Google OAuth login
- [ ] Create test timesheet entries
- [ ] Test all CRUD operations
- [ ] Test PDF export
- [ ] Test on mobile devices
- [ ] Verify no console errors

## Troubleshooting

### Authentication Issues
- **Problem**: "Invalid redirect URI" error
  - **Solution**: Ensure redirect URI is added to both Google Console and Supabase
  
- **Problem**: Users not being created in profiles table
  - **Solution**: Check SQL Editor for errors in the trigger function

### Database Issues
- **Problem**: "Permission denied" errors
  - **Solution**: Verify RLS policies are enabled and correct
  
- **Problem**: Can't see other users' data (this is correct!)
  - **Solution**: This is expected behavior due to RLS

### Build Issues
- **Problem**: Build fails on Vercel
  - **Solution**: Check build logs, ensure all dependencies are in package.json
  
- **Problem**: Environment variables not working
  - **Solution**: Redeploy after adding env vars in Vercel dashboard

## Performance Optimization

- [ ] Enable Vercel Analytics (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/error tracking (optional)
- [ ] Add database indexes for better query performance (optional)

## Security Checklist

- [x] RLS policies enabled on all tables
- [x] Environment variables properly configured
- [x] No sensitive data in client-side code
- [x] HTTPS enforced (Vercel handles this)
- [x] Auth tokens stored in HTTP-only cookies
- [ ] Regular Supabase and dependency updates

## Maintenance

### Regular Tasks
- Update dependencies monthly: `npm update`
- Review Supabase logs for errors
- Monitor Vercel usage and performance
- Backup database regularly (Supabase handles automatic backups)

### Adding Features
1. Create new branch
2. Implement feature locally
3. Test thoroughly
4. Push to GitHub
5. Vercel auto-deploys preview
6. Test preview URL
7. Merge to main for production deployment

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Tailwind CSS Docs: https://tailwindcss.com/docs

## Notes

- Vercel provides automatic HTTPS
- Vercel provides automatic preview deployments for PRs
- Supabase provides automatic database backups
- Free tier limits:
  - Vercel: 100GB bandwidth/month
  - Supabase: 500MB database, 2GB bandwidth/month
