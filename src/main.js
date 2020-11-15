const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

require('electron-reload')(__dirname); //dev stuff 



let mainWindow;


function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      nodeIntegration: true
    //   preload: path.join(__dirname, '/src/preload.js')
    }
  });
  //load the content file
  mainWindow.loadFile('./src/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  //handling window close
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}


//creating window method
app.whenReady().then(createWindow);

//quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});


app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
