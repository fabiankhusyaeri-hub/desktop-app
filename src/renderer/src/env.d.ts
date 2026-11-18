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

declare global {
  interface Window {
    supabaseBridge?: {
      testConnection: () => Promise<{ success: boolean; message: string; data?: unknown[] }>
      getEmployees: () => Promise<{ success: boolean; message: string; data?: unknown[] }>
      createEmployee: (payload: Record<string, unknown>) => Promise<{ success: boolean; message: string; data?: unknown[] }>
      updateEmployee: (id: string, payload: Record<string, unknown>) => Promise<{ success: boolean; message: string; data?: unknown[] }>
      deleteEmployee: (id: string) => Promise<{ success: boolean; message: string; data?: unknown[] }>
    }
    __debugSupabaseCheck?: () => Promise<void>
  }
}

export {}
