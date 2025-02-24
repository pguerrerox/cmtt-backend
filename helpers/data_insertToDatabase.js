import { insertProjects } from "../database/drivers/projectQueries.js";
import excelDateToJSDate from "./convertExcelDatetoJSDate.js";

function insertProjectsToDatabase (data) {
    // TYPE CHECK: parameters must be an array of objects
    // TYPE ERROR HANDLING

    // Insert each project into the table
    let newInsertCount = 0
    let notInsertedCount = 0 

    try {
        data.forEach ( item => {
            newInsertCount += insertProjects.run (
                item.project_number,
                item.project_description,
                item.customer_name,
                item.project_manager,
                excelDateToJSDate(item.kickoff_date_planned),
                excelDateToJSDate(item.kickoff_date_act),
                excelDateToJSDate(item.mih_date_planned),
                excelDateToJSDate(item.mih_date_act),
                excelDateToJSDate(item.inspection_date_planned),
                excelDateToJSDate(item.inspection_date_act),
                excelDateToJSDate(item.process_planning_date_planned),
                excelDateToJSDate(item.process_planning_date_act),
                excelDateToJSDate(item.milton_date_planned),
                excelDateToJSDate(item.pih_date_planned),
                excelDateToJSDate(item.pih_date_act),
                excelDateToJSDate(item.mfg_date_planned),
                excelDateToJSDate(item.mfg_date_act),
                excelDateToJSDate(item.rih_date_planned),
                excelDateToJSDate(item.rih_date_act),
                excelDateToJSDate(item.hr_assy_date_planned),
                excelDateToJSDate(item.assy_date_planned),
                excelDateToJSDate(item.assy_date_act),
                excelDateToJSDate(item.test_date_planned),
                excelDateToJSDate(item.test_date_act),
                excelDateToJSDate(item.pp_recut_date_planned),
                excelDateToJSDate(item.pp_recut_date_act),
                excelDateToJSDate(item.recut_mfg_date_planned),
                excelDateToJSDate(item.post_recut_test_date_planned),
                excelDateToJSDate(item.dev_test_date_planned),
                excelDateToJSDate(item.machine_comt_date_planned),
                excelDateToJSDate(item.system_test_planned),
                excelDateToJSDate(item.system_test_act),
                excelDateToJSDate(item.ops_complete_date_planned),
                excelDateToJSDate(item.ship_date_planned),
                excelDateToJSDate(item.ship_date_act),
                item.status_notes
            ).changes;
        });
    } 
    catch (error) {
        console.error(`An error occurred - Error code: ${error.code}`)
    }
    finally {
        notInsertedCount = data.length - newInsertCount
        console.log(`-> Processed projects: ${ data.length }`);
        console.log(`-> Newly saved projects: ${ newInsertCount }`)
        console.log(`-> Duplicated not saved projects: ${ notInsertedCount }`)
    }
};

export default insertProjectsToDatabase