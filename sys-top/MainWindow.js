const { BrowserWindow } = require('electron');

class MainWindow extends BrowserWindow {
    constructor(file, isDev) {
        // Anything passed into super is passed into BrowserWindow
        super({
            title: 'SysTop',
            width: isDev ? 700 : 355,
            height: 500,
            icon: './assets/icons/icon.png',
            resizable: isDev ? true : false,
            backgroundColor: 'white',
            webPreferences: {
                nodeIntegration: true
            },
            show: false,
            opacity: .89,
        })

        if (isDev) {
            this.webContents.openDevTools();
        }

        this.loadFile(file)
    }
}

module.exports = MainWindow