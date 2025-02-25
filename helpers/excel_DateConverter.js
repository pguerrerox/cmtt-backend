export default function (excelDate) {
    if (excelDate === 'NULL') {
        return null
    } else {
        // Excel dates start from 30 Dec 1899
        const startDate = new Date(1899, 11, 30);

        // Adjust the excelDate
        const jsDate = new Date(startDate.getTime() + (excelDate) * 24 * 60 * 60 * 1000);

        const day = String(jsDate.getDate()).padStart(2, '0');
        const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = jsDate.getFullYear();

        return `${month}/${day}/${year}`; // Return date in MM/DD/YYYY format
    }
}