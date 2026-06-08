# 🚀 Local Setup Instructions - START HERE

This is your step-by-step checklist to get the Amoa ning Timesheet running locally.

## ✅ Prerequisites Check
- [ ] You have a Supabase account (or can create one at https://supabase.com)
- [ ] Node.js is installed (check with: `node --version`)

---

## 📋 Step-by-Step Setup

### **Step 1: Create Supabase Project** (5 minutes)

1. Go to https://supabase.com
2. Sign in / Create account
3. Click "New Project"
4. Fill in:
   - Name: `timesheet-app`
   - Database Password: **[CREATE A STRONG PASSWORD - SAVE IT!]**
   - Region: Choose closest to you
5. Click "Create new project" (wait ~2 minutes)

✅ **Mark complete when project is created**

---

### **Step 2: Get Supabase Credentials** (2 minutes)

1. In your Supabase dashboard, click **Settings** (gear icon) → **API**
2. Copy these TWO values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

3. Open this file: `/home/nonbios/timesheet-app/.env.local`
4. Replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

✅ **Mark complete when .env.local is updated**

---

### **Step 3: Run Database Migration** (3 minutes)

1. In Supabase dashboard → **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open this file: `/home/nonbios/timesheet-app/supabase/migrations/001_initial_schema.sql`
4. Copy ALL the content and paste into Supabase SQL Editor
5. Click **"Run"** (or Ctrl+Enter)
6. Should see: "Success. No rows returned"

✅ **Mark complete when migration runs successfully**

---

### **Step 4: Configure Email Authentication** (2 minutes)

1. In Supabase dashboard → **Authentication** → **Providers**
2. Find **Email** and ensure it's enabled (it should be by default)
3. Configuration options:
   - **Enable Email provider**: ON
   - **Confirm email**: ON (recommended for production)
   - **Secure email change**: ON (recommended)
4. Click **Save** if you made any changes

✅ **Mark complete when Email authentication is confirmed enabled**

---

### **Step 5: Configure Redirect URLs** (2 minutes)

1. In Supabase dashboard → **Authentication** → **URL Configuration**
2. Set:
   - **Site URL**: `http://localhost:3000`
3. Add to **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/login`
4. Click **Save**

✅ **Mark complete when URLs are configured**

---

### **Step 6: Test Locally** (5 minutes)

1. Open terminal in project directory:
   ```bash
   cd /home/nonbios/timesheet-app
   npm run dev
   ```

2. Open browser: http://localhost:3000

3. Test these features:
   - [ ] Go to http://localhost:3000/signup
   - [ ] Create account with email and password
   - [ ] Check email for confirmation link (if email confirmation is enabled)
   - [ ] Log in at http://localhost:3000/login
   - [ ] See dashboard
   - [ ] Create a timesheet entry using timer
   - [ ] Create manual entry
   - [ ] Export to PDF

✅ **Mark complete when all features work**

---

## 🎉 You're Done!

Your app is now running locally. Next steps:

1. **For production deployment**, see: `DEPLOYMENT.md`
2. **For detailed Supabase info**, see: `SUPABASE_SETUP.md`
3. **For project overview**, see: `README.md`

---

## 🆘 Troubleshooting

### "Invalid supabaseUrl" error
- Ensure URL starts with `https://`
- No trailing slash in URL

### Email authentication not working
- Verify Email provider is enabled in Supabase → Authentication → Providers
- Check if email confirmation is required (you may need to confirm email first)
- Ensure redirect URLs include `http://localhost:3000/login`
- Check Supabase logs in Dashboard → Logs for authentication errors

### Can't see entries after creating them
- Check browser console for errors
- Verify database migration ran successfully
- Check RLS policies in Supabase → Database → Policies

---

## 📞 Need Help?

If you get stuck on any step, just tell me:
1. Which step number you're on
2. What error you're seeing
3. I'll help you debug!
