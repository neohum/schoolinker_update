const { app, BrowserWindow, ipcMain,  dialog } = require('electron/main')
const log = require('electron-log')
let fs = require('fs');
const { autoUpdater } = require('electron-updater');
const { ipcRenderer } = require('electron');




const createWindow = () => {
  if (fs.existsSync('school_uid.txt')) {
    const win2 = new BrowserWindow({
      width: 400,
      height: 833,
      frame: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    })

    win2.loadFile('next.html')
    return;
  }
  const win = new BrowserWindow({
    width: 400,
    height: 833,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('index.html')
  document.getElementById("saveBtn").addEventListener("click", closeApp);
}
ipcMain.on('saveData', (event, data) => {
  let fs = require('fs');
  console.log(data);
  if (fs.existsSync('school_uid.txt')) {
    fs.unlink('school_uid.txt', (err) => {
      if (err) throw err;
      console.log('File deleted!');
    });
  }
  // 0o666은 읽기/쓰기 권한을 모든 사용자에게 부여
  fs.writeFile('school_uid.txt', data, { mode: 0o666 }, (err) => {
    if (err) {
      log.error('File write error:', err);
      throw err;
    }
    console.log('Data saved');
  });

  const win = new BrowserWindow({
    width: 400,
    height: 833,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('next.html')
})



autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  log.info('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.')
})
autoUpdater.on('error', (err) => {
  log.info('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  log.info(log_message)
})

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded')
  autoUpdater.quitAndInstall()
})

app.whenReady().then(() => {
  createWindow()

  autoUpdater.checkForUpdates()


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()

    }
  })
})

ipcMain.on('close', () => {
  app.quit()
})

