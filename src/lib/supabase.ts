import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Please replace with your Supabase project URL and anon key.
// You can find these in your Supabase project settings under 'API'.
const supabaseUrl = "https://pxtfbraocebwpialcabv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4dGZicmFvY2Vid3BpYWxjYWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODgzMzEsImV4cCI6MjA2NjE2NDMzMX0.oGFXxmxif1KLqiWk8jHLsjm_V9JdSLHIrWBJKK-7ox0";

if (!supabaseUrl?.startsWith('http')) {
  throw new Error('Supabase URL is missing or invalid. Please check your configuration.');
}

if (!supabaseAnonKey) {
  throw new Error('Supabase anon key is missing. Please check your configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
