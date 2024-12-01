const path = require('node:path')
const fs = require('node:fs')
const CounterNotifier = require('../../domain/models/CounterNotifier')

class CounterRepositoryImpl {
    #filePath = path.resolve(__dirname, './counter.json')

    /**
     * @returns {CounterNotifier}
     */
    find() {
        try {
            const data = fs.readFileSync(this.#filePath, 'utf-8')
            const { counter = 0 } = JSON.parse(data)

            return new CounterNotifier(counter)
        } catch (error) {
            console.error('Error al leer el archivo:\n', error)
            throw new Error('Error al leer el archivo')
        }
    }

    /**
     * @param {CounterNotifier} counterNotifier
     */
    update(counterNotifier) {
        try {
            const { counter = 0 } = counterNotifier

            fs.writeFileSync(
                this.#filePath,
                JSON.stringify({ counter }),
                'utf-8'
            )
        } catch (error) {
            console.error('Error al guardar el contador:\n', error)
            throw new Error('Error al guardar el contador')
        }
    }
}

module.exports = CounterRepositoryImpl