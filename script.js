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

function syncInputGroup(inputs, value, skipInput = null) {
    const displayValue = Number.isFinite(value)
        ? String(value % 1 === 0
            ? value
            : value.toFixed(decimalPlaces))
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

    document.querySelectorAll('.partResult').forEach(span => {
        span.textContent = Number.isFinite(part) ? part.toFixed(partDecimalPlaces) : '???'
    })
    document.querySelectorAll('.percentResult').forEach(span => {
        span.textContent = Number.isFinite(percent) ? percent.toFixed(percentDecimalPlaces) : '???'
    })
    document.querySelectorAll('.wholeResult').forEach(span => {
        span.textContent = Number.isFinite(whole) ? whole.toFixed(wholeDecimalPlaces) : '???'
    })

    const blankFractionPlaceholder = '???'

    document.querySelector('.numeratorPart').textContent = Number.isFinite(part) ? part.toFixed(partDecimalPlaces) : blankFractionPlaceholder
    document.querySelector('.denominatorWhole').textContent = Number.isFinite(whole) ? whole.toFixed(wholeDecimalPlaces) : blankFractionPlaceholder
    document.querySelector('.numeratorPercent').textContent = Number.isFinite(percent) ? percent.toFixed(percentDecimalPlaces) : blankFractionPlaceholder
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

function updateAll(activeInput = null) {
    const editedRow = activeInput ? Number.parseInt(activeInput.dataset.row, 10) : null
    const partSkipInput = editedRow !== null ? getInputForRow(partInputs, editedRow) : null
    const wholeSkipInput = editedRow !== null ? getInputForRow(wholeInputs, editedRow) : null
    const percentSkipInput = editedRow !== null ? getInputForRow(percentInputs, editedRow) : null

    syncInputGroup(partInputs, part, partSkipInput)
    syncInputGroup(wholeInputs, whole, wholeSkipInput)
    syncInputGroup(percentInputs, percent, percentSkipInput)

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

    updateAll(input)
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
