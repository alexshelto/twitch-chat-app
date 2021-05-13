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



/*
 * Chat browser window
 * User inputs channel name to get their live chat in the chat window
 */
function createChatBrowserWindow() {
  chatBrowserWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      width: 300,
      height: 200,
      title: 'Select Channel'
    });
  // Loading the html file for the window
  chatBrowserWindow.loadURL(`file://${__dirname}/channelSelect.html`);
  
  // Garbage collect on close
  //chatBrowserWindow.on('closed', () => chatBrowserWindow = null; )
}

//IPC
ipcMain.on('get-chat:channel', (event, channelName) => {
  mainWindow.webContents.send('get-chat:channel', channelName);
  console.log(`received: ${channelName}`);
  // Close the window after they enter and send the channel
  chatBrowserWindow.close();
});



/*
 * Chat filter users 
 * user inputs usernames to filter chat
 * functionality will only show those users
 */
function createFilterWindow() {
  filterWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      width: 300,
      height: 200,
      title: 'Filter Chat'
    });
  // Loading the html file for the window
  filterWindow.loadURL(`file://${__dirname}/filterChat.html`);
}

//IPC
ipcMain.on('filter:username', (event, username) => {
  mainWindow.webContents.send('filter:username', username);
  console.log(`Adding: ${username} to the chat filter`);
  // Close the window after they enter and send the channel
  filterWindow.close();
});





const menuTemplate = [
  {label: ''}, // empty for osx 
  // label 1
  {
    label: 'Chat',
    submenu: [
      {
        label: 'Change Channel',
        click() { createChatBrowserWindow(); }
      },
      {
        label: 'Filter',
        click() { createFilterWindow(); }
      }
    ]
  }
];


// Main program / Window runtime
app.on('ready',() => {

  createWindow(); // Creating main program window

  mainWindow.on('closed', () => app.quit()); // kill all windows on main window close

  // Rendering menu bar and items
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});





// Showing dev tools when not in production mode
if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      {
        label: 'dev tool toggle',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
