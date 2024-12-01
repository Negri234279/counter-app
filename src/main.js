require('./domain/subscribers')

const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const CounterNotifier = require('./domain/models/CounterNotifier')
const CounterRepositoryImpl = require('./infrastructure/persistence/CounterRepository')
const UpdateCounterUseCase = require('./application/usecases/UpdateCounterUseCase')

/**
 * @type {CounterNotifier}
 */
let counterNotifier

const counterRepository = new CounterRepositoryImpl()
const updateCounterUseCase = new UpdateCounterUseCase(counterRepository)

function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    win.loadFile('index.html')

	counterNotifier = counterRepository.find()

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

ipcMain.handle('counter:get', () => {
    return counterNotifier.counter
})

ipcMain.handle('counter:action', (_, action) =>
    updateCounterUseCase.execute(action),
)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
