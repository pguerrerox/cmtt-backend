import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from '../helpers/test-db.js'
import {
    createManager,
    updateManager,
    getManagerByName,
    deleteManager
} from '../../repositories/managers.repo.js'

test('createManager creates and fetches a manager', () => {
    const db = createTestDb()

    const result = createManager(db, {
        name: 'jdoe',
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        role: 'PM',
        isActive: 1,
        isAdmin: 0
    })
    assert.equal(result.ok, true)

    const fetched = getManagerByName(db, 'jdoe')
    assert.equal(fetched.ok, true)
    assert.equal(fetched.data.fullname, 'John Doe')
})

test('createManager rejects duplicate email', () => {
    const db = createTestDb()
    const payload = {
        name: 'jdoe',
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        role: 'PM',
        isActive: 1,
        isAdmin: 0
    }

    assert.equal(createManager(db, payload).ok, true)
    const duplicate = createManager(db, { ...payload, name: 'john2' })
    assert.equal(duplicate.ok, false)
    assert.equal(duplicate.error, 'manager already exists')
})

test('updateManager returns not found for unknown id', () => {
    const db = createTestDb()
    const result = updateManager(db, 999, { fullname: 'Nobody' })
    assert.equal(result.ok, false)
    assert.equal(result.error, 'manager not found')
})

test('deleteManager removes an existing manager', () => {
    const db = createTestDb()
    createManager(db, {
        name: 'jdoe',
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        role: 'PM',
        isActive: 1,
        isAdmin: 0
    })

    const managerId = db.prepare('SELECT id FROM managers WHERE name = ?').get('jdoe').id
    const deleted = deleteManager(db, managerId)
    assert.equal(deleted.ok, true)
})
