# TODO

## P1
- [ ] Add search (lazy search) and sorting to the `/` page.
      - Filter by Project Number | Customer | Project Description.
      - Sort by Project Number (Asc/Des) | by Delivery Date (New/Old) 
## P2
- [ ] Projects database table additions.
      - Add column `status`: Ordered | Internal | Kicked | Packed | Shipped | Cancelled. 
      - Add column `type`: Machine | Auxiliaries | Mold | Refurb | Conversions.
## P3
- [ ] Create logic for `type`
      - This column will be calculated from the projects description nomenclature using regexp. I think this should happen in one of two places; 1. During project creation the frontend will propose a type for the user to accept. 2. During the enrichtment process in the backend the submitted value must be validated and updated if found wrong (a feedback message should be raised to the frontend). 
## P4
- [ ] Project Page required Information:
      - Status [Ordered | Internal | Kicked | Packed | Shipped | Cancelled]
      - Project Number
      - Description
      - Customer Name
      - Customer Information (Contact & Ship to Address)
      - Sales Manager (Contact Information)
      - Project Engineer (Contact Information)
      - Credit Status
      - Payment Terms
      - Delivery Terms
      - Need Freight Quote?
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

## P5
- [ ] Project Page Inteligence
      - Automatic Delay calculation
      - Visual Timeline
      - Alerts Log
      - Change Log (Audit backend / database)

## P5
- [ ] Add server information to the `/` page.
      - Last external infomation refresh.
      - Number of projects by Status.
## P3
- [ ] Backend: Implement service to read a `PDF` file and extract information about a project.
  After creating a project the manager has the option to upload on the frontend an order report, the backend will read the file and extract the programmed information. 


## Bugs to Fix
- `/admin` the create manager form is showing a "Manager created successfully" only after using the edit manager button.
 

## Ideas
- Auth implementation?
- Storage for files?
- Pre-process data from projects?
- Add project 
- Identify projects by type: Machine, Mold, Refurb, Conversions

- Customers repository.
  - Customer plant addresses.
  - Customer contacts.
  - Customer special instructions.

- Project milestones email notifications

- Sales Manager repository.
- Service Contact repository.
- Changes Audit system.


## Improvement Points by Senior Programmer (Ai)
- [ ] Add basic worker observability (run logs + stale queue alert/check).
- [ ] Server observability (run logs).



