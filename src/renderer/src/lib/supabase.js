import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars via import.meta.env, not process.env.
// Values come from `.env` at the project root (see `.env.example` for the
// variable names); credentials are intentionally never hardcoded in source.
const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY ?? '').trim();

export const supabase = createClient(
  supabaseUrl || 'https://invalid.supabase.co',
  supabaseAnonKey || 'invalid-publishable-key'
);

/** True when both Supabase credentials are configured. */
export const isSupabaseConfigured = function () {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
