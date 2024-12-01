const counterDisplay = document.getElementById('counter')
const incrementButton = document.getElementById('increment')
const decrementButton = document.getElementById('decrement')
const resetButton = document.getElementById('reset')

/**
 * @type {import('./preload').CounterAPI}
 */
const counterAPI = window.api

const updateCounterDisplay = async () => {
    const counter = await counterAPI.getCounter()
    counterDisplay.textContent = counter
}

updateCounterDisplay()

counterAPI.onCounterUpdate((newCounter) => {
    counterDisplay.textContent = newCounter
})

incrementButton.addEventListener('click', async () => {
    const newCounter = await counterAPI.performCounterAction('increment')
    counterDisplay.textContent = newCounter
})

decrementButton.addEventListener('click', async () => {
    const newCounter = await counterAPI.performCounterAction('decrement')
    counterDisplay.textContent = newCounter
})

resetButton.addEventListener('click', async () => {
    const newCounter = await counterAPI.performCounterAction('reset')
    counterDisplay.textContent = newCounter
})
