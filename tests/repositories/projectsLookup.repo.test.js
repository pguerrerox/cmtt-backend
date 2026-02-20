import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from '../helpers/test-db.js'
import {
    enqueueProject,
    getProjectByNumber,
    getAllQueue
} from '../../repositories/projectsLookup.repo.js'

test('enqueueProject inserts a pending queue record', () => {
    const db = createTestDb()

    const result = enqueueProject(db, 'P-6000')
    assert.equal(result.ok, true)

    const fetched = getProjectByNumber(db, 'P-6000')
    assert.equal(fetched.ok, true)
    assert.equal(fetched.data.status, 'pending')
    assert.equal(fetched.data.attempts, 0)
    assert.equal(typeof fetched.data.created_at, 'number')
    assert.equal(typeof fetched.data.updated_at, 'number')
})

test('enqueueProject is idempotent by project_number', () => {
    const db = createTestDb()

    enqueueProject(db, 'P-6001')
    enqueueProject(db, 'P-6001', { status: 'failed' })

    const rows = getAllQueue(db)
    assert.equal(rows.ok, true)
    assert.equal(rows.data.length, 1)
    assert.equal(rows.data[0].status, 'failed')
})

test('enqueueProject normalizes next/last attempt dates to integers', () => {
    const db = createTestDb()

    const result = enqueueProject(db, 'P-6002', {
        last_attempt_date: '1700000000000',
        next_attempt_date: 1700003600000
    })
    assert.equal(result.ok, true)

    const fetched = getProjectByNumber(db, 'P-6002')
    assert.equal(fetched.ok, true)
    assert.equal(fetched.data.last_attempt_date, 1700000000000)
    assert.equal(fetched.data.next_attempt_date, 1700003600000)
})

test('getProjectByNumber returns not found when absent', () => {
    const db = createTestDb()
    const missing = getProjectByNumber(db, 'none')
    assert.equal(missing.ok, false)
    assert.equal(missing.error, 'project not found in queue')
})
