class UpdateCounterUseCase {
    /**
     * @param {import('../../infrastructure/persistence/CounterRepository')} counterRepository
     */
    constructor(counterRepository) {
        if (UpdateCounterUseCase.instance) {
            return UpdateCounterUseCase.instance
        }

        this.counterRepository = counterRepository

        UpdateCounterUseCase.instance = this
    }

    /**
     *
     * @param {'increment' | 'decrement' | 'reset'} action
     * @returns {number}
     */
    execute(action) {
        const counter = this.counterRepository.find()

        if (action === 'increment') {
            counter.incrementCounter()
        } else if (action === 'decrement') {
            counter.decrementCounter()
        } else if (action === 'reset') {
            counter.resetCounter()
        }

        this.counterRepository.update(counter)

        return counter.counter
    }
}

module.exports = UpdateCounterUseCase
