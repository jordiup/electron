const { app, Menu, ipcMain } = require('electron');
const Store = require('./Store');
const path = require('path');
const MainWindow = require('./MainWindow');
const AppTray = require('./AppTray');

// Statically set env for tesing NODE_ENV
process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let tray;

// Init store and defaults
const store = new Store({
	configName: 'user-settings',
	defaults: {
		settings: {
			cpuOverload: 80,
			alertFrequency: 5
		}
	}
});

function createMainWindow() {
	mainWindow = new MainWindow('./app/index.html', isDev);
}

app.on('ready', () => {
	createMainWindow();

	mainWindow.webContents.on('dom-ready', () => {
		mainWindow.webContents.send('settings:get', store.get('settings'));
	});

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);

	mainWindow.on('closed', e => {
		if (!app.isQuitting) {
			e.preventDefault()
			mainWindow.hide()
		}

		return true
	})

	const icon = path.join(__dirname, 'assets', 'icons', 'tray_icon.png')

	tray = new AppTray(icon, mainWindow)


	// mainWindow.on('ready', () => (mainWindow = null))
});

const menu = [
	...(isMac ? [{ role: 'appMenu' }] : []),
	{
		role: 'fileMenu'
	},
	{
		label: 'View',
		submenu: [
			{
				label: 'Toggle Navigation',
				click: () => mainWindow.webContents.send('nav:toggle'),
			}
		]
	},
	...(isDev
		? [
			{
				label: 'Developer',
				submenu: [
					{ role: 'reload' },
					{ role: 'forcereload' },
					{ type: 'separator' },
					{ role: 'toggledevtools' }
				]
			}
		]
		: [])
];

ipcMain.on('settings:set', (e, value) => {
	store.set('settings', value);
});

app.on('window-all-closed', () => {
	if (!isMac) {
		app.quit();
	}
});

app.on('activate', () => {
	if (MainWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});

app.allowRendererProcessReuse = true;
