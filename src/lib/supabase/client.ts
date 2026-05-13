import { createClient } from '@supabase/supabase-js';

/**
 * Supabase browser client — safe to import in client components.
 * Uses the public anon key which is restricted by Row Level Security.
 *
 * For server-side operations (API routes) use the service role key instead.
 * This client is intentionally lightweight — no auth, no realtime subscriptions.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
