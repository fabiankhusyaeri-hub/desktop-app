"use strict";
const electron = require("electron");
const path = require("path");
const is = {
  dev: !electron.app.isPackaged
};
const platform = {
  isWindows: process.platform === "win32",
  isMacOS: process.platform === "darwin",
  isLinux: process.platform === "linux"
};
const electronApp = {
  setAppUserModelId(id) {
    if (platform.isWindows)
      electron.app.setAppUserModelId(is.dev ? process.execPath : id);
  },
  setAutoLaunch(auto) {
    if (platform.isLinux)
      return false;
    const isOpenAtLogin = () => {
      return electron.app.getLoginItemSettings().openAtLogin;
    };
    if (isOpenAtLogin() !== auto) {
      electron.app.setLoginItemSettings({
        openAtLogin: auto,
        path: process.execPath
      });
      return isOpenAtLogin() === auto;
    } else {
      return true;
    }
  },
  skipProxy() {
    return electron.session.defaultSession.setProxy({ mode: "direct" });
  }
};
const optimizer = {
  watchWindowShortcuts(window, shortcutOptions) {
    if (!window)
      return;
    const { webContents } = window;
    const { escToCloseWindow = false, zoom = false } = shortcutOptions || {};
    webContents.on("before-input-event", (event, input) => {
      if (input.type === "keyDown") {
        if (!is.dev) {
          if (input.code === "KeyR" && (input.control || input.meta))
            event.preventDefault();
        } else {
          if (input.code === "F12") {
            if (webContents.isDevToolsOpened()) {
              webContents.closeDevTools();
            } else {
              webContents.openDevTools({ mode: "undocked" });
              console.log("Open dev tool...");
            }
          }
        }
        if (escToCloseWindow) {
          if (input.code === "Escape" && input.key !== "Process") {
            window.close();
            event.preventDefault();
          }
        }
        if (!zoom) {
          if (input.code === "Minus" && (input.control || input.meta))
            event.preventDefault();
          if (input.code === "Equal" && input.shift && (input.control || input.meta))
            event.preventDefault();
        }
      }
    });
  },
  registerFramelessWindowIpc() {
    electron.ipcMain.on("win:invoke", (event, action) => {
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      if (win) {
        if (action === "show") {
          win.show();
        } else if (action === "showInactive") {
          win.showInactive();
        } else if (action === "min") {
          win.minimize();
        } else if (action === "max") {
          const isMaximized = win.isMaximized();
          if (isMaximized) {
            win.unmaximize();
          } else {
            win.maximize();
          }
        } else if (action === "close") {
          win.close();
        }
      }
    });
  }
};
const supabase = require("../../supabaseClient.js");
electron.ipcMain.handle("supabase:test-connection", async () => {
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);
    if (error) {
      return {
        success: false,
        message: error.message || "Supabase query failed"
      };
    }
    return {
      success: true,
      message: "Supabase connected successfully",
      data: data ?? []
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Supabase error"
    };
  }
});
electron.ipcMain.handle("supabase:get-employees", async () => {
  try {
    const { data, error } = await supabase.from("employees").select("*").limit(10);
    if (error) {
      return {
        success: false,
        message: error.message || "Failed to fetch employees"
      };
    }
    return {
      success: true,
      message: "Employees loaded successfully",
      data: data ?? []
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown employee fetch error"
    };
  }
});
electron.ipcMain.handle("supabase:create-employee", async (_event, payload) => {
  try {
    const { data, error } = await supabase.from("employees").insert([payload]).select();
    if (error) {
      return {
        success: false,
        message: error.message || "Failed to create employee"
      };
    }
    return {
      success: true,
      message: "Employee created successfully",
      data: data ?? []
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown employee create error"
    };
  }
});
electron.ipcMain.handle("supabase:update-employee", async (_event, { id, payload }) => {
  try {
    const { data, error } = await supabase.from("employees").update(payload).eq("id", id).select();
    if (error) {
      return {
        success: false,
        message: error.message || "Failed to update employee"
      };
    }
    return {
      success: true,
      message: "Employee updated successfully",
      data: data ?? []
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown employee update error"
    };
  }
});
electron.ipcMain.handle("supabase:delete-employee", async (_event, { id }) => {
  try {
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) {
      return {
        success: false,
        message: error.message || "Failed to delete employee"
      };
    }
    return {
      success: true,
      message: "Employee deleted successfully",
      data: []
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown employee delete error"
    };
  }
});
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    title: "Vanguard FieldOps",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.vanguard.fieldops");
  electron.app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
