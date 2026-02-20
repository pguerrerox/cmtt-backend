import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from '../helpers/test-db.js'
import { createManager } from '../../repositories/managers.repo.js'
import {
    createProject,
    getProjectsByNumber,
    modifyProject,
    deleteProject
} from '../../repositories/projects.repo.js'

function insertManager(db) {
    createManager(db, {
        name: 'pm1',
        fullname: 'Project Manager',
        email: 'pm1@example.com',
        role: 'PM',
        isActive: 1,
        isAdmin: 0
    })
    return db.prepare('SELECT id FROM managers WHERE name = ?').get('pm1').id
}

test('createProject stores and fetches project by number', () => {
    const db = createTestDb()
    const managerId = insertManager(db)

    const created = createProject(db, {
        project_number: 'P-1000',
        customer_name: 'ACME',
        manager_id: managerId
    })
    assert.equal(created.ok, true)

    const fetched = getProjectsByNumber(db, 'P-1000')
    assert.equal(fetched.ok, true)
    assert.equal(fetched.data.customer_name, 'ACME')
})

test('createProject requires project_number', () => {
    const db = createTestDb()
    const created = createProject(db, { customer_name: 'ACME' })
    assert.equal(created.ok, false)
    assert.equal(created.error, 'project_number is required')
})

test('modifyProject updates existing record', () => {
    const db = createTestDb()
    createProject(db, { project_number: 'P-2000', customer_name: 'Before' })

    const updated = modifyProject(db, { customer_name: 'After' }, 'P-2000')
    assert.equal(updated.ok, true)

    const fetched = getProjectsByNumber(db, 'P-2000')
    assert.equal(fetched.data.customer_name, 'After')
})

test('deleteProject returns not found on missing project', () => {
    const db = createTestDb()
    const deleted = deleteProject(db, 'does-not-exist')
    assert.equal(deleted.ok, false)
    assert.equal(deleted.error, 'project not found')
})
