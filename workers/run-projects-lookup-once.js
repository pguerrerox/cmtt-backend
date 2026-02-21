import db from '../db/db.js'
import { runProjectsLookupWorker } from './projectsLookup.worker.js'

const result = runProjectsLookupWorker(db)

if (!result.ok) {
    console.error(JSON.stringify({
        message: 'projects lookup worker failed',
        errors: result.errors
    }))
    process.exitCode = 1
} else {
    console.log(JSON.stringify({
        message: 'projects lookup worker completed',
        processed: result.processed,
        enriched: result.enriched,
        retried: result.retried,
        failed: result.failed,
        removed: result.removed
    }))
}
