/**
 * PROJECTS DATABASE SERVICES
 * 
 * Handles all CRUD operations for the 'projects' table.
 * Dependencies: better-sqlite3
 * 
 * Methods:
 * - createProject: 
 * - modifyProject:
 * - deleteProject:
// - getAllprojects:
*/

// methods needed here
// - get project by project number
// - get projects by project manager
// - get projects by customer

export const createProject = (db, data) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return 'Error: No data provided';

    const columns = keys.join(', ');
    const placeholders = keys.map((key) => `:${key}`).join(', ');
    const sqlStatement = `INSERT OR IGNORE INTO projects (${columns}) VALUES (${placeholders})`;

    try {
        const stmt = db.prepare(sqlStatement);
        const info = stmt.run(data);
        return info.changes > 0 ? 'OP: completed' : 'Error: Project already exist';
    }
    catch (err) {
        return `Error: ${err.message}`;
    }
}

export const modifyProject = (db, data, project_number) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return 'Error: No data provided';

    const stringStatement = keys.map((key) => `${key} = :${key}`).join(', ');

    try {
        const stmt = db.prepare(`UPDATE projects SET ${stringStatement} WHERE project_number = :project_number`);
        const info = stmt.run({ ...data, project_number });
        return info.changes > 0 ? 'OP: completed' : 'Error: Project not found';
    }
    catch (err) {
        return `Error: ${err.message}`;
    }
}

export const deleteProject = (db, project_number) => {
    try {
        const stmt = db.prepare(`DELETE FROM projects WHERE project_number = ?`);
        const info = stmt.run(project_number);
        return info.changes > 0 ? 'OP: completed' : 'Error: Project not found';
    }
    catch (err) {
        return `Error: ${err.message}`;
    }
}

export const getAllProjects = (db) => {
    try {
        const sql = `
            SELECT projects.*, managers.name AS manager_name
            FROM projects 
            LEFT JOIN managers ON projects.manager_id = managers.id;
        `;

        const stmt = db.prepare(sql);
        return stmt.all();
    }
    catch (err) {
        return `Error: ${err.message}`;
    }
}

export const getProjectsByManager = (db, manager_id) => {
    try {
        const stmt = db.prepare(`SELECT * FROM projects WHERE manager_id = ?`);
        return stmt.all(manager_id);
    } catch (err) {
        return `Error: ${err.message}`;
    }
}

export const getProjectsByCustomer = (db, customer_name) => {
    try {
        const stmt = db.prepare(`SELECT * FROM projects WHERE customer_name = ?`);
        const results = stmt.all(customer_name);
        return results.length > 0 ? results : 'Error: No projects found for this customer';
    }
    catch (err) {
        return `Error: ${err.message}`;
    }
}

export const getProjectsByNumber = (db, project_number) => {
    try {
        const sql = `SELECT projects.*, managers.name AS manager_name
                     FROM projects 
                     LEFT JOIN managers ON projects.manager_id = managers.id
                     WHERE project_number = ?;`;
        const stmt = db.prepare(`
            SELECT projects.*, managers.name AS manager_name
            FROM projects WHERE project_number = ?;`);
        const results = stmt.all(project_number);
        return results.length > 0 ? results : 'Error: Project not found';
    }
    catch (err) {
        return `Error: ${err.message}`;
    }
}


// export const getProjectByProjectNumber = (db, project_number) => { // return one project for a given a project number - 6 digit number
//     return db.prepare(`SELECT * FROM projects WHERE project_number = ?;`).get(project_number)
// }
// export const getProjectsByProjectManager = (db, project_manager) => { // return all projects for a given project manager name - only letters
//     return db.prepare(`SELECT * FROM projects WHERE project_manager = ?`).all(project_manager)
// }
