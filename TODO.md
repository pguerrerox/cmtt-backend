# TODO

## P0
- [ ] Implement service to read a `PDF` file and extract information about a project.
  After creating a project the manager has the option to upload on the frontend an order report, the backend will read the file and extract the programmed information. 

## P1
- [ ]  

## P2
- [ ] 


## Ideas
- Auth implementation?
- Storage for files?
- Pre-process data from projects?


## Improvement Points by Senior Programmer (Ai)
- [ ] Define MVP auth scope explicitly (defer or implement minimal auth guardrails).
- [ ] Add CORS middleware configuration for frontend origins (local + staging).
- [ ] Configure scheduled execution for `npm run worker:projects-lookup` in target runtime.
- [ ] Add basic worker observability (run logs + stale queue alert/check).