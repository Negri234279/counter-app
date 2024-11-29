const counterDisplay = document.getElementById("counter")
const incrementButton = document.getElementById("increment")
const decrementButton = document.getElementById("decrement")
const resetButton = document.getElementById("reset")

const updateCounterDisplay = async () => {
    const counter = await window.api.getCounter()
    counterDisplay.textContent = counter
}

updateCounterDisplay()

window.api.onCounterUpdate((newCounter) => {
    counterDisplay.textContent = newCounter
})

incrementButton.addEventListener("click", async () => {
    const newCounter = await window.api.incrementCounter()
    counterDisplay.textContent = newCounter
})

decrementButton.addEventListener("click", async () => {
    const newCounter = await window.api.decrementCounter()
    counterDisplay.textContent = newCounter
})

resetButton.addEventListener("click", async () => {
    const newCounter = await window.api.resetCounter()
    counterDisplay.textContent = newCounter
})
