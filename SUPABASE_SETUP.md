# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details (name, database password, region)
5. Wait for the project to be created

## Step 2: Get Your API Credentials

1. Go to **Settings** → **API** in your Supabase project dashboard
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

## Step 3: Set Up Environment Variables

1. Create a `.env` file in the root of this project
2. Add the following:

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values you copied.

## Step 4: Create Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire contents of `src/lib/supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the SQL

This will create:
- `sad_path_categories` table
- `sad_path_subcategories` table  
- `user_custom_values` table
- Insert initial data for categories and subcategories

## Step 5: Set Up Row Level Security (Optional but Recommended)

For production, you should set up RLS policies. For development/testing, you can disable RLS or set up basic policies:

```sql
-- Allow all operations for authenticated users
ALTER TABLE user_custom_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own data" ON user_custom_values
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read their own data" ON user_custom_values
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON user_custom_values
  FOR UPDATE USING (true);
```

Or for development, you can temporarily disable RLS:

```sql
ALTER TABLE user_custom_values DISABLE ROW LEVEL SECURITY;
```

## Verification

After setup, your database should have:
- 3 rows in `sad_path_categories`
- 6 rows in `sad_path_subcategories`
- 0 rows in `user_custom_values` (until users start saving custom values)

You're now ready to run the application!

