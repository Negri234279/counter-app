class CounterChangedEvent {
    constructor(action, value) {
        this.timestamp = new Date()
        this.action = action
        this.value = value
    }
}

module.exports = CounterChangedEvent
