const partInputs = document.querySelectorAll('.part')
const wholeInputs = document.querySelectorAll('.whole')
const percentInputs = document.querySelectorAll('.percent')

const oldValueInput = document.querySelector('.oldValue')
const newValueInput = document.querySelector('.newValue')

let part = NaN
let whole = NaN
let percent = NaN
let oldValue = NaN
let newValue = NaN
let percentageChange = NaN

let decimalPlaces = 2

function parseNumericValue(rawValue) {
    const value = rawValue.trim()
    if (value === '') {
        return NaN
    }

    const parsed = Number.parseFloat(value)
    return Number.isNaN(parsed) ? NaN : parsed
}

function syncInputGroup(inputs, value, skipInput = null) {
    const displayValue = Number.isFinite(value)
        ? String(
            value % 1 === 0
                ? Math.round(value)
                : value.toFixed(decimalPlaces)
        )
        : ''

    inputs.forEach((input) => {
        if (input !== skipInput) {
            input.value = displayValue
        }
    })
}

function getInputForRow(inputs, row) {
    return Array.from(inputs).find((input) => Number.parseInt(input.dataset.row, 10) === row) || null
}

function renderResults() {
    let partDecimalPlaces = part % 1 === 0 ? 0 : decimalPlaces
    let wholeDecimalPlaces = whole % 1 === 0 ? 0 : decimalPlaces
    let percentDecimalPlaces = percent % 1 === 0 ? 0 : decimalPlaces
    let changeDecimalPlaces = percentageChange % 1 === 0 ? 0 : decimalPlaces

    document.querySelectorAll('.partResult').forEach(span => {
        span.textContent = Number.isFinite(part) ? part.toFixed(partDecimalPlaces) : '???'
    })
    document.querySelectorAll('.percentResult').forEach(span => {
        span.textContent = Number.isFinite(percent) ? percent.toFixed(percentDecimalPlaces) : '???'
    })
    document.querySelectorAll('.wholeResult').forEach(span => {
        span.textContent = Number.isFinite(whole) ? whole.toFixed(wholeDecimalPlaces) : '???'
    })
    document.querySelectorAll('.percentageChangeResult').forEach(span => {
        span.textContent = Number.isFinite(percentageChange) ? percentageChange.toFixed(changeDecimalPlaces) : '???'
    })

    const blankFractionPlaceholder = '???'

    document.querySelector('.numeratorPart').textContent = Number.isFinite(part) ? part.toFixed(partDecimalPlaces) : blankFractionPlaceholder
    document.querySelector('.denominatorWhole').textContent = Number.isFinite(whole) ? whole.toFixed(wholeDecimalPlaces) : blankFractionPlaceholder
    document.querySelector('.numeratorPercent').textContent = Number.isFinite(percent) ? percent.toFixed(percentDecimalPlaces) : blankFractionPlaceholder
    document.querySelector('.numeratorChange').textContent = Number.isFinite(newValue) && Number.isFinite(oldValue)
        ? (newValue - oldValue).toFixed(changeDecimalPlaces)
        : blankFractionPlaceholder
    document.querySelector('.denominatorOld').textContent = Number.isFinite(oldValue) ? oldValue.toFixed(changeDecimalPlaces) : blankFractionPlaceholder
    document.querySelector('.numeratorPercentChange').textContent = Number.isFinite(percentageChange)
        ? percentageChange.toFixed(changeDecimalPlaces)
        : blankFractionPlaceholder
}

function calculateFrom(row) {
    if (row === 0) {
        if (Number.isFinite(whole) && Number.isFinite(percent)) {
            part = whole * percent / 100
        }
    } else if (row === 1) {
        if (Number.isFinite(part) && Number.isFinite(whole) && whole !== 0) {
            percent = 100 * part / whole
        }
    } else if (row === 2) {
        if (Number.isFinite(part) && Number.isFinite(percent) && percent !== 0) {
            whole = part * 100 / percent
        }
    } else if (row === 3) {
        if (Number.isFinite(oldValue) && Number.isFinite(newValue) && oldValue !== 0) {
            percentageChange = 100 * (newValue - oldValue) / oldValue
        } else {
            percentageChange = NaN
        }
    }
}

function updateAll(activeInput = null) {
    const editedRow = activeInput ? Number.parseInt(activeInput.dataset.row, 10) : null

    const partSkipInput = editedRow !== null ? getInputForRow(partInputs, editedRow) : null
    const wholeSkipInput = editedRow !== null ? getInputForRow(wholeInputs, editedRow) : null
    const percentSkipInput = editedRow !== null ? getInputForRow(percentInputs, editedRow) : null

    const oldValueSkipInput = editedRow !== null && editedRow === 3 ? oldValueInput : null
    const newValueSkipInput = editedRow !== null && editedRow === 3 ? newValueInput : null

    syncInputGroup(partInputs, part, partSkipInput)
    syncInputGroup(wholeInputs, whole, wholeSkipInput)
    syncInputGroup(percentInputs, percent, percentSkipInput)

    syncInputGroup([oldValueInput], parseNumericValue(oldValueInput.value), oldValueSkipInput)
    syncInputGroup([newValueInput], parseNumericValue(newValueInput.value), newValueSkipInput)

    renderResults()

    document.querySelectorAll('input').forEach((input) => resizeInput(input))
}

function resizeInput(input) {
    const value = input.value || input.placeholder || ''
    const width = Math.max(3, Math.min(20, value.length + 1))
    input.style.width = `${width}ch`
}

function handleInput(input, type) {
    const parsed = parseNumericValue(input.value)

    if (type === 'part') {
        part = parsed
    } else if (type === 'whole') {
        whole = parsed
    } else if (type === 'percent') {
        percent = parsed
    } else if (type === 'oldValue') {
        oldValue = parsed
    } else if (type === 'newValue') {
        newValue = parsed
    }

    calculateFrom(Number.parseInt(input.dataset.row, 10))

    if (!Number.isFinite(part)) {
        part = NaN
    }
    if (!Number.isFinite(whole)) {
        whole = NaN
    }
    if (!Number.isFinite(percent)) {
        percent = NaN
    }
    if (!Number.isFinite(oldValue)) {
        oldValue = NaN
    }
    if (!Number.isFinite(newValue)) {
        newValue = NaN
    }

    updateAll(input)
    resizeInput(input)
}

function setupInputSizing() {
    document.querySelectorAll('input').forEach((input) => {
        resizeInput(input)
        input.addEventListener('input', () => resizeInput(input))
    })
}

updateAll()

setupInputSizing()

partInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => handleInput(input, 'part'))
})
wholeInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => handleInput(input, 'whole'))
})
percentInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => handleInput(input, 'percent'))
})

oldValueInput.addEventListener('input', (event) => handleInput(oldValueInput, 'oldValue'))
newValueInput.addEventListener('input', (event) => handleInput(newValueInput, 'newValue'))
