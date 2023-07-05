const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    }
  });
  // win.loadFile("dist/index.html");
  win.loadURL("http://localhost:8000/#/");
  win.maximize();
  win.show();
  win.webContents.openDevTools()

}

app.whenReady().then(async () => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

