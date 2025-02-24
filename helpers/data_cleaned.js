import headers from './data_headers.js'

function addNewHeader(data) {
  // TYPE CHECK - parameter must be array of objects as below (see ref.data)
  // TYPE ERROR HANDLING
  
  const newDataArray = [];
  
  data.forEach((row, index) => {
    const refactoredRow = {... headers.finalHeaders};

    if (index % 3 == 0) {
      // let row1 = index
      let row2 = data[index+1]
      let row3 = data[index+2] // not used

      // NEW ROW - REFECTOR/REORDER HEADERS - brute force
      // FRON ROW 1
      refactoredRow.project_number = row.project_number
      refactoredRow.customer_name = row.customer_name
      refactoredRow.project_manager = row.project_manager
      refactoredRow.kickoff_date_planned = row.kickoff_date_planned
      refactoredRow.mih_date_planned = row.mih_date_planned
      refactoredRow.inspection_date_planned = row.inspection_date_planned
      refactoredRow.process_planning_date_planned = row.process_planning_date_planned
      refactoredRow.milton_date_planned = row.milton_date_planned
      refactoredRow.pih_date_planned = row.pih_date_planned
      refactoredRow.mfg_date_planned = row.mfg_date_planned
      refactoredRow.rih_date_planned = row.rih_date_planned
      refactoredRow.hr_assy_date_planned = row.hr_assy_date_planned
      refactoredRow.assy_date_planned = row.assy_date_planned
      refactoredRow.test_date_planned = row.test_date_planned
      refactoredRow.pp_recut_date_planned = row.pp_recut_date_planned
      refactoredRow.recut_mfg_date_planned = row.recut_mfg_date_planned
      refactoredRow.post_recut_test_date_planned = row.post_recut_test_date_planned
      refactoredRow.dev_test_date_planned = row.dev_test_date_planned
      refactoredRow.machine_comt_date_planned = row.machine_comt_date_planned
      refactoredRow.system_test_planned = row.system_test_planned
      refactoredRow.ops_complete_date_planned = row.ops_complete_date_planned
      refactoredRow.ship_date_planned = row.ship_date_planned
      refactoredRow.status_notes = row.status_notes

      // FROM ROW 2
      refactoredRow.project_description = row2.customer_name
      refactoredRow.kickoff_date_act = row2.kickoff_date_planned
      refactoredRow.mih_date_act = row2.mih_date_planned
      refactoredRow.inspection_date_act = row2.inspection_date_planned
      refactoredRow.process_planning_date_act = row2.process_planning_date_planned
      refactoredRow.pih_date_act = row2.pih_date_planned
      refactoredRow.mfg_date_act= row2.mfg_date_planned
      refactoredRow.rih_date_act = row2.rih_date_planned
      refactoredRow.assy_date_act = row2.assy_date_planned
      refactoredRow.test_date_act = row2.test_date_planned
      refactoredRow.pp_recut_date_act = row2.pp_recut_date_planned
      refactoredRow.system_test_act = row2.system_test_planned
      refactoredRow.ship_date_act = row2.ship_date_planned

      // populate the data array
      newDataArray.push(refactoredRow)
    }
  })

  return newDataArray
}

export default addNewHeader

// DIRECT TEST DATA
// let refData = [
//   {
//     project_number: '895531',
//     customer_name: 'SOUTHEASTERN CON',
//     project_manager: ' FEI       ',
//     kickoff_date_planned: 1111,
//     mih_date_planned: 2222,
//     var_1: 'data',
//     inspection_date_planned: 3333,
//     var_2: 2296,
//     process_planning_date_planned: 4444,
//     var_3: 0,
//     milton_date_planned: 5555,
//     var_4: 'nill',
//     pih_date_planned: 6666,
//     var_5: 'nill',
//     mfg_date_planned: 7777,
//     var_6: 'nill',
//     rih_date_planned: 8888,
//     var_7: 'nill',
//     hr_assy_date_planned: 9999,
//     var_8: 'nill',
//     assy_date_planned: 1010,
//     var_9: 'nill',
//     test_date_planned: 1111,
//     var_10: 'nill',
//     pp_recut_date_planned: 1212,
//     var_11: '#ERROR',
//     recut_mfg_date_planned: 1313,
//     var_12: 'nill',
//     post_recut_test_date_planned: 1414,
//     var_13: 'nill',
//     dev_test_date_planned: 1515,
//     var_14: 'nill',
//     machine_comt_date_planned: 1616,
//     var_15: 'nill',
//     system_test_planned: 1717,
//     var_16: 'nill',
//     ops_complete_date_planned: 1818,
//     var_17: 2246,
//     ship_date_planned: 1919,
//     var_18: 2245,
//     status_notes: 'ODD pitch rework at later date when we have an order\n' +
//       'MH 8649200\n' +
//       '                                                                                                                                                                                '
//   },
//   {
//     project_number: 0,
//     customer_name: '72 75x170 GPET CH EXPRT       ',
//     project_manager: 'Mold Exchange',
//     kickoff_date_planned: 1111,
//     mih_date_planned: 2222,
//     var_1: 'nill',
//     inspection_date_planned: 3333,
//     var_2: 'nill',
//     process_planning_date_planned: 4444,
//     var_3: 'nill',
//     milton_date_planned: 5555,
//     var_4: 'nill',
//     pih_date_actual: 6666,  
//     var_5: 'nill',
//     mfg_date_planned: 7777,
//     var_6: 'nill',
//     rih_date_planned: 8888,
//     var_7: 'nill',
//     hr_assy_date_planned: 9999,
//     var_8: 'nill',
//     assy_date_planned: 1010,
//     var_9: 'nill',
//     test_date_planned: 1111,
//     var_10: 'nill',
//     pp_recut_date_planned: 1212,
//     var_11: 'nill',
//     refur_mfg_date_planned: 1313,
//     var_12: 'nill',
//     post_recut_test_date_planned: 1414,
//     var_13: 'nill',
//     dev_test_date_planned: 1515,
//     var_14: 'nill',
//     machine_comt_date_planned: 1616,
//     var_15: 'nill',
//     system_test_planned: 1717,
//     var_16: 'nill',
//     ops_complete_date_planned: 1818,
//     var_17: 'nill',
//     ship_date_planned: 1919,
//     var_18: 'nill',
//     status_notes: 'nill'
//   },
//   {
//     project_number: 'RECOVERY DATES',
//     customer_name: 'nill',
//     project_manager: 'nill',
//     kickoff_date_planned: 'nill',
//     mih_date_planned: 'nill',
//     var_1: 'nill',
//     inspection_date_planned: 'nill',
//     var_2: 'nill',
//     process_planning_date_planned: 'nill',
//     var_3: 'nill',
//     milton_date_planned: 'nill',
//     var_4: 'nill',
//     pih_date_actual: 'nill',
//     var_5: 'nill',
//     mfg_date_planned: 'nill',
//     var_6: 'nill',
//     rih_date_planned: 'nill',
//     var_7: 'nill',
//     hr_assy_date_planned: 'nill',
//     var_8: 'nill',
//     assy_date_planned: 'nill',
//     var_9: 'nill',
//     test_date_planned: 'nill',
//     var_10: 'nill',
//     pp_recut_date_planned: 'nill',
//     var_11: 'nill',
//     refur_mfg_date_planned: 'nill',
//     var_12: 'nill',
//     post_recut_test_date_planned: 'nill',
//     var_13: 'nill',
//     dev_test_date_planned: 'nill',
//     var_14: 'nill',
//     machine_comt_date_planned: 'nill',
//     var_15: 'nill',
//     system_test_planned: 'nill',
//     var_16: 'nill',
//     ops_complete_date_planned: 'nill',
//     var_17: 'nill',
//     ship_date_planned: 'nill',
//     var_18: 'nill',
//     status_notes: 'Free Carrier (place of delivery)'
//   },
//   {
//     project_number: '000000',
//     customer_name: 'SOUTHEASTERN CON',
//     project_manager: ' FEI       ',
//     kickoff_date_planned: 42863,
//     mih_date_planned: 43250,
//     var_1: 'data',
//     inspection_date_planned: 43257,
//     var_2: 2296,
//     process_planning_date_planned: 43276,
//     var_3: 0,
//     milton_date_planned: 'nill',
//     var_4: 'nill',
//     pih_date_actual: 'nill',
//     var_5: 'nill',
//     mfg_date_planned: 'nill',
//     var_6: 'nill',
//     rih_date_planned: 'nill',
//     var_7: 'nill',
//     hr_assy_date_planned: 'nill',
//     var_8: 'nill',
//     assy_date_planned: 'nill',
//     var_9: 'nill',
//     test_date_planned: 'nill',
//     var_10: 'nill',
//     pp_recut_date_planned: 'nill',
//     var_11: '#ERROR',
//     refur_mfg_date_planned: 'nill',
//     var_12: 'nill',
//     post_recut_test_date_planned: 'nill',
//     var_13: 'nill',
//     dev_test_date_planned: 'nill',
//     var_14: 'nill',
//     machine_comt_date_planned: 'nill',
//     var_15: 'nill',
//     system_test_planned: 'nill',
//     var_16: 'nill',
//     ops_complete_date_planned: 43307,
//     var_17: 2246,
//     ship_date_planned: 43308,
//     var_18: 2245,
//     status_notes: 'ODD pitch rework at later date when we have an order\n' +
//       'MH 8649200\n' +
//       '                                                                                                                                                                                '
//   },
//   {
//     project_number: 0,
//     customer_name: '72 75x170 GPET CH',
//     project_manager: 'Mold Exchange',
//     kickoff_date_planned: 42863,
//     mih_date_planned: 43213,
//     var_1: 'nill',
//     inspection_date_planned: 'nill',
//     var_2: 'nill',
//     process_planning_date_planned: 43276,
//     var_3: 'nill',
//     milton_date_planned: 'nill',
//     var_4: 'nill',
//     pih_date_actual: 'nill',
//     var_5: 'nill',
//     mfg_date_planned: 'nill',
//     var_6: 'nill',
//     rih_date_planned: 'nill',
//     var_7: 'nill',
//     hr_assy_date_planned: 'nill',
//     var_8: 'nill',
//     assy_date_planned: 43545,
//     var_9: 'nill',
//     test_date_planned: 'nill',
//     var_10: 'nill',
//     pp_recut_date_planned: 'nill',
//     var_11: 'nill',
//     refur_mfg_date_planned: 'nill',
//     var_12: 'nill',
//     post_recut_test_date_planned: 'nill',
//     var_13: 'nill',
//     dev_test_date_planned: 'nill',
//     var_14: 'nill',
//     machine_comt_date_planned: 'nill',
//     var_15: 'nill',
//     system_test_planned: 'nill',
//     var_16: 'nill',
//     ops_complete_date_planned: 'nill',
//     var_17: 'nill',
//     ship_date_planned: 'nill',
//     var_18: 'nill',
//     status_notes: 'nill'
//   },
//   {
//     project_number: 'RECOVERY DATES',
//     customer_name: 'nill',
//     project_manager: 'nill',
//     kickoff_date_planned: 'nill',
//     mih_date_planned: 'nill',
//     var_1: 'nill',
//     inspection_date_planned: 'nill',
//     var_2: 'nill',
//     process_planning_date_planned: 'nill',
//     var_3: 'nill',
//     milton_date_planned: 'nill',
//     var_4: 'nill',
//     pih_date_actual: 'nill',
//     var_5: 'nill',
//     mfg_date_planned: 'nill',
//     var_6: 'nill',
//     rih_date_planned: 'nill',
//     var_7: 'nill',
//     hr_assy_date_planned: 'nill',
//     var_8: 'nill',
//     assy_date_planned: 'nill',
//     var_9: 'nill',
//     test_date_planned: 'nill',
//     var_10: 'nill',
//     pp_recut_date_planned: 'nill',
//     var_11: 'nill',
//     refur_mfg_date_planned: 'nill',
//     var_12: 'nill',
//     post_recut_test_date_planned: 'nill',
//     var_13: 'nill',
//     dev_test_date_planned: 'nill',
//     var_14: 'nill',
//     machine_comt_date_planned: 'nill',
//     var_15: 'nill',
//     system_test_planned: 'nill',
//     var_16: 'nill',
//     ops_complete_date_planned: 'nill',
//     var_17: 'nill',
//     ship_date_planned: 'nill',
//     var_18: 'nill',
//     status_notes: 'Free Carrier (place of delivery)'
//   }
// ]



// addNewHeader(refData);