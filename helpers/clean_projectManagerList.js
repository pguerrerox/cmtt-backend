function cleanManagerList(managers) {
    
    console.log(managers);
    
    // remove duplicates
    let uglyProjectManagers = []
    let cleanProjectManagers = []

    managers.forEach(e => {
        if (!uglyProjectManagers.includes(e.project_manager)) {
            uglyProjectManagers.push(e.project_manager)
        }
    });

    uglyProjectManagers.forEach(e => {
        let newStr = e.trim()
        cleanProjectManagers.push(newStr)
    })

    // create object with project manager status
    // active: true || false
    let projectManagers = []

    cleanProjectManagers.forEach(e => {
        if (actives.includes(e)){
            projectManagers.push({"name": `${e}`, "active": true})
        }
        else {
            projectManagers.push({"name": `${e}`, "active": false})
        } 
    });

    return cleanProjectManagers
}

export default cleanManagerList
