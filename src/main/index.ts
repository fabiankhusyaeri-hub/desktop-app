import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

const supabase = require('../../supabaseClient.js')

ipcMain.handle('supabase:test-connection', async () => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1)

    if (error) {
      return {
        success: false,
        message: error.message || 'Supabase query failed'
      }
    }

    return {
      success: true,
      message: 'Supabase connected successfully',
      data: data ?? []
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown Supabase error'
    }
  }
})

ipcMain.handle('supabase:get-employees', async () => {
  try {
    const { data, error } = await supabase.from('employees').select('*').limit(10)

    if (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch employees'
      }
    }

    return {
      success: true,
      message: 'Employees loaded successfully',
      data: data ?? []
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown employee fetch error'
    }
  }
})

ipcMain.handle('supabase:create-employee', async (_event, payload: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase.from('employees').insert([payload]).select()

    if (error) {
      return {
        success: false,
        message: error.message || 'Failed to create employee'
      }
    }

    return {
      success: true,
      message: 'Employee created successfully',
      data: data ?? []
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown employee create error'
    }
  }
})

ipcMain.handle('supabase:update-employee', async (_event, { id, payload }: { id: string; payload: Record<string, unknown> }) => {
  try {
    const { data, error } = await supabase.from('employees').update(payload).eq('id', id).select()

    if (error) {
      return {
        success: false,
        message: error.message || 'Failed to update employee'
      }
    }

    return {
      success: true,
      message: 'Employee updated successfully',
      data: data ?? []
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown employee update error'
    }
  }
})

ipcMain.handle('supabase:delete-employee', async (_event, { id }: { id: string }) => {
  try {
    const { error } = await supabase.from('employees').delete().eq('id', id)

    if (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete employee'
      }
    }

    return {
      success: true,
      message: 'Employee deleted successfully',
      data: []
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown employee delete error'
    }
  }
})

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    title: 'Vanguard FieldOps',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.vanguard.fieldops')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
