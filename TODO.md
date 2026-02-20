# TODO

## P0
When a project is created by a manager the backend needs to lookup the project number in the pre-processed `operations data`, if the project is found the data will be added to the project, and if the project is not found in the `operations data` the server will add the project number to a queue.

The queue will be a different table. There will be a scheduled job to lookup the projects in the queue agains the `operations data`, if the data is there the projects comes out of the queue and the data gets updated to the respective project, if the project is still not found it stays in the queue.

- [ ] Implement a Database table for `operations planned dates`.
  - Create `operations.schema.js`.
    Must have `project_number as unique`, and will store the information related to the operations plan. Include control fields like `source_version`, `refreshed_at`.

  - Create `operations.repo.js`.
    Need at least the following methods: `upsert` and `getOperationsPlanByProjectNumber`.

- [ ] Implement the Database table for `lookup_queue`.
  - Create `projectsLookup.schema.js`
    Must have `project_number as unique`, and will store the project numbers and status of created projects that are not in the operations plan. Fields required, `status`, `attempts`, `last_attempt_date`, `next_attempt_date`.
    
  - Create `projectsLookup.repo.js`
    Need at least the following methods: `enqueueProject`, `getProjectByNumber`, and `getAllQueue`.

## P1
- [ ] Wire up the `createProject` method to lookup the `operations data` or `enqueueProject`  

## P2
- [ ] Create scheduler/worker for the recurrent tasks.

## P3
- [ ] Implement service to read a `PDF` file and extract information about a project.
  After creating a project the manager has the option to upload on the frontend an order report, the backend will read the file and extract the programmed information. 

## P4
- [ ] Add Repo unit tests (projects/managers)
- [ ] Add Routes unit tests (admin/managers/projects)

## Done
- [x] Review the helpers / services that process the excel file with the operations planned data.


## Ideas
- Auth implementation?
- Storage for files?
- Pre-process data from projects?