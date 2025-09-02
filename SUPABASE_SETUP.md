# Supabase Setup Guide for AI Resume Analyzer

This guide will help you set up Supabase as the backend for authentication and resume storage.

## Prerequisites

- A Supabase account (free tier available)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `ai-resume-analyzer`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

## Step 2: Configure Database

### Option A: Use the Simple Schema (Recommended)

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema-simple.sql` into the editor
3. Click "Run" to execute the SQL commands

### Option B: Use the Full Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema.sql` into the editor
3. Click "Run" to execute the SQL commands
4. If you get permission errors, ignore them - the tables will still be created

### What Gets Created:

- `resumes` table for storing resume metadata
- `ai_configs` table for storing user AI configurations  
- Row Level Security policies
- Database indexes for performance
- Automatic timestamp triggers

### Create Storage Bucket

After running the SQL schema, create the storage bucket manually:

1. Go to Storage in your Supabase dashboard
2. Click "Create a new bucket"
3. Name: `resumes`
4. Public: `false` (keep it private)
5. Click "Create bucket"

### Configure Storage Policies

After creating the bucket, set up the storage policies:

1. Go to Storage > Policies in your Supabase dashboard
2. For the `resumes` bucket, create these policies:

**Policy 1: Allow users to upload their own files**
- Policy name: `Users can upload their own resume files`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- USING expression: `auth.uid()::text = (storage.foldername(name))[1]`

**Policy 2: Allow users to view their own files**
- Policy name: `Users can view their own resume files`
- Allowed operation: `SELECT`
- Target roles: `authenticated`
- USING expression: `auth.uid()::text = (storage.foldername(name))[1]`

**Policy 3: Allow users to delete their own files**
- Policy name: `Users can delete their own resume files`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- USING expression: `auth.uid()::text = (storage.foldername(name))[1]`

## Step 3: Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL:
   - Site URL: `http://localhost:5173` (for development)
   - Add your production URL when deploying
3. Enable the authentication providers you want:
   - **Email**: Already enabled by default
   - **Google**: Go to Providers > Google, enable it, and add your OAuth credentials
   - **GitHub**: Go to Providers > GitHub, enable it, and add your OAuth credentials

### Setting up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase

### Setting up GitHub OAuth (Optional)

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

## Step 4: Get Your Supabase Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - Anon (public) key

## Step 5: Configure Environment Variables

1. Create a `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 6: Install Dependencies

```bash
npm install
```

The Supabase client is already included in the dependencies.

## Step 7: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Try the following:
   - Sign up with email/password
   - Sign in with configured OAuth providers
   - Upload a resume (should be stored in Supabase Storage)
   - Configure AI settings (should be saved to database)

## Storage Configuration

The app uses Supabase Storage for resume files:

- **Bucket**: `resumes`
- **Path structure**: `{user_id}/{resume_id}/{filename}`
- **Security**: Row Level Security ensures users can only access their own files

## Database Tables

### `resumes`
- Stores resume metadata and analysis results
- Links to files in Supabase Storage
- Includes analysis JSON data

### `ai_configs`
- Stores user AI provider configurations
- One config per user (UNIQUE constraint)
- Encrypted API keys (handled by Supabase)

## Security Features

- **Row Level Security**: Users can only access their own data
- **Authentication Required**: All operations require valid JWT
- **Encrypted Storage**: API keys and sensitive data are encrypted
- **HTTPS Only**: All communication is encrypted in transit

## Production Deployment

When deploying to production:

1. Update your Supabase project settings:
   - Add your production domain to Site URL
   - Update OAuth redirect URLs

2. Update environment variables:
   - Use production Supabase URL and keys
   - Ensure `.env` is not committed to version control

3. Consider upgrading to Supabase Pro for:
   - Higher storage limits
   - Better performance
   - Advanced features

## Troubleshooting

### Common Issues

1. **Permission denied errors during schema setup**:
   - Use `supabase-schema-simple.sql` instead
   - Some settings are managed by Supabase automatically
   - Focus on creating tables and policies

2. **Authentication not working**:
   - Check Site URL in Supabase settings matches your domain
   - Verify environment variables are correct (no trailing slashes)
   - Check browser console for errors
   - Ensure `.env` file is in project root

3. **File upload failing**:
   - Verify storage bucket `resumes` exists and is private
   - Check storage policies are correctly configured
   - Ensure user is authenticated before upload
   - Check file size limits (default 50MB)

4. **Database queries failing**:
   - Verify Row Level Security policies are enabled
   - Check table structure matches schema exactly
   - Ensure user is authenticated (check `auth.uid()`)
   - Use Supabase dashboard to test queries manually

5. **Environment variables not loading**:
   - File must be named `.env` (not `.env.local` or `.env.development`)
   - Variables must start with `VITE_` for Vite to include them
   - Restart development server after changing `.env`
   - Check variables are available in browser dev tools

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com/)
- Check browser console and network tab for errors

## Complete Migration

The application has been fully migrated from Puter.js to Supabase:

✅ **Authentication**: Email/password and OAuth (Google/GitHub)  
✅ **File Storage**: Resume files stored in Supabase Storage  
✅ **Database**: Resume metadata and AI configurations  
✅ **Real-time**: Automatic data synchronization  
✅ **Security**: Row-level security and encrypted storage  

All Puter.js code has been removed and replaced with Supabase integration.