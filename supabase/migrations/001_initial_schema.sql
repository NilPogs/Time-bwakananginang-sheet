-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timesheet_entries table
CREATE TABLE IF NOT EXISTS timesheet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_timesheet_entries_user_id ON timesheet_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_entries_entry_date ON timesheet_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_timesheet_entries_user_date ON timesheet_entries(user_id, entry_date);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheet_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for timesheet_entries table
CREATE POLICY "Users can view their own timesheet entries"
  ON timesheet_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own timesheet entries"
  ON timesheet_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timesheet entries"
  ON timesheet_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own timesheet entries"
  ON timesheet_entries FOR DELETE
  USING (auth.uid() = user_id);
