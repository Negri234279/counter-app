const { GlobalKeyboardListener } = require('node-global-key-listener')
const { Notification } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const { EventEmitter } = require('events')

require('dotenv').config()

/**
 * Clase que maneja el contador y las notificaciones
 */
class CounterNotifier extends EventEmitter {
    static _COUNTER_FILE = path.resolve(__dirname, 'counter.json')

    /**
     * @type {number}
     */
    counter

    constructor(listenerModule = GlobalKeyboardListener) {
        super()

        this.listener = new listenerModule()

        this.incrementKey = process.env.INCREMENT_KEY || 'NUMPAD PLUS'
        this.decrementKey = process.env.DECREMENT_KEY || 'NUMPAD MINUS'
        this.resetKey = process.env.RESET_KEY || 'F1'

        this.debounceDelay = 300 // Tiempo de debounce en milisegundos
        this.lastPressed = 0 // Marca de tiempo del último evento

        this._loadCounter()
        this._setupKeyboardListener()
        this._showInitialMessage()
    }

    /**
     * Muestra el mensaje inicial al iniciar la aplicación
     */
    _showInitialMessage() {
        console.clear()
        console.log(`Counter: ${this.counter}`)
        console.log(
            `Press "${this.incrementKey}" to increment, "${this.decrementKey}" to decrement, or "${this.resetKey}" to reset.`
        )
    }

    /**
     * Configura el listener del teclado para escuchar eventos de teclas
     */
    _setupKeyboardListener() {
        this.listener.addListener((ev) => {
            // Verificar que no haya pasado el tiempo de debounce
            const now = Date.now()
            if (now - this.lastPressed > this.debounceDelay) {
                this.lastPressed = now
                if (ev.name === this.incrementKey) {
                    this.incrementCounter()
                } else if (ev.name === this.decrementKey) {
                    this.decrementCounter()
                } else if (ev.name === this.resetKey) {
                    this.resetCounter()
                }
            }
        })
    }

    /**
     * Incrementa el contador y muestra una notificación
     */
    incrementCounter() {
        this.counter++
        this._updateCounter()
        this._showCounter()

        this.emit('counter-changed', {
            action: 'increment',
            value: this.counter,
        })
        this._showNotification(
            'Counter incremented',
            `Counter: ${this.counter}`
        )

        return this.counter
    }

    /**
     * Decrementa el contador y muestra una notificación
     */
    decrementCounter() {
        if (this.counter <= 0) {
            return this.counter
        }

        this.counter--
        this._updateCounter()
        this._showCounter()

        this.emit('counter-changed', {
            action: 'decrement',
            value: this.counter,
        })
        this._showNotification(
            'Counter decremented',
            `Counter: ${this.counter}`
        )

        return this.counter
    }

    /**
     * Reinicia el contador a 0 y muestra una notificación
     */
    resetCounter() {
        this.counter = 0
        this._updateCounter()

        console.clear()
        console.log('Counter reset.')

        this.emit('counter-changed', { action: 'reset', value: this.counter })
        this._showNotification('Counter reset', `Counter: ${this.counter}`)

        return this.counter
    }

    /**
     * Muestra el valor actual del contador en la consola
     */
    _showCounter() {
        console.clear()
        console.log(`Counter: ${this.counter}`)
    }

    /**
     * Carga el valor del contador desde el archivo
     */
    _loadCounter() {
        if (fs.existsSync(CounterNotifier._COUNTER_FILE)) {
            try {
                const data = fs.readFileSync(
                    CounterNotifier._COUNTER_FILE,
                    'utf-8'
                )
                this.counter = JSON.parse(data).counter || 0
            } catch (error) {
                console.error('Error al leer el archivo del contador:', error)
                this.counter = 0
            }
        }
    }

    /**
     * Guarda el valor del contador en el archivo
     */
    _updateCounter() {
        try {
            fs.writeFileSync(
                CounterNotifier._COUNTER_FILE,
                JSON.stringify({ counter: this.counter }),
                'utf-8'
            )
        } catch (error) {
            console.error('Error al guardar el contador:', error)
        }
    }

    /**
     * Muestra una notificación nativa
     * @param {string} title Título de la notificación
     * @param {string} body Cuerpo del mensaje de la notificación
     */
    _showNotification(title, body) {
        new Notification({
            title,
            body,
            silent: true,
        }).show()
    }
}

module.exports = CounterNotifier
