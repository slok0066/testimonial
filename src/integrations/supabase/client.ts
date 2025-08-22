import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://kgmomsidhbjcmmgtnkyq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnbW9tc2lkaGJqY21tZ3Rua3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODM3NjAsImV4cCI6MjA2NjE1OTc2MH0.oWV0cJ75OsYsPxz_2WBIfrTOFCNaSRD0aNClOnZO1a0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);