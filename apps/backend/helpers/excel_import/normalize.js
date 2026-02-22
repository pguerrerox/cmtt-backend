/**
 * Excel normalization helpers.
 */

/**
 * Converts an Excel serial value or supported date string to `MM/DD/YYYY`.
 *
 * Returns `null` for empty, `NULL`, or invalid values.
 *
 * @param {unknown} excelDate - Raw worksheet value.
 * @returns {string|null} Normalized date string or `null`.
 */
function dateConverter (excelDate) {
    if (excelDate === null || excelDate === undefined || excelDate === '' || excelDate === 'NULL') {
        return null
    }

    // Normalize string values first.
    if (typeof excelDate === 'string') {
        const value = excelDate.trim()
        if (!value || value.toUpperCase() === 'NULL') return null

        // Handle common workbook string dates like "10/22/24" or "10/22/2024".
        const slashDate = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/)
        if (slashDate) {
            const month = Number(slashDate[1])
            const day = Number(slashDate[2])
            const yearPart = slashDate[3]
            const year = yearPart.length === 2 ? 2000 + Number(yearPart) : Number(yearPart)
            return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`
        }

        // Numeric strings should be treated as Excel serials.
        if (!Number.isNaN(Number(value))) {
            excelDate = Number(value)
        } else {
            // Unknown non-numeric/non-date strings become null instead of invalid dates.
            return null
        }
    }

    if (typeof excelDate !== 'number' || Number.isNaN(excelDate)) {
        return null
    }

    // Excel dates start from 30 Dec 1899.
    const startDate = new Date(1899, 11, 30)
    const jsDate = new Date(startDate.getTime() + excelDate * 24 * 60 * 60 * 1000)

    if (Number.isNaN(jsDate.getTime())) {
        return null
    }

    const day = String(jsDate.getDate()).padStart(2, '0')
    const month = String(jsDate.getMonth() + 1).padStart(2, '0')
    const year = jsDate.getFullYear()

    return `${month}/${day}/${year}`
}

export {
    dateConverter
}
