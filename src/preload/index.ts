import {contextBridge} from 'electron';
import process from 'node:process';
import {electronAPI} from '@electron-toolkit/preload';

const api = {};

if (process.contextIsolated) {
	contextBridge.exposeInMainWorld('electron', electronAPI);
	contextBridge.exposeInMainWorld('api', api);
} else {
	window.electron = electronAPI;
	window.api = api;
}
