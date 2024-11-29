class DomainEventDispatcher {
    constructor() {
        this.handlers = new Map()
    }

    subscribe(eventType, handler) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, [])
        }
        this.handlers.get(eventType).push(handler)
    }

    publish(event) {
        const handlers = this.handlers.get(event.constructor.name) || []
        handlers.forEach((handler) => handler(event))
    }
}

module.exports = new DomainEventDispatcher()
