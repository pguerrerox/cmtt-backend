# TODO

## P1
- Overhaul of the Projects table, this approach follows a project's complete life cycle with in our project management processes.
  this is a psaudo schema, need to translate to a real schema, these are all the columsn for the projects table.
    - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
    - `status`: TEXT not null, default Internal, can be any of this: Ordered, Internal, Kicked, Packed, Shipped, Cancelled
    - `project_number`: number UNIQUE NOT NULL, can only by a 6 digit number xxxxxx
    - `project_description` TEXT
    customer_name TEXT,
  - Add column `type`: Machine | Auxiliaries | Mold | Refurb | Conversions.
    manager_id INTEGER,
    kickoff_date_planned INTEGER,
    kickoff_date_act INTEGER,
    mih_date_planned INTEGER,
    mih_date_act INTEGER,
    inspection_date_planned INTEGER,
    inspection_date_act INTEGER,
    process_planning_date_planned INTEGER,
    process_planning_date_act INTEGER,
    milton_date_planned INTEGER,
    pih_date_planned INTEGER,
    pih_date_act INTEGER,
    mfg_date_planned INTEGER,
    mfg_date_act INTEGER,
    rih_date_planned INTEGER,
    rih_date_act INTEGER,
    hr_assy_date_planned INTEGER,
    assy_date_planned INTEGER,
    assy_date_act INTEGER,
    test_date_planned INTEGER,
    test_date_act INTEGER,
    pp_recut_date_planned INTEGER,
    pp_recut_date_act INTEGER,
    recut_mfg_date_planned INTEGER,
    post_recut_test_date_planned INTEGER,
    dev_test_date_planned INTEGER,
    machine_comt_date_planned INTEGER,
    system_test_planned INTEGER,
    system_test_act INTEGER,
    ops_complete_date_planned INTEGER,
    ship_date_planned INTEGER,
    ship_date_act INTEGER,
    status_notes TEXT,
    FOREIGN KEY (manager_id) REFERENCES managers(id) ON DELETE SET NULL



## P
- Create logic for `type`
  - This column will be calculated from the projects description nomenclature using regexp. I think this should happen in one of two places; 1. During project creation the frontend will propose a type for the user to accept. 2. During the enrichtment process in the backend the submitted value must be validated and updated if found wrong (a feedback message should be raised to the frontend). 
## P
- Project Page required Information:
  - General Info
    - Status [Ordered | Internal | Kicked | Packed | Shipped | Cancelled]
    - Project Number
    - Description
    - Customer Name
    - Customer Facility (Contact & Ship to Address)
  - Order Information
    - Order Number
    - Quote Number
    - Sales Manager
    - Project Engineer
    - Payment Terms
    - Delivery Terms
    - Credit Status [Deposit Pending | Shipping Hold | Cleared]
  - Action Triggers
    - Need Freight Quote?
    - Has MIH?
    - Has RIH?
    - Has CV?
    - Has Samples For Approval?
  - Links
    - Link to PSF
    - Link to SkyPERF
  - Milestones per project type
      - MOLD / COLD HALF: PIH - RIH - ASSY - TEST - CV - PACK - EXW    
      - HR: PIH - ASSY - PACK - EXW
      - REFURB: MIH - INSPECT. - PIH - ASSY - TEST? - PACK - EXW
      - COMPO. PCK / COMPA. KITS: PIH - ASSY? - PACK - EXW
      - MACHINE: PIH - MC TEST - SYST. TEST - CV - PACK - EXW
      - AUXILIARIES: PIH - TEST - PACK - EXW
    - Project Notes / Extra Information
## P
- Project Page Inteligence
      - Automatic Delay calculation
      - Visual Timeline
      - Alerts Log
      - Change Log (Audit backend / database)
## P
- Add server information to the `/` page.
      - Last external infomation refresh.
      - Number of projects by Status.
## P
- Backend: Implement service to read a `PDF` file and extract information about a project.
  After creating a project the manager has the option to upload on the frontend an order report, the backend will read the file and extract the programmed information. 


## Bugs to Fix
- `/admin` the create manager form is showing a "Manager created successfully" only after using the edit manager button.


## Ideas
- Auth implementation?
- Storage for files?
- Pre-process data from projects?
- Add project 
- Identify projects by type: Machine, Mold, Refurb, Conversions
- Project milestones teams notifications.
- Project milestones email notifications.
- Changes Audit system.
- Add basic worker observability (run logs + stale queue alert/check).
- Server observability (run logs).