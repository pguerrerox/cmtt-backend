# TODO

## P0
- [ ] Implement service to complete 'operations planned dates' to the database for a newly created projects.
  When a project is created by a manager this backend will lookup the project number in the pre-processed operations data.
  If the project is not yet in the operations data, the server will add the project number to a queue.

- [ ] Implement service to have a queue of jobs that need to be lookup based on a scheduled job from the 'operations planned dates'.

## P1
- [ ] Implement service to read a 'PDF' file and extract information about a project.
  After creating a project the manager has the option to upload on the frontend an order report, the backend will read the file and extract the programmed information. 

## P2
- [ ] Add Repo unit tests (projects/managers)
- [ ] Add Routes unit tests (admin/managers/projects)

## Done
- [x] Review the helpers / services that process the excel file with the operations planned data.


## Ideas
- Auth implementation?
- Storage for files?
- Pre-process data from projects?