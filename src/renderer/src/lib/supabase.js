import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars via import.meta.env, not process.env.
const supabaseUrl =
  import.meta.env?.VITE_SUPABASE_URL ?? 'https://mjjilkamjnjzlmhzdjgj.supabase.co';
const supabaseAnonKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhamFzZSIsInJlZiI6Im1qamlsa2Ftam5qemxtaHpkamdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NTExNDAsImV4cCI6MjEwNzA5NzE0MH0.2-qn0K_ecwXhCZuMj20zBp6xnpFd1ANY_vtS0ubea24';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** True when both Supabase credentials are configured. */
export const isSupabaseConfigured = function () {
  return Boolean(supabaseUrl && supabaseAnonKey);
};