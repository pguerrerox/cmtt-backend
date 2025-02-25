import path from 'path'
import { fileURLToPath } from 'url'
import headers from './excel_HeaderRow.js'
import range from './excel_Range.js'
import cleanedData from './excel_CleanedData.js'


// XLSX library chenanigans
import xlsx from 'xlsx';
const { readFile } = xlsx

// Function to convert Excel to SQLite
export default () => {
    // ADD ERROR HANDLING FOR DIFFERENT STAGES

    // Path to excel file
    const excelPath = path.join(fileURLToPath(import.meta.url), '../../externaldata/testData.xls')

    // Read the Excel file
    const workbook = readFile(excelPath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // build the propper range
    const defaultRange = worksheet['!ref'];
    let workingRange = range(defaultRange, 'B', '3')

    // Convert the sheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet, {
        range: workingRange,
        defval: 'NULL',
        header: headers.originalHeaders
    });

    return cleanedData(data)
    // RETURN: IF NO ERROR WERE THROWN, RETURN THE RESULT OF FUNCTION
};