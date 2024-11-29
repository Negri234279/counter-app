const { Notification } = require('electron')
const DomainEventDispatcher = require('../events/DomainEventDispatcher')
const CounterRepositoryImpl = require('../../infrastructure/persistence/CounterRepository')

const counterRepositoryImpl = new CounterRepositoryImpl()

function showNotification(title, message) {
    new Notification({ title, body: message, sound: false }).show()
}

DomainEventDispatcher.subscribe('CounterChangedEvent', (event) => {
    const { action, value } = event

    const msgMap = {
        increment: `Incremented by ${value}`,
        decrement: `Decremented by ${value}`,
        reset: 'Reset',
    }

    counterRepositoryImpl.update(value)

    const message = msgMap[action] || 'Unknown action'

    showNotification('Evento del Contador', message)
    console.log(`[CounterChangedEvent] ${message}`)
})