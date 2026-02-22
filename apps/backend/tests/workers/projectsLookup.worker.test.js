import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from '../helpers/test-db.js'
import { createProject, getProjectsByNumber } from '../../repositories/projects.repo.js'
import { upsert as upsertOperationsPlan } from '../../repositories/operations.repo.js'
import {
    getProjectByNumber as getQueuedProjectByNumber,
    updateQueueEntry
} from '../../repositories/projectsLookup.repo.js'
import { runProjectsLookupWorker } from '../../workers/projectsLookup.worker.js'

test('worker enriches due project and removes it from queue', () => {
    const db = createTestDb()

    createProject(db, {
        project_number: 'P-9000',
        customer_name: 'ACME'
    })

    upsertOperationsPlan(db, {
        project_number: 'P-9000',
        kickoff_date_planned: 1760918400000,
        ship_date_planned: 1763510400000
    })

    const result = runProjectsLookupWorker(db, {
        now: 1760000000000,
        batchSize: 10,
        retryDelayMs: 1000,
        maxAttempts: 3
    })

    assert.equal(result.ok, true)
    assert.equal(result.processed, 1)
    assert.equal(result.enriched, 1)
    assert.equal(result.removed, 1)

    const queued = getQueuedProjectByNumber(db, 'P-9000')
    assert.equal(queued.ok, false)

    const project = getProjectsByNumber(db, 'P-9000')
    assert.equal(project.ok, true)
    assert.equal(project.data.kickoff_date_planned, 1760918400000)
    assert.equal(project.data.ship_date_planned, 1763510400000)
})

test('worker retries due project when operations are still missing', () => {
    const db = createTestDb()

    createProject(db, {
        project_number: 'P-9001',
        customer_name: 'ACME'
    })

    const result = runProjectsLookupWorker(db, {
        now: 1000,
        batchSize: 10,
        retryDelayMs: 5000,
        maxAttempts: 3
    })

    assert.equal(result.ok, true)
    assert.equal(result.processed, 1)
    assert.equal(result.retried, 1)
    assert.equal(result.failed, 0)

    const queued = getQueuedProjectByNumber(db, 'P-9001')
    assert.equal(queued.ok, true)
    assert.equal(queued.data.status, 'pending')
    assert.equal(queued.data.attempts, 1)
    assert.equal(queued.data.last_attempt_date, 1000)
    assert.equal(queued.data.next_attempt_date, 6000)
})

test('worker marks project as failed when max attempts are reached', () => {
    const db = createTestDb()

    createProject(db, {
        project_number: 'P-9002',
        customer_name: 'ACME'
    })

    updateQueueEntry(db, 'P-9002', {
        attempts: 2,
        status: 'pending',
        next_attempt_date: 900
    })

    const result = runProjectsLookupWorker(db, {
        now: 1000,
        batchSize: 10,
        retryDelayMs: 5000,
        maxAttempts: 3
    })

    assert.equal(result.ok, true)
    assert.equal(result.processed, 1)
    assert.equal(result.failed, 1)
    assert.equal(result.retried, 0)

    const queued = getQueuedProjectByNumber(db, 'P-9002')
    assert.equal(queued.ok, true)
    assert.equal(queued.data.status, 'failed')
    assert.equal(queued.data.attempts, 3)
    assert.equal(queued.data.next_attempt_date, null)
})
