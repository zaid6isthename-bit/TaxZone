import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supports both the legacy ANON_KEY name and the newer PUBLISHABLE_KEY name
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

// Lazy singleton — only created on first access (browser / Capacitor runtime).
// During Next.js static pre-rendering the proxy returns safely without crashing.
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  // At build-time (SSG) env vars may be empty strings — use a safe placeholder
  // so module init doesn't throw. Real values are baked in at build time.
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseAnonKey || 'placeholder-key';

  try {
    _supabase = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  } catch (e) {
    // If createClient itself throws (e.g. malformed key), fall back to a
    // placeholder so the React tree doesn't crash on import.
    console.error('[TaxZone] Supabase createClient failed:', e);
    _supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return _supabase;
}

// Proxy so existing imports (`supabase.from(...)`, `supabase.auth`, etc.)
// continue to work unchanged — the real client is only created on first access.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});

// Expose URL/key readiness check for auth-provider guards
export const isSupabaseConfigured = (): boolean =>
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder');
