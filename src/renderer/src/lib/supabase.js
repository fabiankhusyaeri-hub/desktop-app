import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL ?? '').trim() || 'https://teuathobnzuwzwolpvon.supabase.co';
const supabaseAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY ?? '').trim() || 'sb_publishable_NzSLD-wVP0AFY2-Psu6aTg_zKt3bih_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = function () {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://invalid.supabase.co');
};
