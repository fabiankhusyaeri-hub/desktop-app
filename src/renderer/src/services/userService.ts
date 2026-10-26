/**
 * Current user session (Super Admin).
 *
 * Mock adapter by default; the REST adapter takes over when `VITE_API_BASE_URL`
 * is set. Sign-out is intentionally local to the renderer: the real token
 * revocation belongs to the auth module, which is wired in a later stage.
 */

// Workspace data now comes from Supabase; keep an empty default for offline use.
const workspace = { currentUser: null }

export interface CurrentUser {
  id: string
  name: string
  role: string
  email: string
  department: string
  avatar: string
  permissions: string[]
  sessionStartedAt: string
}

let currentUser: CurrentUser | null = workspace.currentUser as unknown as CurrentUser
const listeners = new Set<() => void>()
const emit = (): void => listeners.forEach((listener) => listener())

export const subscribeSession = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getSessionUser = (): CurrentUser | null => currentUser

/** Ends the local session. Returns false when there was nothing to end. */
export const signOut = (): boolean => {
  if (!currentUser) return false
  currentUser = null
  emit()
  return true
}

export const signInAsSuperAdmin = (): void => {
  currentUser = workspace.currentUser as unknown as CurrentUser
  emit()
}

export const can = (permission: string): boolean =>
  Boolean(currentUser?.permissions.includes(permission))

export const sessionDurationLabel = (): string => {
  if (!currentUser) return '—'
  const started = new Date(currentUser.sessionStartedAt).getTime()
  if (Number.isNaN(started)) return '—'
  const minutes = Math.max(0, Math.round((Date.now() - started) / 60000))
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}