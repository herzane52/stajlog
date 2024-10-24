const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

const startServer = require('./server'); // Express sunucusunu içe aktar


let serverApp;


async function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, //sistemin kenddine ait uygulama pencereleri(kapalı)
    icon: path.join(__dirname, '../frontend/img/logo.png'), // Linux ve Windows için .png kullanın
    webPreferences: {
      preload: path.join(__dirname, './electron.js/preload.js'), // Preload dosyasını buradan yükleyin
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL('http://localhost:4000');

  

  ipcMain.on('window-minimize', () => {
    mainWindow.minimize(); 
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    mainWindow.close();
  });
}

app.whenReady().then(async () => {
  try {
    serverApp = await startServer(); // Express sunucusunu başlat

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        if (serverApp) {
          serverApp.close(); // Express sunucusunu durdur
        }
        app.quit();
      }
    });
  } catch (error) {
    console.error('Uygulama başlatılamadı:', error);
    app.quit();
  }
});







// Hata işleyiciler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Hata sonrası uygulamayı kapat
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Hata sonrası uygulamayı kapat
});
