const partInputs = document.querySelectorAll('.part')
const wholeInputs = document.querySelectorAll('.whole')
const percentInputs = document.querySelectorAll('.percent')

let part = NaN
let whole = NaN
let percent = NaN

let decimalPlaces = 2

function parseNumericValue(rawValue) {
    const value = rawValue.trim()
    if (value === '') {
        return NaN
    }

    const parsed = Number.parseFloat(value)
    return Number.isNaN(parsed) ? NaN : parsed
}

function syncInputGroup(inputs, notThisIndex, value) {
    const displayValue = Number.isFinite(value) ? String(value) : ''

    inputs.forEach((input, index) => {
        if (index !== notThisIndex) {
            input.value = displayValue
        }
    })
}

function renderResults() {

    if (part % 1 === 0) { decimalPlaces = 0 }
    if (whole % 1 === 0) { decimalPlaces = 0 }
    if (percent % 1 === 0) { decimalPlaces = 0 }

    document.querySelectorAll('.partResult').forEach(span => {
        span.textContent = Number.isFinite(part) ? part.toFixed(decimalPlaces) : ''
    })
    document.querySelectorAll('.percentResult').forEach(span => {
        span.textContent = Number.isFinite(percent) ? percent.toFixed(decimalPlaces) : ''
    })
    document.querySelectorAll('.wholeResult').forEach(span => {
        span.textContent = Number.isFinite(whole) ? whole.toFixed(decimalPlaces) : ''
    })

    const blankFractionPlaceholder = '???'

    document.querySelector('.numeratorPart').textContent = Number.isFinite(part) ? part.toFixed(decimalPlaces) : blankFractionPlaceholder
    document.querySelector('.denominatorWhole').textContent = Number.isFinite(whole) ? whole.toFixed(decimalPlaces) : blankFractionPlaceholder
    document.querySelector('.numeratorPercent').textContent = Number.isFinite(percent) ? percent.toFixed(decimalPlaces) : blankFractionPlaceholder
}

function calculateFrom(changedType) {
    if (changedType === 'part') {
        if (Number.isFinite(part) && Number.isFinite(whole) && whole !== 0) {
            percent = 100 * part / whole
        } else if (Number.isFinite(part) && Number.isFinite(percent) && percent !== 0) {
            whole = part * 100 / percent
        }
    }
    else if (changedType === 'whole') {
        if (Number.isFinite(whole) && Number.isFinite(percent)) {
            part = whole * percent / 100
        } else if (Number.isFinite(whole) && Number.isFinite(part) && whole !== 0) {
            percent = 100 * part / whole
        }
    }
    else if (changedType === 'percent') {
        if (Number.isFinite(percent) && Number.isFinite(whole)) {
            part = whole * percent / 100
        } else if (Number.isFinite(percent) && Number.isFinite(part) && percent !== 0) {
            whole = part * 100 / percent
        }
    }
}

function updateAll(notThisIndex) {
    syncInputGroup(partInputs, notThisIndex, part)
    syncInputGroup(wholeInputs, notThisIndex, whole)
    syncInputGroup(percentInputs, notThisIndex, percent)
    renderResults()
}

function handleInput(input, notThisIndex, type) {
    const parsed = parseNumericValue(input.value)

    if (type === 'part') {
        part = parsed
    } else if (type === 'whole') {
        whole = parsed
    } else {
        percent = parsed
    }

    calculateFrom(type)

    if (!Number.isFinite(part)) {
        part = NaN
    }
    if (!Number.isFinite(whole)) {
        whole = NaN
    }
    if (!Number.isFinite(percent)) {
        percent = NaN
    }

    updateAll(notThisIndex)
}

updateAll()

partInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => handleInput(input, index, 'part'))
})
wholeInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => handleInput(input, index, 'whole'))
})
percentInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => handleInput(input, index, 'percent'))
})
