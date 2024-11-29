const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    incrementCounter: () => ipcRenderer.invoke('counter:increment'),
    decrementCounter: () => ipcRenderer.invoke('counter:decrement'),
    resetCounter: () => ipcRenderer.invoke('counter:reset'),
    getCounter: () => ipcRenderer.invoke('counter:get'),
    onCounterUpdate: (callback) => {
        ipcRenderer.on('update-counter', (_ev, newCounter) =>
            callback(newCounter)
        )
    },
})
