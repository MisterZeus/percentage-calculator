const partInputs = document.querySelectorAll('.part')
const wholeInputs = document.querySelectorAll('.whole')
const percentInputs = document.querySelectorAll('.percent')

const oldValueInput = document.querySelector('.oldValue')
const newValueInput = document.querySelector('.newValue')

const percentageChangeResult = document.querySelector('.percentageChangeResult')

const decimalPlacesInput = document.querySelector('#decimalPlaces')
const showFormulasCheckbox = document.querySelector('#show-formulas')
const resetButton = document.querySelector('#reset-button')

let part = Number.isFinite(parseNumericValue(partInputs[0].value)) ? parseNumericValue(partInputs[0].value) : NaN
let whole = Number.isFinite(parseNumericValue(wholeInputs[0].value)) ? parseNumericValue(wholeInputs[0].value) : NaN
let percent = Number.isFinite(parseNumericValue(percentInputs[0].value)) ? parseNumericValue(percentInputs[0].value) : NaN

let oldValue = Number.isFinite(parseNumericValue(oldValueInput.value)) ? parseNumericValue(oldValueInput.value) : NaN
let newValue = Number.isFinite(parseNumericValue(newValueInput.value)) ? parseNumericValue(newValueInput.value) : NaN

let changeValue = Number.isFinite(oldValue) && Number.isFinite(newValue) ? newValue - oldValue : NaN

let percentageChange = Number.isFinite(parseNumericValue(percentageChangeResult.textContent.replace('%', '')))
    ? parseNumericValue(percentageChangeResult.textContent.replace('%', ''))
    : NaN

let decimalPlaces = Number.isFinite(parseNumericValue(decimalPlacesInput.value))
    ? parseNumericValue(decimalPlacesInput.value)
    : 2

function toggleFormulaVisibility() {
    const formulaElements = document.querySelectorAll('.formula')
    const showFormula = showFormulasCheckbox.checked

    formulaElements.forEach((formula) => {
        formula.style.display = showFormula ? 'flex' : 'none'
    })
}

function resetCalculator() {
    part = NaN
    whole = NaN
    percent = NaN

    oldValue = NaN
    newValue = NaN

    changeValue = NaN
    percentageChange = NaN
}

function restoreStateFromUrl() {
    const params = new URLSearchParams(window.location.search)

    const restoredPart = params.get('p')
    const restoredWhole = params.get('w')
    const restoredPercent = params.get('pc')
    const restoredOldValue = params.get('o')
    const restoredNewValue = params.get('n')

    if (restoredPart !== null) {
        part = parseNumericValue(restoredPart)
    }
    if (restoredWhole !== null) {
        whole = parseNumericValue(restoredWhole)
    }
    if (restoredPercent !== null) {
        percent = parseNumericValue(restoredPercent)
    }
    if (restoredOldValue !== null) {
        oldValue = parseNumericValue(restoredOldValue)
    }
    if (restoredNewValue !== null) {
        newValue = parseNumericValue(restoredNewValue)
    }
}

function updateUrlFromState() {
    const url = new URL(window.location.href)
    const params = url.searchParams

    if (Number.isFinite(part)) {
        params.set('p', String(part))
    } else {
        params.delete('p')
    }

    if (Number.isFinite(whole)) {
        params.set('w', String(whole))
    } else {
        params.delete('w')
    }

    if (Number.isFinite(percent)) {
        params.set('pc', String(percent))
    } else {
        params.delete('pc')
    }

    if (Number.isFinite(oldValue)) {
        params.set('o', String(oldValue))
    } else {
        params.delete('o')
    }

    if (Number.isFinite(newValue)) {
        params.set('n', String(newValue))
    } else {
        params.delete('n')
    }

    url.search = params.toString() ? `?${params.toString()}` : ''
    window.history.replaceState({}, '', url.toString())
}

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

function toIntOrFixed(value) {
    if (!Number.isFinite(value)) {
        return '???'
    }
    return value % 1 === 0 ? value.toFixed(0).toLocaleString() : value.toFixed(decimalPlaces).toLocaleString()
}

function renderResults() {
    document.querySelectorAll('.partResult').forEach(span => {
        span.textContent = toIntOrFixed(part)
    })
    document.querySelectorAll('.percentResult').forEach(span => {
        span.textContent = toIntOrFixed(percent) + "%"
    })
    document.querySelectorAll('.wholeResult').forEach(span => {
        span.textContent = toIntOrFixed(whole)
    })
    document.querySelectorAll('.percentageChangeResult').forEach(span => {
        span.textContent = toIntOrFixed(percentageChange) + "%"
    })

    const blankFractionPlaceholder = '???'

    document.querySelector('.numeratorPart').textContent = toIntOrFixed(part)
    document.querySelector('.denominatorWhole').textContent = toIntOrFixed(whole)
    document.querySelector('.numeratorPercent').textContent = toIntOrFixed(percent)

    document.querySelector('.numeratorChange').textContent = toIntOrFixed(newValue) + " - " + toIntOrFixed(oldValue)

    document.querySelector('.denominatorOld').textContent = "|" + toIntOrFixed(oldValue) + "|"

    document.querySelector('.numeratorPercentChange').textContent = toIntOrFixed(percentageChange)
}

function calculateFrom(row) {
    if (row === 0 || row === -1) {
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
    }
    if (row === 3 || row === -1) {
        if (Number.isFinite(oldValue) && Number.isFinite(newValue) && oldValue !== 0) {
            changeValue = newValue - oldValue
            percentageChange = 100 * changeValue / Math.abs(oldValue)
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

    const oldValueSkipInput = editedRow === 3 ? oldValueInput : null
    const newValueSkipInput = editedRow === 3 ? newValueInput : null

    syncInputGroup(partInputs, part, partSkipInput)
    syncInputGroup(wholeInputs, whole, wholeSkipInput)
    syncInputGroup(percentInputs, percent, percentSkipInput)

    syncInputGroup([oldValueInput], oldValue, oldValueSkipInput)
    syncInputGroup([newValueInput], newValue, newValueSkipInput)

    calculateFrom(editedRow !== null ? editedRow : -1) //-1 is all rows

    renderResults()
    updateUrlFromState()

    document.querySelectorAll('input[type="text"]').forEach((input) => resizeInput(input))
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
    document.querySelectorAll('input[type="text"]').forEach((input) => {
        resizeInput(input)
        input.addEventListener('input', () => resizeInput(input))
        input.addEventListener('focus', () => {
            input.select()
        })
    })
}

restoreStateFromUrl()
updateAll()

setupInputSizing()

toggleFormulaVisibility()

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

decimalPlacesInput.addEventListener('input', (event) => {
    decimalPlaces = Number.isFinite(parseNumericValue(decimalPlacesInput.value))
        ? parseNumericValue(decimalPlacesInput.value)
        : 2

    updateAll()
})

showFormulasCheckbox.addEventListener('change', toggleFormulaVisibility)

resetButton.addEventListener('click', () => {
    resetCalculator()
    updateAll()
})
