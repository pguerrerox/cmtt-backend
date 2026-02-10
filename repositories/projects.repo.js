/**
 * PROJECTS DATABASE SERVICES
 * 
 * Handles all CRUD operations for the 'projects' table.
 * Dependencies: better-sqlite3
 * 
 * Methods:
 * - createProject: 
 * - get all projects
 * - get project by project number
 * - get projects by project manager
*/

// methods needed here
// - modify existing project
// - delete a project by project number

export const createProject = (db, data) => {
    const stmt = db.prepare(`INSERT OR IGNORE INTO projects (
        project_number, project_description, customer_name, manager_id,
        kickoff_date_planned, kickoff_date_act, mih_date_planned, mih_date_act,
        inspection_date_planned, inspection_date_act, process_planning_date_planned,
        process_planning_date_act, milton_date_planned, pih_date_planned,
        pih_date_act, mfg_date_planned, mfg_date_act, rih_date_planned,
        rih_date_act, hr_assy_date_planned, assy_date_planned, assy_date_act,
        test_date_planned, test_date_act, pp_recut_date_planned, pp_recut_date_act,
        recut_mfg_date_planned, post_recut_test_date_planned, dev_test_date_planned,
        machine_comt_date_planned, system_test_planned, system_test_act,
        ops_complete_date_planned, ship_date_planned, ship_date_act, status_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    const info = stmt.run (
        data.project_number,
        data.project_description,
        data.customer_name,
        data.manager_id,
        data.kickoff_date_planned,
        data.kickoff_date_act,
        data.mih_date_planned,
        data.mih_date_act,
        data.inspection_date_planned,
        data.inspection_date_act,
        data.process_planning_date_planned,
        data.process_planning_date_act,
        data.milton_date_planned,
        data.pih_date_planned,
        data.pih_date_act,
        data.mfg_date_planned,
        data.mfg_date_act,
        data.rih_date_planned,
        data.rih_date_act,
        data.hr_assy_date_planned,
        data.assy_date_planned,
        data.assy_date_act,
        data.test_date_planned,
        data.test_date_act,
        data.pp_recut_date_planned,
        data.pp_recut_date_act,
        data.recut_mfg_date_planned,
        data.post_recut_test_date_planned,
        data.dev_test_date_planned,
        data.machine_comt_date_planned,
        data.system_test_planned,
        data.system_test_act,
        data.ops_complete_date_planned,
        data.ship_date_planned,
        data.ship_date_act,
        data.status_notes
    )
    return info.changes > 0 ? 'OP: completed' : 'Error: Project already exist';
}

export const getAllProjects = (db) => { // return all projects on the database
    return db.prepare(`SELECT * FROM projects;`).all()
}

export const getProjectByProjectNumber = (db, project_number) => { // return one project for a given a project number - 6 digit number
    return db.prepare(`SELECT * FROM projects WHERE project_number = ?;`).get(project_number)
}

export const getProjectsByProjectManager = (db, project_manager) => { // return all projects for a given project manager name - only letters
    return db.prepare(`SELECT * FROM projects WHERE project_manager = ?`).all(project_manager)
}
