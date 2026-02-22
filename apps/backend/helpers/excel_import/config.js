/**
 * Excel import configuration.
 *
 * `originalHeaders` maps raw worksheet columns to expected object keys.
 * `finalHeaders` provides the normalized output shape used during transform.
 *
 * @type {{ originalHeaders: string[], finalHeaders: Record<string, null> }}
 */
export default {
    originalHeaders: ["project_number", "customer_name", "project_manager", "kickoff_date_planned", "mih_date_planned", "var_1", "inspection_date_planned", "var_2", "process_planning_date_planned", "var_3", "milton_date_planned", "var_4", "pih_date_planned", "var_5", "mfg_date_planned", "var_6", "rih_date_planned", "var_7", "hr_assy_date_planned", "var_8", "assy_date_planned", "var_9", "test_date_planned", "var_10", "pp_recut_date_planned", "var_11", "recut_mfg_date_planned", "var_12", "post_recut_test_date_planned", "var_13", "dev_test_date_planned", "var_14", "machine_comt_date_planned", "var_15", "system_test_planned", "var_16", "ops_complete_date_planned", "var_17", "ship_date_planned", "var_18", "status_notes"],
    finalHeaders: {
        project_number: null,                   //row 1
        project_description: null,              //row 2 - customer name
        customer_name: null,                    //row 1
        project_manager: null,                  //row 1
    
        kickoff_date_planned: null,             //row 1
        kickoff_date_act: null,                 //row 2 - 
    
        mih_date_planned: null,                 //row 1
        mih_date_act: null,                     //row 2    
    
        inspection_date_planned: null,          //row 1
        inspection_date_act: null,              //row 2
    
        process_planning_date_planned: null,    //row 1
        process_planning_date_act: null,        //row 2
    
        milton_date_planned: null,                  //row 1
    
        pih_date_planned: null,                 //row 1
        pih_date_act: null,                     //row 2
    
        mfg_date_planned: null,                 //row 1
        mfg_date_act: null,                     //row 2
    
        rih_date_planned: null,                 //row 1
        rih_date_act: null,                     //row 2
    
        hr_assy_date_planned: null,             //row 1 
    
        assy_date_planned: null,                //row 1
        assy_date_act: null,                    //row 2
    
        test_date_planned: null,                //row 1
        test_date_act: null,                    //row 2
    
        pp_recut_date_planned: null,            //row 1
        pp_recut_date_act: null,                //row 2
    
        recut_mfg_date_planned: null,           //row 1
    
        post_recut_test_date_planned: null,     //row 1
    
        dev_test_date_planned: null,            //row 1
    
        machine_comt_date_planned: null,        //row 1
    
        system_test_planned: null,              //row 1
        system_test_act: null,                  //row  2
    
        ops_complete_date_planned: null,        //row 1
    
        ship_date_planned: null,                //row 1
        ship_date_act: null,                    //row 2
    
        status_notes: null                      //row 1
    }
}
