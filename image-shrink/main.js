const { app, BrowserWindow, Menu, globalShortcut } = require('electron');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: 'Image Shrink',
		width: 500,
		height: 600,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: isDev ? true : false,
		backgroundColor: 'white'
	});
	// Can be used if CSP meta header not set
	// mainWindow.loadURL(`file://${__dirname}/app/index.html`);
	mainWindow.loadFile(`${__dirname}/app/index.html`);
}

app.on('ready', () => {
	createMainWindow();

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);

	globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload());
	globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () =>
		mainWindow.toggleDevTools()
	);

	mainWindow.on('ready', () => (mainWindow = null));
});

const menu = [
	...(isMac ? [{ role: 'appMenu' }] : []),
	{
		label: 'File',
		submenu: [
			{
				label: 'Quit',
				accelerator: 'CmdOrCtrl+W',
				click: () => app.quit()
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
						{ role: 'seperator' },
						{ role: 'toggleDevTools' }
					]
				}
		  ]
		: [])
];

// if (isMac) {
// 	menu.unshift({ role: 'appMenu' });
// }

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (!isMac) {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
