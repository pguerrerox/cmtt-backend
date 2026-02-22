import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import headers from './config.js'
import cleanedData from './transform.js'

// XLSX library chenanigans
import xlsx from 'xlsx';
const { read } = xlsx

/**
 * Loads the source workbook and returns normalized project rows.
 *
 * Reads `apps/backend/_ref-external-data/testData.xls`, applies the configured
 * worksheet range and headers, then transforms grouped rows into normalized
 * objects ready for persistence.
 *
 * @throws {Error} When the source workbook file is missing.
 * @returns {Array<Record<string, unknown>>} Normalized rows.
 */
export default () => {
    const currentDir = path.dirname(fileURLToPath(import.meta.url))
    const excelPath = path.resolve(currentDir, '../../_ref-external-data/testData.xls')

    if (!fs.existsSync(excelPath)) {
        throw new Error('Excel source file not found. Expected testData.xls in _ref-external-data/.')
    }

    // Read workbook from a Buffer to avoid xlsx.readFile access issues.
    const excelBuffer = fs.readFileSync(excelPath)
    const workbook = read(excelBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // build the propper range
    const defaultRange = worksheet['!ref'];
    let workingRange = defineRange(defaultRange, 'B', '3')

    // Convert the sheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet, {
        range: workingRange,
        defval: 'NULL',
        header: headers.originalHeaders
    });
    
    return cleanedData(data)
}

/**
 * Rewrites the start of an A1 range (for example, `A1:Z99` to `B3:Z99`).
 *
 * @param {string} defaultRange - Existing A1 worksheet range.
 * @param {string} newColumn - Replacement start column (single letter).
 * @param {string} newRow - Replacement start row number.
 * @returns {string} Updated range string.
 */
function defineRange (defaultRange, newColumn, newRow) {
    // ERROR HANDLING: Basic type check for the parameters.

    // Check if the string has at least two characters
    if (defaultRange.length < 2) {
        return defaultRange; // Return the original string if it doesn't
    }

    // Convert the string to an array of characters
    const charArray = defaultRange.split('');

    // Replace the second letter (index 1)
    charArray[0] = newColumn;
    charArray[1] = newRow;

    // Join the array back into a string
    return charArray.join('');
}
