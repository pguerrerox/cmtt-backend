import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from '../helpers/test-db.js'
import {
    upsert,
    getOperationsPlanByProjectNumber
} from '../../repositories/operations.repo.js'

test('upsert inserts operations planned dates for a project', () => {
    const db = createTestDb()

    const result = upsert(db, {
        project_number: 'P-5000',
        kickoff_date_planned: 1760918400000,
        ship_date_planned: 1763510400000,
        source_version: 'v1'
    })

    assert.equal(result.ok, true)

    const fetched = getOperationsPlanByProjectNumber(db, 'P-5000')
    assert.equal(fetched.ok, true)
    assert.equal(fetched.data.ship_date_planned, 1763510400000)
    assert.equal(fetched.data.source_version, 'v1')
    assert.equal(typeof fetched.data.refreshed_at, 'number')
})

test('upsert updates existing operations row by project_number', () => {
    const db = createTestDb()

    upsert(db, {
        project_number: 'P-5001',
        ship_date_planned: 1763510400000,
        source_version: 'v1'
    })
    const updated = upsert(db, {
        project_number: 'P-5001',
        ship_date_planned: 1775347200000,
        source_version: 'v2'
    })

    assert.equal(updated.ok, true)

    const fetched = getOperationsPlanByProjectNumber(db, 'P-5001')
    assert.equal(fetched.data.ship_date_planned, 1775347200000)
    assert.equal(fetched.data.source_version, 'v2')
})

test('getOperationsPlanByProjectNumber returns not found when missing', () => {
    const db = createTestDb()
    const result = getOperationsPlanByProjectNumber(db, 'missing')
    assert.equal(result.ok, false)
    assert.equal(result.error, 'operations plan not found')
})
