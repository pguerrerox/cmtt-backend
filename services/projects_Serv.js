export const insertProjects = (db, data) => { // insert all projects (no repeating existent) on the database from the excel operations schedule
    const stmt = db.prepare(`INSERT OR IGNORE INTO projects (
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

    let newlyInserted = 0
    const batchInsert = db.transaction((projects) => {
        for (const elem of projects) {
            const result = stmt.run(
                elem.project_number,
                elem.project_description,
                elem.customer_name,
                elem.project_manager,
                elem.kickoff_date_planned,
                elem.kickoff_date_act,
                elem.mih_date_planned,
                elem.mih_date_act,
                elem.inspection_date_planned,
                elem.inspection_date_act,
                elem.process_planning_date_planned,
                elem.process_planning_date_act,
                elem.milton_date_planned,
                elem.pih_date_planned,
                elem.pih_date_act,
                elem.mfg_date_planned,
                elem.mfg_date_act,
                elem.rih_date_planned,
                elem.rih_date_act,
                elem.hr_assy_date_planned,
                elem.assy_date_planned,
                elem.assy_date_act,
                elem.test_date_planned,
                elem.test_date_act,
                elem.pp_recut_date_planned,
                elem.pp_recut_date_act,
                elem.recut_mfg_date_planned,
                elem.post_recut_test_date_planned,
                elem.dev_test_date_planned,
                elem.machine_comt_date_planned,
                elem.system_test_planned,
                elem.system_test_act,
                elem.ops_complete_date_planned,
                elem.ship_date_planned,
                elem.ship_date_act,
                elem.status_notes
            )
            newlyInserted += result.changes
        }
    })
    batchInsert(data)
    console.log(`Projects inserted/updated: ${newlyInserted}`);
    return newlyInserted
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
