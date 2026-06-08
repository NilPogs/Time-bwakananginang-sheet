# Amoa ning Timesheet

A production-ready timesheet management application built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Authentication**: Google OAuth via Supabase Auth
- ⏱️ **Timer Widget**: Start/stop timer for real-time activity tracking
- 📝 **Manual Entry**: Add timesheet entries manually with description, duration, and date
- 📊 **Dashboard**: View and manage all timesheet entries by date
- ✏️ **Edit/Delete**: Inline editing and deletion of entries
- 📄 **PDF Export**: Export timesheet data as professional PDF reports
- 🔒 **Security**: Row Level Security (RLS) ensures users only see their own data
- 📱 **Responsive**: Mobile-friendly design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth)
- **PDF Generation**: jsPDF + jspdf-autotable
- **Deployment**: Vercel

## Prerequisites

- Node.js 20+ and npm
- Supabase account
- Google OAuth credentials (for Supabase Auth)

## Local Development Setup

### 1. Clone and Install

```bash
cd timesheet-app
npm install
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

#### Run Database Migrations
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration script from `supabase/migrations/001_initial_schema.sql`

#### Configure Google OAuth
1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Create credentials at [Google Cloud Console](https://console.cloud.google.com/)
   - Add authorized redirect URIs:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local dev)

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from Supabase Dashboard > Settings > API

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

### Post-Deployment Configuration

1. **Update Google OAuth Redirect URIs**:
   - Add your Vercel URL to Google Cloud Console OAuth credentials:
     - `https://your-app.vercel.app/auth/callback`
   
2. **Update Supabase Auth Settings**:
   - In Supabase Dashboard > Authentication > URL Configuration
   - Add site URL: `https://your-app.vercel.app`
   - Add redirect URLs: `https://your-app.vercel.app/auth/callback`

## Project Structure

```
timesheet-app/
├── app/
│   ├── page.tsx                    # Main dashboard page
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts            # OAuth callback handler
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── Dashboard.tsx               # Main dashboard component
│   ├── TimerWidget.tsx             # Timer for tracking time
│   ├── ManualEntryForm.tsx         # Manual entry form
│   ├── TimesheetList.tsx           # List of timesheet entries
│   └── ExportButton.tsx            # PDF export button
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Client-side Supabase client
│   │   └── server.ts               # Server-side Supabase client
│   ├── types/
│   │   └── database.ts             # TypeScript database types
│   └── utils/
│       └── pdfExport.ts            # PDF generation utility
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
├── middleware.ts                   # Auth middleware
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

## Database Schema

### `profiles` Table
- `id` (UUID, Primary Key): User ID from auth.users
- `email` (TEXT): User email
- `full_name` (TEXT): User's full name
- `avatar_url` (TEXT): Profile picture URL
- `created_at` (TIMESTAMP): Account creation time
- `updated_at` (TIMESTAMP): Last update time

### `timesheet_entries` Table
- `id` (UUID, Primary Key): Entry ID
- `user_id` (UUID, Foreign Key): Links to profiles.id
- `description` (TEXT): Activity description
- `start_time` (TIMESTAMP): Start time
- `end_time` (TIMESTAMP): End time (null for running timers)
- `duration_minutes` (INTEGER): Duration in minutes
- `entry_date` (DATE): Date of the entry
- `created_at` (TIMESTAMP): Creation time
- `updated_at` (TIMESTAMP): Last update time

## Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Auth Policies**: Users can only read/write their own data
- **Server-Side Validation**: All mutations validated on the server
- **Secure Cookies**: Session managed via HTTP-only cookies

## Usage

1. **Login**: Click "Sign in with Google" on the login page
2. **Start Timer**: Click "Start Timer" to begin tracking time
3. **Stop Timer**: Click "Stop" to end tracking and save entry
4. **Manual Entry**: Use the form to add entries with specific duration
5. **View Entries**: Select a date to view entries for that day
6. **Edit Entry**: Click edit icon, modify fields, click save
7. **Delete Entry**: Click delete icon, confirm deletion
8. **Export PDF**: Click "Export PDF" to download timesheet report

## Troubleshooting

### Authentication Issues
- Verify Google OAuth credentials are correct
- Check redirect URIs match exactly (including http/https)
- Ensure Supabase Auth provider is enabled

### Database Issues
- Verify migrations have been run in Supabase
- Check RLS policies are enabled
- Ensure environment variables are set correctly

### Build/Deployment Issues
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`
- Check Vercel logs for specific errors

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
