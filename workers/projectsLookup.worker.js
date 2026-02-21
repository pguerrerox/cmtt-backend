import operationsFields from '../helpers/_OPERATIONS_FIELDS.js'
import { getOperationsPlanByProjectNumber } from '../repositories/operations.repo.js'
import {
    getDueQueueItems,
    removeFromQueue,
    updateQueueEntry
} from '../repositories/projectsLookup.repo.js'

const defaultOptions = {
    batchSize: Number.parseInt(process.env.LOOKUP_BATCH_SIZE ?? '50', 10),
    retryDelayMs: Number.parseInt(process.env.LOOKUP_RETRY_DELAY_MS ?? '3600000', 10),
    maxAttempts: Number.parseInt(process.env.LOOKUP_MAX_ATTEMPTS ?? '8', 10)
}

const toPositiveInteger = (value, fallback) => {
    if (Number.isInteger(value) && value > 0) return value
    return fallback
}

const normalizeOptions = (options = {}) => ({
    batchSize: toPositiveInteger(options.batchSize, toPositiveInteger(defaultOptions.batchSize, 50)),
    retryDelayMs: toPositiveInteger(options.retryDelayMs, toPositiveInteger(defaultOptions.retryDelayMs, 3600000)),
    maxAttempts: toPositiveInteger(options.maxAttempts, toPositiveInteger(defaultOptions.maxAttempts, 8)),
    now: typeof options.now === 'number' && Number.isFinite(options.now)
        ? Math.trunc(options.now)
        : Date.now()
})

const enrichProjectFromOperations = (db, projectNumber, operationsData) => {
    const payload = operationsFields.reduce((acc, field) => {
        acc[field] = operationsData[field] ?? null
        return acc
    }, { project_number: projectNumber })

    const sql = `
        UPDATE projects
        SET ${operationsFields.map((field) => `${field} = :${field}`).join(', ')}
        WHERE project_number = :project_number
    `

    const info = db.prepare(sql).run(payload)
    return info.changes > 0
}

export const runProjectsLookupWorker = (db, options = {}) => {
    const config = normalizeOptions(options)

    const stats = {
        ok: true,
        processed: 0,
        enriched: 0,
        retried: 0,
        failed: 0,
        removed: 0,
        errors: []
    }

    const dueItems = getDueQueueItems(db, config.now, config.batchSize)
    if (!dueItems.ok) {
        return {
            ...stats,
            ok: false,
            errors: [dueItems.error]
        }
    }

    const runInTx = db.transaction((rows) => {
        for (const row of rows) {
            stats.processed += 1
            const projectNumber = row.project_number
            const operationsResult = getOperationsPlanByProjectNumber(db, projectNumber)

            if (!operationsResult.ok && operationsResult.error !== 'operations plan not found') {
                throw new Error(operationsResult.error)
            }

            if (operationsResult.ok) {
                const updated = enrichProjectFromOperations(db, projectNumber, operationsResult.data)
                if (!updated) {
                    const queueResult = updateQueueEntry(db, projectNumber, { status: 'failed' })
                    if (!queueResult.ok) throw new Error(queueResult.error)
                    stats.failed += 1
                    continue
                }

                const dequeueResult = removeFromQueue(db, projectNumber)
                if (!dequeueResult.ok) throw new Error(dequeueResult.error)
                stats.enriched += 1
                stats.removed += 1
                continue
            }

            const nextAttempts = row.attempts + 1
            const shouldFail = nextAttempts >= config.maxAttempts

            const retryUpdateResult = updateQueueEntry(db, projectNumber, {
                attempts: nextAttempts,
                last_attempt_date: config.now,
                next_attempt_date: shouldFail ? null : config.now + config.retryDelayMs,
                status: shouldFail ? 'failed' : 'pending'
            })

            if (!retryUpdateResult.ok) throw new Error(retryUpdateResult.error)

            if (shouldFail) {
                stats.failed += 1
            } else {
                stats.retried += 1
            }
        }
    })

    try {
        runInTx(dueItems.data)
        return stats
    }
    catch (err) {
        return {
            ...stats,
            ok: false,
            errors: [err.message]
        }
    }
}
