class DomainEventDispatcher {
    /**
     * @type {Map<string, ((event: any) => void)[]>}
     */
    handlers

    constructor() {
        this.handlers = new Map()
    }

    /**
     * Suscribe un manejador a un tipo de evento.
     * @template T - El tipo del evento.
     * @param {new (...args: any[]) => T} eventClass - La clase del evento al que suscribirse.
     * @param {(event: T) => void} handler - El manejador del evento.
     */
    subscribe(eventClass, handler) {
        const eventType = eventClass.name
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, [])
        }
        this.handlers.get(eventType).push(handler)
    }

    /**
     * Publica un evento.
     * @template T - El tipo del evento.
     * @param {new (...args: any[]) => T} event - El evento a publicar.
     */
    publish(event) {
        const eventType = event.constructor.name
        const handlers = this.handlers.get(eventType) || []
        handlers.forEach((handler) => handler(event))
    }
}

module.exports = new DomainEventDispatcher()
