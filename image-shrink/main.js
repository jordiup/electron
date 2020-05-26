const path = require('path');
const os = require('os');
const log = require('electron-log');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const slash = require('slash');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: 'Image Shrink',
		width: isDev ? 800 : 500,
		height: 600,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: isDev ? true : false,
		backgroundColor: 'white',
		webPreferences: {
			nodeIntegration: true
		}
	});
	// Can be used if CSP meta header not set
	// mainWindow.loadURL(`file://${__dirname}/app/index.html`);
	mainWindow.loadFile(`${__dirname}/app/index.html`);
}

function createAboutWindow() {
	aboutWindow = new BrowserWindow({
		title: 'About Image Shrink',
		width: 300,
		height: 300,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: false,
		backgroundColor: 'white'
	});
	aboutWindow.loadFile(`${__dirname}/app/about.html`);
}

app.on('ready', () => {
	createMainWindow();

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);

	mainWindow.on('ready', () => (mainWindow = null));
});

const menu = [
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: 'About',
							click: createAboutWindow
						}
					]
				}
		  ]
		: [
				{
					label: 'Help',
					submenu: [
						{
							label: 'About',
							click: createAboutWindow
						}
					]
				}
		  ]),
	{
		role: 'fileMenu'
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

ipcMain.on('image:minimize', (e, options) => {
	options.dest = path.join(os.homedir(), 'imageshrink');
	shrinkImage(options);

	console.log(options);
	log.info(options);
});

async function shrinkImage({ imgPath, quality, dest }) {
	const pngQual = quality / 100;
	try {
		const files = await imagemin([slash(imgPath)], {
			destination: dest,
			plugins: [
				imageminMozjpeg(quality),
				imageminPngquant({
					quality: [pngQual, pngQual]
				})
			]
		});
		// console.log(files);
		shell.openPath(dest);
		mainWindow.webContents.send('image:done');
	} catch (err) {
		console.log(err);
		log.error(err);
	}
	//=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
}

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
