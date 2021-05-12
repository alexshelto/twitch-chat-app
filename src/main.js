const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

require('electron-reload')(__dirname); //dev stuff 


let mainWindow;
let filterWindow;
let chatBrowserWindow;


function createWindow () {

  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    resizable: true,
    webPreferences: {
      nodeIntegration: true
    //   preload: path.join(__dirname, '/src/preload.js')
    }
  });

  //load the content file
  mainWindow.loadURL(`file://${__dirname}/index.html`);

}



// Launching the main window
app.on('ready',() => {
  createWindow();

  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

});


/*
function createFilterWindow() {
  filterWindow = new BrowserWindow(
    {
      width: 300,
      height: 200,
      title: 'Filter Chat
    
    }
  );
}
*/

function createChatBrowserWindow() {
  chatBrowserWindow = new BrowserWindow(
    {
      width: 300,
      height: 200,
      title: 'Select Channel'
    });
  // Loading the html file for the window
  chatBrowserWindow.loadURL(`file://${__dirname}/channelSelect.html`);
}

const menuTemplate = [
  {label: ''}, // empty for osx 
  // label 1
  {
    label: 'chat',
    submenu: [
      {
        label: 'Change Channel',
        click() { createChatBrowserWindow(); }
      },
      {
        label: 'Filter',
      }
    ]
  }
];


