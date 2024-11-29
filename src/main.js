const { app, BrowserWindow, ipcMain } = require('electron/main')
const { Notification } = require('electron')
const path = require('node:path')
const CounterNotifier = require('./CounterNotifier')

/**
 * @type {CounterNotifier}
 */
let counterNotifier

function showNotificationCounter(action) {
    const titileMap = {
        increment: 'Incremented',
        decrement: 'Decremented',
        reset: 'Reset',
    }

    const title = titileMap[action] || 'Unknown action'

    const message = `Counter: ${counterNotifier.counter}`

    new Notification({ title, body: message, sound: false }).show()
}

function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    win.loadFile('index.html')

    counterNotifier = new CounterNotifier()

    counterNotifier.on('counter-changed', ({ action, value }) => {
        if (win) {
            win.webContents.send('update-counter', value)

            showNotificationCounter(action)
        }
    })

    win.webContents.once('dom-ready', () => {
        win.webContents.send('counter', counterNotifier.counter)
    })

    win.on('closed', () => {
        win = null
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

ipcMain.handle('counter:increment', () => {
    const newCounter = counterNotifier.incrementCounter()
    return newCounter
})

ipcMain.handle('counter:decrement', () => {
    const newCounter = counterNotifier.decrementCounter()
    return newCounter
})

ipcMain.handle('counter:reset', () => {
    const newCounter = counterNotifier.resetCounter()
    return newCounter
})

ipcMain.handle('counter:get', () => {
    return counterNotifier.counter
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
