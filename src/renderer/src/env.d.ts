/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URL of the PulseTrack REST API.
   * Leave it empty (or unset) to run the Dashboard against the local mock dataset.
   * Example: VITE_API_BASE_URL=https://api.pulsetrack.internal/v1
   */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}