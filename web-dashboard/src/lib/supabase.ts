import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy singleton — avoids crashing during Next.js static pre-rendering when
// env vars are not yet configured. At runtime (browser / Capacitor) the real
// values must be present.
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  if (!supabaseUrl || !supabaseAnonKey) {
    // During SSG/build the env vars might be absent. Return a no-op placeholder
    // so module initialisation doesn't throw. Real calls should never reach here
    // at runtime if the env is configured properly.
    if (typeof window === 'undefined') {
      // Build-time: return a dummy client that won't be called
      _supabase = createClient(
        'https://placeholder.supabase.co',
        'placeholder-key',
        { auth: { persistSession: false, autoRefreshToken: false } }
      );
      return _supabase;
    }
    throw new Error(
      '[TaxZone] Supabase env vars are missing. ' +
      'Please copy .env.example to .env.local and fill in your project URL and anon key.'
    );
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  return _supabase;
}

// Proxy so existing imports (`supabase.from(...)`, `supabase.auth`, etc.)
// continue to work unchanged — the real client is only created on first access.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});
