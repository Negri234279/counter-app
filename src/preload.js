const { contextBridge, ipcRenderer } = require('electron')

/**
 * @typedef {Object} CounterAPI
 * @property {(action: 'increment' | 'decrement' | 'reset') => Promise<number>} performCounterAction - Perform a counter action.
 * @property {() => Promise<number>} getCounter - Get the current counter value.
 * @property {(callback: (newCounter: number) => void) => void} onCounterUpdate - Listen for counter updates.
 */

contextBridge.exposeInMainWorld(
    'api',
    /** @type {CounterAPI} */ ({
        performCounterAction: (action) =>
            ipcRenderer.invoke('counter:action', action),
        getCounter: () => ipcRenderer.invoke('counter:get'),
        onCounterUpdate: (callback) => {
            ipcRenderer.on('counter', (_event, value) => callback(value))
        },
    }),
)
