import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Please replace with your Supabase project URL and anon key.
// You can find these in your Supabase project settings under 'API'.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl?.startsWith('http')) {
  throw new Error('Supabase URL is missing or invalid. Please check your configuration.');
}

if (!supabaseAnonKey) {
  throw new Error('Supabase anon key is missing. Please check your configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
