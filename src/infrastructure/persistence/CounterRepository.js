const path = require('node:path')
const fs = require('node:fs')

class CounterRepositoryImpl {
    #filePath = path.resolve(__dirname, './counter.json')

    find() {
        try {
            const data = fs.readFileSync(this.#filePath, 'utf-8')
            const { counter = 0 } = JSON.parse(data)

            return counter
        } catch (error) {
            console.error('Error al leer el archivo:\n', error)
            throw new Error('Error al leer el archivo')
        }
    }

    /**
     * @param {number} value
     */
    update(value) {
        try {
            fs.writeFileSync(
                this.#filePath,
                JSON.stringify({ counter: value }),
                'utf-8'
            )
        } catch (error) {
            console.error('Error al guardar el contador:\n', error)
            throw new Error('Error al guardar el contador')
        }
    }
}

module.exports = CounterRepositoryImpl