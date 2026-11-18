import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const supabaseBridge = {
  testConnection: async (): Promise<{ success: boolean; message: string; data?: unknown[] }> => {
    return ipcRenderer.invoke('supabase:test-connection')
  },
  getEmployees: async (): Promise<{ success: boolean; message: string; data?: unknown[] }> => {
    return ipcRenderer.invoke('supabase:get-employees')
  },
  createEmployee: async (payload: Record<string, unknown>): Promise<{ success: boolean; message: string; data?: unknown[] }> => {
    return ipcRenderer.invoke('supabase:create-employee', payload)
  },
  updateEmployee: async (id: string, payload: Record<string, unknown>): Promise<{ success: boolean; message: string; data?: unknown[] }> => {
    return ipcRenderer.invoke('supabase:update-employee', { id, payload })
  },
  deleteEmployee: async (id: string): Promise<{ success: boolean; message: string; data?: unknown[] }> => {
    return ipcRenderer.invoke('supabase:delete-employee', { id })
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('supabaseBridge', supabaseBridge)
  } catch (error) {
    console.error('[preload] Supabase bridge error:', error)
  }
}
