import headers from './data_headers.js';
import cleanedData from './data_cleaned.js';
import processedRange from './data_range.js';
import insertProjectsToDatabase from './data_insertToDatabase.js'; 

// XLSX library chenanigans
import xlsx from 'xlsx';
const { readFile } = xlsx

// Function to convert Excel to SQLite
function ExcelToSQLite () {
    // ADD ERROR HANDLING FOR DIFFERENT STAGES

    // const hardCodedPath = "\\\\teams\\DavWWWRoot\\corporate\\GlobalCI\\sched\\PET Sales Order Summary\\Bolton Molds Operation Plan.xls"
    // devPath
    const hardCodedPath = "C:\\Users\\pguerrer\\Desktop\\testData.xls"
    
    // Read the Excel file
    const workbook = readFile(hardCodedPath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // build the propper range
    const defaultRange = worksheet['!ref'];
    let workingRange = processedRange(defaultRange, 'B', '3')

    // Convert the sheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet, {
        range: workingRange,
        defval: 'NULL',
        header: headers.originalHeaders
    });

    // fixing data in multiple rows with no header
    let newData = cleanedData(data)

    // saving the refactor data to a SQLite database
    insertProjectsToDatabase(newData)

    // RETURN: IF NO ERROR WERE THROWN, RETURN THE RESULT OF FUNCTION
};

export default ExcelToSQLite