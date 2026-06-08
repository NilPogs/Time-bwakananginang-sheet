# Quick Start Guide

Get your Amoa ning Timesheet running in 15 minutes!

## Step 1: Install Dependencies (2 min)

```bash
cd timesheet-app
npm install
```

## Step 2: Set Up Supabase (5 min)

1. **Create Project**:
   - Go to https://supabase.com and sign in
   - Click "New Project"
   - Name: `timesheet-app`
   - Database Password: (save this securely)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait ~2 minutes for provisioning

2. **Run Database Migration**:
   - In Supabase Dashboard, go to **SQL Editor**
   - Click "New Query"
   - Copy and paste contents from `supabase/migrations/001_initial_schema.sql`
   - Click "Run"
   - You should see: "Success. No rows returned"

3. **Get API Credentials**:
   - Go to **Settings** > **API**
   - Copy these values:
     - Project URL
     - `anon` `public` key

## Step 3: Configure Google OAuth (5 min)

1. **Google Cloud Console**:
   - Go to https://console.cloud.google.com/
   - Create new project or select existing
   - Go to **APIs & Services** > **Credentials**
   - Click **Configure Consent Screen**:
     - User Type: External
     - App name: "Amoa ning Timesheet"
     - User support email: your email
     - Developer contact: your email
     - Save and Continue through all steps
   
   - Click **Create Credentials** > **OAuth client ID**:
     - Application type: Web application
     - Name: "Amoa ning Timesheet"
     - Authorized redirect URIs:
       - `http://localhost:3000/auth/callback`
       - `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
     - Create
     - **Save Client ID and Client Secret**

2. **Configure in Supabase**:
   - In Supabase Dashboard, go to **Authentication** > **Providers**
   - Enable **Google**
   - Paste Client ID and Client Secret
   - Save

## Step 4: Configure Environment (1 min)

Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 2.

## Step 5: Run Development Server (1 min)

```bash
npm run dev
```

Open http://localhost:3000

## Step 6: Test the App (1 min)

1. Click "Sign in with Google"
2. Authorize the app
3. You should see the dashboard
4. Try starting a timer
5. Try adding a manual entry
6. Try exporting as PDF

**That's it! Your app is running!** 🎉

## Deploy to Production (Optional - 5 min)

### Quick Vercel Deployment:

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/timesheet-app.git
git push -u origin main

# Deploy to Vercel
npm install -g vercel
vercel login
vercel

# Add environment variables when prompted
# Then deploy to production:
vercel --prod
```

**Post-Deployment**:
- Add your Vercel URL to Google OAuth redirect URIs
- Add your Vercel URL to Supabase Auth settings
- Test login on production URL

## Troubleshooting

**"Invalid redirect URI"**:
- Check Google Console has correct redirect URIs
- Check Supabase has Google provider enabled

**"Failed to fetch"**:
- Verify `.env.local` file exists and has correct values
- Restart dev server after creating `.env.local`

**Can't sign in**:
- Check browser console for errors
- Verify Google OAuth credentials are correct
- Make sure you're using the correct redirect URIs

**Need Help?**:
- Check DEPLOYMENT.md for detailed troubleshooting
- Review Supabase logs in Dashboard
- Check browser developer console for errors

## Next Steps

- Customize the UI in `components/` folder
- Add more fields to timesheet entries
- Integrate with other tools
- Set up custom domain on Vercel
- Add more auth providers (GitHub, Microsoft, etc.)

Enjoy tracking your time! ⏱️
