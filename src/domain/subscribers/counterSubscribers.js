const { Notification } = require('electron')
const DomainEventDispatcher = require('../events/DomainEventDispatcher')
const CounterRepositoryImpl = require('../../infrastructure/persistence/CounterRepository')
const CounterNotifier = require('../models/CounterNotifier')
const CounterChangedEvent = require('../events/CounterChangedEvent')

const counterRepositoryImpl = new CounterRepositoryImpl()

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'europe/Madrid',
})

function showNotification(title, message) {
    new Notification({ title, body: message, sound: false }).show()
}

DomainEventDispatcher.subscribe(CounterChangedEvent, (event) => {
    const { action, value, timestamp } = event

    const msgMap = {
        increment: `Incremented by ${value}`,
        decrement: `Decremented by ${value}`,
        reset: 'Reset',
    }

    counterRepositoryImpl.update(new CounterNotifier(value))

    const message = msgMap[action] || 'Unknown action'

    showNotification('Evento del Contador', message)
    console.clear()

    const dateFormat = dateFormatter.format(timestamp)

    console.log(`[CounterChangedEvent] ${message} at ${dateFormat}`)
})
