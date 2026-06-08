# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: timesheet-app (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Your Credentials

1. In your Supabase project dashboard, click "Settings" (gear icon)
2. Go to "API" section
3. Copy these values:
   - **Project URL**: Under "Project URL"
   - **anon public key**: Under "Project API keys" → "anon public"

## Step 3: Run Database Migration

1. In Supabase dashboard, go to "SQL Editor"
2. Click "New query"
3. Copy and paste the entire content from: `supabase/migrations/001_initial_schema.sql`
4. Click "Run" or press Ctrl+Enter
5. You should see "Success. No rows returned"

**What this creates:**
- `time_entries` table with Row Level Security
- Policies for users to manage their own entries
- Indexes for performance

## Step 4: Configure Email Authentication

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Find "Email" provider and ensure it's enabled (enabled by default)
3. Configure email settings:
   - **Enable email confirmations**: Optional (recommended for production)
   - **Secure email change**: Enabled (recommended)
   - **Secure password change**: Enabled (recommended)

**Note:** For development, you can disable email confirmations to make testing easier. For production, enable email confirmations for security.

## Step 5: Configure Environment Variables

### For Local Development:

Update `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Vercel Deployment:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon public key
4. Make sure both are available for all environments (Production, Preview, Development)

## Step 6: Configure Site URL in Supabase

1. In Supabase dashboard → "Authentication" → "URL Configuration"
2. Set **Site URL**:
   - For development: `http://localhost:3000`
   - For production: `https://your-app.vercel.app` (after deploying)

## Step 7: Test the Setup

### Local Testing:
```bash
npm run dev
```
Visit http://localhost:3000 and test:
1. Sign up with email and password at `/signup`
2. Login with your credentials at `/login`
3. Try creating a timesheet entry
4. Test timer functionality
5. Test PDF export

### Production Testing:
After deploying to Vercel:
1. Visit your production URL
2. Test all features
3. Verify Row Level Security (users can only see their entries)

## Troubleshooting

### "Invalid supabaseUrl" Error
- Check that URL starts with `https://`
- No trailing slash in URL

### Email Authentication Not Working
- Verify Email provider is enabled in Supabase
- Check password meets minimum requirements (6 characters)
- If email confirmations are enabled, check spam folder
- For development, consider disabling email confirmations in Supabase

### Database Errors
- Verify migration was run successfully
- Check SQL Editor for any error messages
- Ensure RLS policies are created

### Users Can See Other Users' Data
- Verify RLS is enabled on `time_entries` table
- Check policies exist and are correct
- Test with multiple accounts

## Security Notes

✅ **Row Level Security (RLS)** is enabled - users can only access their own data
✅ **Email/Password Authentication** provides secure user authentication
✅ **Environment variables** keep credentials safe
✅ **Server-side** validation and data fetching

## Next Steps

After successful setup:
1. Deploy to Vercel using `vercel deploy`
2. Set environment variables in Vercel
3. Update Site URL in Supabase to production URL
4. Test production deployment
5. Monitor usage in Supabase dashboard

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
