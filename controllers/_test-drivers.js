import  db from "../database/schemas/projectsSchema.js";
import { getAllProjects } from "./projectQueries.js"

let data = getAllProjects.all()

db.close()
console.log(data);
