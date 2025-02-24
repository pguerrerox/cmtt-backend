import db from "../database/schemas/projectsSchema.js"

const insertProjects = db.prepare(`
    INSERT INTO projects (
        project_number, project_description, customer_name, project_manager,
        kickoff_date_planned, kickoff_date_act, mih_date_planned, mih_date_act,
        inspection_date_planned, inspection_date_act, process_planning_date_planned,
        process_planning_date_act, milton_date_planned, pih_date_planned,
        pih_date_act, mfg_date_planned, mfg_date_act, rih_date_planned,
        rih_date_act, hr_assy_date_planned, assy_date_planned, assy_date_act,
        test_date_planned, test_date_act, pp_recut_date_planned, pp_recut_date_act,
        recut_mfg_date_planned, post_recut_test_date_planned, dev_test_date_planned,
        machine_comt_date_planned, system_test_planned, system_test_act,
        ops_complete_date_planned, ship_date_planned, ship_date_act, status_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const getAllProjects = db.prepare(`
    SELECT * FROM projects;
`)

const getAllProjectManagers = db.prepare(`
    SELECT * FROM projects;
`)


// EXPORTS
export {
    insertProjects,
    getAllProjects,
    getAllProjectManagers
}