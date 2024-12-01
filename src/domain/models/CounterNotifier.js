require('dotenv').config()

const { GlobalKeyboardListener } = require('node-global-key-listener')
const path = require('node:path')
const fs = require('node:fs')
const { EventEmitter } = require('events')
const CounterChangedEvent = require('../events/CounterChangedEvent')
const DomainEventDispatcher = require('../events/DomainEventDispatcher')

/**
 * Clase que maneja el contador y las notificaciones
 */
class CounterNotifier extends EventEmitter {
    /**
     * @type {number}
     */
    counter

    /**
     * @param {number} counter
     */
    constructor(counter) {
        super()

        this.counter = counter || 0

        this.listener = new GlobalKeyboardListener()

        this.incrementKey = process.env.INCREMENT_KEY || 'NUMPAD PLUS'
        this.decrementKey = process.env.DECREMENT_KEY || 'NUMPAD MINUS'
        this.resetKey = process.env.RESET_KEY || 'F1'

        this.debounceDelay = 300 // Tiempo de debounce en milisegundos
        this.lastPressed = 0 // Marca de tiempo del último evento

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
     * @returns {CounterNotifier}
     */
    incrementCounter() {
        this.counter++

        this._emitEvent('increment')

        return new CounterNotifier(this.counter)
    }

    /**
     * Decrementa el contador y muestra una notificación
     * @returns {CounterNotifier}
     */
    decrementCounter() {
        if (this.counter <= 0) {
            return new CounterNotifier(this.counter)
        }

        this.counter--

        this._emitEvent('decrement')

        return new CounterNotifier(this.counter)
    }

    /**
     * Reinicia el contador a 0 y muestra una notificación
     * @returns {CounterNotifier}
     */
    resetCounter() {
        this.counter = 0

        this._emitEvent('reset')

        return new CounterNotifier(this.counter)
    }

    /**
     * Emite un evento de contador cambiado
     * @param {'increment' | 'decrement' | 'reset'} action Acción que se realizó
     */
    _emitEvent(action) {
        const event = new CounterChangedEvent(action, this.counter)
        DomainEventDispatcher.publish(event)
    }
}

module.exports = CounterNotifier
