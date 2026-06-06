# TaxZone - Supabase Backend Setup Instructions

To deploy the backend for TaxZone, you must configure a Supabase project. Follow these steps:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and sign in/register.
   - Create a new project. 

2. **Run the Database Schema**
   - Once your project is created, navigate to the **SQL Editor** in the Supabase Dashboard.
   - Copy the entire contents of the `supabase/schema.sql` file in this repository.
   - Paste it into the SQL Editor and click **Run**. This will create all necessary tables, Row Level Security (RLS) policies, and storage buckets.

3. **Configure Authentication**
   - Go to **Authentication > Providers** in the Supabase Dashboard.
   - Enable **Phone** authentication (this is required for client login). You can use Twilio, MessageBird, or vonage for real SMS. For testing, you can enable "Enable Phone OTP Test Mode" and add a test phone number (e.g., `+919999999999`) and a dummy OTP (e.g., `123456`).
   - Email/Password authentication is enabled by default (used for Admin login).

4. **Environment Variables**
   - Go to **Project Settings > API**.
   - Copy the **Project URL** and the **anon `public`** key.
   - Rename `.env.example` to `.env.local` in your `web-dashboard` directory.
   - Paste the URL and Anon Key into the respective variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Build and Deploy**
   - You are now ready to build the Android application via Capacitor (`npm run build` then `npx cap sync android`).
