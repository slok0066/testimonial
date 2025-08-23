import { createClient } from '@supabase/supabase-js';

// Read from Vite environment variables (set in .env or hosting provider env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl?.startsWith('http')) {
  throw new Error('Supabase URL is missing or invalid. Set VITE_SUPABASE_URL in your .env');
}

if (!supabaseAnonKey) {
  throw new Error('Supabase anon key is missing. Set VITE_SUPABASE_ANON_KEY in your .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
