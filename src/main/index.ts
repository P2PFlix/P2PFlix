import {app, shell, BrowserWindow} from 'electron';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import {optimizer, is} from '@electron-toolkit/utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
		},
	});

	mainWindow.webContents.setWindowOpenHandler(details => {
		shell.openExternal(details.url).catch((error: Error) => {
			throw error;
		});
		return {action: 'deny'};
	});

	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']).catch((error: Error) => {
			throw error;
		});
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html')).catch((error: Error) => {
			throw error;
		});
	}
};

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.whenReady().then(() => {
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});

	createWindow();
// eslint-disable-next-line unicorn/prefer-top-level-await
}).catch((error: Error) => {
	throw error;
});
