/**
 * System settings persistence.
 *
 * Workspace configuration has no Supabase table, so values are stored in
 * localStorage behind a small store interface (Service Adapter pattern).
 * Swapping the backend later only requires a new SettingsStore impl.
 */

/** A single persisted setting: form scalars are strings, toggles booleans. */
export type SettingValue = string | boolean

/** Keyed by the `data-setting` identifiers used on the Settings page. */
export type SettingsValues = Record<string, SettingValue>

export interface SettingsStore {
  /** Return the stored values, or null when nothing has been saved yet. */
  load(): SettingsValues | null
  /** Persist values. Returns false when the write is rejected. */
  save(values: SettingsValues): boolean
  /** Drop persisted values so the page falls back to factory defaults. */
  reset(): void
}

const STORAGE_KEY = 'geoattend.systemSettings.v1'

const isSettingsValues = (parsed: unknown): parsed is SettingsValues => {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false
  return Object.values(parsed as Record<string, unknown>).every(
    (value) => typeof value === 'string' || typeof value === 'boolean'
  )
}

const localStorageStore: SettingsStore = {
  load(): SettingsValues | null {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed: unknown = JSON.parse(raw)
      return isSettingsValues(parsed) ? parsed : null
    } catch {
      // Corrupt or unavailable storage behaves like "never saved".
      return null
    }
  },

  save(values: SettingsValues): boolean {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
      return true
    } catch {
      // Quota exceeded or storage disabled: report failure to the caller.
      return false
    }
  },

  reset(): void {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nothing to clear when storage is unavailable.
    }
  }
}

/** Read persisted settings, or null when nothing has been saved yet. */
export const loadSettings = (): SettingsValues | null => localStorageStore.load()

/** Persist settings. Returns false when the browser rejects the write. */
export const saveSettings = (values: SettingsValues): boolean => localStorageStore.save(values)

/** Clear persisted settings so the next load returns factory defaults. */
export const resetSettings = (): void => localStorageStore.reset()
