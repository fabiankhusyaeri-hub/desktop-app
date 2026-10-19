/**
 * Notification centre (shared store).
 *
 * A tiny module-level store is used instead of React context so the Dashboard,
 * Header and Live Monitoring can raise and read the same notification list
 * without prop drilling or extra providers in the tree.
 */

import { apiGet, isApiConfigured } from './apiClient'
import { formatTimestamp } from '../utils/datetime'
import workspace from './mock/workspace.mock.json'

export type NotificationSeverity = 'critical' | 'high' | 'warning' | 'medium' | 'low' | 'info'

export interface AppNotification {
  id: string
  severity: NotificationSeverity
  category: 'geofence' | 'fleet' | 'attendance' | 'system' | 'broadcast'
  title: string
  body: string
  timestamp: string
  read: boolean
}

export interface BroadcastTemplate {
  id: string
  label: string
  severity: NotificationSeverity
  message: string
}

export interface BroadcastPayload {
  templateId: string | null
  message: string
  severity: NotificationSeverity
  audience: 'all' | 'hq' | 'field'
}

let notifications: AppNotification[] = (workspace.notifications as AppNotification[]).map((n) => ({
  ...n,
  // Re-stamp onto the feed day so the panel reads as live.
  timestamp: `${new Date().toISOString().slice(0, 10)}T${n.timestamp.slice(11, 19)}`
}))

const listeners = new Set<() => void>()

const emit = (): void => listeners.forEach((listener) => listener())

export const subscribeNotifications = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getNotifications = (): AppNotification[] => notifications

export const getUnreadCount = (): number => notifications.filter((n) => !n.read).length

export const markAllRead = (): void => {
  notifications = notifications.map((n) => ({ ...n, read: true }))
  emit()
}

export const markRead = (id: string): void => {
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  emit()
}

/** Push a notification raised locally (broadcast, breach, export...). */
export const pushNotification = (input: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification => {
  const created: AppNotification = {
    ...input,
    id: `NTF-LIVE-${Date.now()}`,
    timestamp: new Date().toISOString(),
    read: false
  }
  notifications = [created, ...notifications].slice(0, 50)
  emit()
  return created
}

export const notificationTime = (item: AppNotification, offsetMs = 0): string =>
  formatTimestamp(item.timestamp, offsetMs)

export const broadcastTemplates = (): BroadcastTemplate[] =>
  workspace.broadcastTemplates as BroadcastTemplate[]

export const departments = (): string[] => workspace.departments as string[]

/** Broadcast an alert to personnel. Returns the delivered notification. */
export const sendBroadcast = async (payload: BroadcastPayload): Promise<AppNotification> => {
  if (isApiConfigured()) {
    await apiGet<string>('/dashboard/broadcast')
  }
  return pushNotification({
    severity: payload.severity,
    category: 'broadcast',
    title:
      payload.severity === 'critical'
        ? 'Emergency broadcast dispatched'
        : 'Broadcast alert dispatched',
    body: `${payload.message} — audience: ${payload.audience.toUpperCase()}`
  })
}