const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

// Start the express backend server
require('./backend/server.cjs');

let mainWindow;

async function getDevPort() {
    const http = require('http');
    // Check port 5174 first (barangay-lupon-system), then fallback
    const ports = [5174, 5173, 5175];
    for (const port of ports) {
        try {
            const found = await new Promise((resolve) => {
                const req = http.get(`http://localhost:${port}`, res => {
                    // Check if this is the lupon system by reading response
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        // The lupon system index.html has "Barangay Lupon System" title
                        if (body.includes('Barangay Lupon System')) resolve(port);
                        else resolve(null);
                    });
                });
                req.on('error', () => resolve(null));
                req.setTimeout(1000, () => { req.destroy(); resolve(null); });
            });
            if (found) return found;
        } catch {}
    }
    return 5174; // fallback to 5174
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true,
        title: "Barangay Lupon System"
    });

    if (isDev) {
        // Find the correct Vite port running Barangay Lupon System
        getDevPort().then(port => {
            console.log(`Loading Barangay Lupon System from port: ${port}`);
            mainWindow.loadURL(`http://localhost:${port}`);
        });
    } else {
        // In production, load the built static files
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});
