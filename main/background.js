const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { dialog } = require('electron')
const fileReaderNode = require('./FileReaderNode.js')
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      backgroundThrottling: false,
      enableRemoteModule: true,
    }
  });
  win.loadFile("dist/index.html");
  win.loadURL("http://localhost:8000/#/");
  win.maximize();
  win.show();
  win.webContents.openDevTools();


  ipcMain.handle('dialog:openDirectory', async () => {
    console.log('openDirectory');

    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })
    if (canceled) {
      return
    } else {
      return filePaths[0];
    }
  });

  ipcMain.handle('dialog:openFiles', async () => {
    console.log('openFiles');
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'], filters: [{ name: 'Excel', extensions: ['xls', 'xlsx'] }]
    });
    if (canceled) {
      return
    } else {
      return filePaths;
    }
  });
  ipcMain.handle('dialog:openFolder', async () => {
    console.log('openFolder');
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })
    if (canceled) {
      return
    } else {
      console.log(filePaths);
      const files = fs.readdirSync(filePaths[0], { recursive: true });
      const filesFiltred = [];
      for (let file of files) {
        if (file.indexOf('xls') >= 0) {
          filesFiltred.push(filePaths[0] + file);
        }
      }
      return filesFiltred;
    }
  });
  ipcMain.handle('importData', async (event, filePath, destination, mode) => {
    console.log('importData', filePath, destination, mode);
    const data = await fileReaderNode.importData(filePath);
    return data;
  });
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

