class CounterChangedEvent {
    /**
     *
     * @param {'increment' | 'decrement' | 'reset'} action
     * @param {number} value
     */
    constructor(action, value) {
        this.timestamp = new Date()
        this.action = action
        this.value = value
    }
}

module.exports = CounterChangedEvent
