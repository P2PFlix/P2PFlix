import {contextBridge} from 'electron';
import process from 'node:process';
import {electronAPI} from '@electron-toolkit/preload';

const api = {};

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Window {
		electron: typeof electronAPI;
		api: typeof api;
	}
}

if (process.contextIsolated) {
	contextBridge.exposeInMainWorld('electron', electronAPI);
	contextBridge.exposeInMainWorld('api', api);
} else {
	window.electron = electronAPI;
	window.api = api;
}
