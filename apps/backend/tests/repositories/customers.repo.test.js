import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from '../helpers/test-db.js'
import { createSalesManager } from '../../repositories/salesmanagers.repo.js'
import { createProjectEng } from '../../repositories/projecteng.repo.js'
import {
    createCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer
} from '../../repositories/customers.repo.js'

function seedDependencies(db) {
    createSalesManager(db, {
        name: 'Alice Sales',
        email: 'alice.sales@example.com',
        telephone: '+1-111-111',
        active: 1
    })
    createProjectEng(db, {
        name: 'Bob Engineer',
        email: 'bob.engineer@example.com',
        ext: '120',
        active: 1
    })

    const salesmanagerId = db.prepare('SELECT id FROM salesmanagers LIMIT 1').get().id
    const projectengId = db.prepare('SELECT id FROM projecteng LIMIT 1').get().id
    return { salesmanagerId, projectengId }
}

test('customer repository CRUD works with FK references', () => {
    const db = createTestDb()
    const { salesmanagerId, projectengId } = seedDependencies(db)

    const created = createCustomer(db, {
        name: 'ACME',
        country: 'US',
        salesmanager_id: salesmanagerId,
        projecteng_id: projectengId,
        special_instructions: 'Dock 3'
    })
    assert.equal(created.ok, true)

    const list = getAllCustomers(db)
    assert.equal(list.ok, true)
    assert.equal(list.data.length, 1)

    const id = list.data[0].id
    const updated = updateCustomer(db, id, { country: 'CA' })
    assert.equal(updated.ok, true)

    const deleted = deleteCustomer(db, id)
    assert.equal(deleted.ok, true)
})
