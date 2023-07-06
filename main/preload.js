
const fileReaderNode = require('./FileReaderNode.js')
const { contextBridge, ipcRenderer } = require('electron')

window.fileUtils = fileReaderNode;
contextBridge.exposeInMainWorld('myAPI', {
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
    openFiles: () => ipcRenderer.invoke('dialog:openFiles'),
    openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
    importData: (filePath, destination, mode) => ipcRenderer.invoke('importData', filePath, destination, mode)
})
