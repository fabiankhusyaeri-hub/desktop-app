/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Supabase project URL (renderer data layer).
   * Example: VITE_SUPABASE_URL=https://teuathobnzuwzwolpvon.supabase.co
   */
  readonly VITE_SUPABASE_URL?: string
  /**
   * Supabase publishable / anon key. Stored only in `.env` (gitignored).
   */
  readonly VITE_SUPABASE_ANON_KEY?: string
  /**
   * Base URL of the PulseTrack REST API.
   * Leave it empty (or unset) to read the Dashboard from Supabase.
   * Example: VITE_API_BASE_URL=https://api.pulsetrack.internal/v1
   */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
