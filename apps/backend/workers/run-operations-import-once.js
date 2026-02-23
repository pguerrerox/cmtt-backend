import db from '../db/db.js'
import { runOperationsImportWorker } from './operationsImport.worker.js'

const result = runOperationsImportWorker(db)

if (!result.ok) {
  console.error(JSON.stringify({
    message: 'operations import worker failed',
    processed: result.processed,
    imported: result.imported,
    skipped: result.skipped,
    failed: result.failed,
    errors: result.errors
  }))
  process.exitCode = 1
} else {
  console.log(JSON.stringify({
    message: 'operations import worker completed',
    processed: result.processed,
    imported: result.imported,
    skipped: result.skipped,
    failed: result.failed
  }))
}
