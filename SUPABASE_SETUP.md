# Supabase Migration Setup Guide

This guide will help you set up your project to use Supabase instead of Prisma with PostgreSQL.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `todo-app-backend` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"

## 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## 3. Set Up Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update your `.env` file with your Supabase credentials:
   ```env
   SUPABASE_URL="https://your-project-id.supabase.co"
   SUPABASE_ANON_KEY="your-anon-key-here"
   JWT_SECRET="your_jwt_secret_here"
   NODE_ENV="development"
   PORT=5000
   ```

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` and paste it into the SQL editor
3. Click **Run** to execute the schema

This will create:
- `users` table with proper constraints
- `todos` table with foreign key relationships
- Row Level Security (RLS) policies
- Indexes for better performance
- Automatic timestamp updates

## 5. Install Dependencies

```bash
npm install
```

## 6. Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the API endpoints:
   - Register a new user: `POST /api/auth/register`
   - Login: `POST /api/auth/login`
   - Create a todo: `POST /api/todos`
   - Get todos: `GET /api/todos`

## 7. Clean Up Old Files (Optional)

After confirming everything works, you can remove the old Prisma files:
- `prisma/` directory
- `src/generated/` directory
- `src/prismaClient.js`
- `src/db.js`

## Key Changes Made

### Dependencies
- Removed: `@prisma/client`, `prisma`, `pg`
- Added: `@supabase/supabase-js`

### Database Client
- Replaced Prisma client with Supabase client
- Updated all database operations to use Supabase's query builder

### Schema
- Converted Prisma schema to SQL schema
- Added Row Level Security for better security
- Added automatic timestamp updates

### API Routes
- Updated authentication routes to use Supabase
- Updated todo routes to use Supabase
- Improved error handling and validation

## Benefits of Supabase

1. **Real-time subscriptions** - Get real-time updates for your todos
2. **Built-in authentication** - Can use Supabase Auth instead of custom JWT
3. **Row Level Security** - Database-level security policies
4. **Automatic API generation** - REST and GraphQL APIs auto-generated
5. **Dashboard** - Visual database management
6. **Edge functions** - Serverless functions for complex logic

## Next Steps

1. Consider using Supabase Auth for authentication
2. Add real-time subscriptions for live todo updates
3. Use Supabase's built-in file storage if needed
4. Explore Supabase Edge Functions for complex business logic
