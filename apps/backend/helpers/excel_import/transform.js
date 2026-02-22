import headers from './config.js'
import { dateConverter } from './normalize.js'

/**
 * Excel row transformation helpers.
 */

/**
 * Transforms 3-row grouped worksheet data into normalized project records.
 *
 * Row group behavior:
 * - row 1: planned values and metadata
 * - row 2: actual values and project description
 * - row 3: ignored by current implementation
 *
 * @param {Array<Record<string, unknown>>} data - Raw worksheet rows.
 * @returns {Array<Record<string, unknown>>} Normalized records.
 */
export default function transformExcelRows(data) {
  // TYPE CHECK - parameter must be array of objects as below (see ref.data)
  // TYPE ERROR HANDLING

  const newDataArray = [];

  data.forEach((row, index) => {
    const refactoredRow = { ...headers.finalHeaders };

    if (index % 3 == 0) {
      // let row1 = index
      let row2 = data[index + 1]
      let row3 = data[index + 2] // not used

      // NEW ROW - REFECTOR/REORDER HEADERS - brute force
      // FRON ROW 1
      refactoredRow.project_number = row.project_number
      refactoredRow.customer_name = row.customer_name.trim()
      refactoredRow.project_manager = row.project_manager.trim()
      refactoredRow.kickoff_date_planned = dateConverter(row.kickoff_date_planned)
      refactoredRow.mih_date_planned = dateConverter(row.mih_date_planned)
      refactoredRow.inspection_date_planned = dateConverter(row.inspection_date_planned)
      refactoredRow.process_planning_date_planned = dateConverter(row.process_planning_date_planned)
      refactoredRow.milton_date_planned = dateConverter(row.milton_date_planned)
      refactoredRow.pih_date_planned = dateConverter(row.pih_date_planned)
      refactoredRow.mfg_date_planned = dateConverter(row.mfg_date_planned)
      refactoredRow.rih_date_planned = dateConverter(row.rih_date_planned)
      refactoredRow.hr_assy_date_planned = dateConverter(row.hr_assy_date_planned)
      refactoredRow.assy_date_planned = dateConverter(row.assy_date_planned)
      refactoredRow.test_date_planned = dateConverter(row.test_date_planned)
      refactoredRow.pp_recut_date_planned = dateConverter(row.pp_recut_date_planned)
      refactoredRow.recut_mfg_date_planned = dateConverter(row.recut_mfg_date_planned)
      refactoredRow.post_recut_test_date_planned = dateConverter(row.post_recut_test_date_planned)
      refactoredRow.dev_test_date_planned = dateConverter(row.dev_test_date_planned)
      refactoredRow.machine_comt_date_planned = dateConverter(row.machine_comt_date_planned)
      refactoredRow.system_test_planned = dateConverter(row.system_test_planned)
      refactoredRow.ops_complete_date_planned = dateConverter(row.ops_complete_date_planned)
      refactoredRow.ship_date_planned = dateConverter(row.ship_date_planned)
      refactoredRow.status_notes = row.status_notes.trim()

      // FROM ROW 2
      refactoredRow.project_description = row2.customer_name.trim()
      refactoredRow.kickoff_date_act = dateConverter(row2.kickoff_date_planned)
      refactoredRow.mih_date_act = dateConverter(row2.mih_date_planned)
      refactoredRow.inspection_date_act = dateConverter(row2.inspection_date_planned)
      refactoredRow.process_planning_date_act = dateConverter(row2.process_planning_date_planned)
      refactoredRow.pih_date_act = dateConverter(row2.pih_date_planned)
      refactoredRow.mfg_date_act = dateConverter(row2.mfg_date_planned)
      refactoredRow.rih_date_act = dateConverter(row2.rih_date_planned)
      refactoredRow.assy_date_act = dateConverter(row2.assy_date_planned)
      refactoredRow.test_date_act = dateConverter(row2.test_date_planned)
      refactoredRow.pp_recut_date_act = dateConverter(row2.pp_recut_date_planned)
      refactoredRow.system_test_act = dateConverter(row2.system_test_planned)
      refactoredRow.ship_date_act = dateConverter(row2.ship_date_planned)

      // populate the data array
      newDataArray.push(refactoredRow)
    }
  })
  return newDataArray
}
