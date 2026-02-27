import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from '../helpers/test-db.js'
import { createCustomer } from '../../repositories/customers.repo.js'
import {
    createFacility,
    getAllFacilities,
    updateFacility,
    deleteFacility
} from '../../repositories/facilities.repo.js'

function seedCustomer(db) {
    createCustomer(db, {
        name: 'ACME',
        country: 'US'
    })
    return db.prepare('SELECT id FROM customers LIMIT 1').get().id
}

test('facility repository CRUD works with customer FK', () => {
    const db = createTestDb()
    const customerId = seedCustomer(db)

    const created = createFacility(db, {
        name: 'Plant 1',
        customer_id: customerId,
        address: 'Main St 123',
        contacts: 'ops@acme.test'
    })
    assert.equal(created.ok, true)

    const list = getAllFacilities(db)
    assert.equal(list.ok, true)
    assert.equal(list.data.length, 1)

    const id = list.data[0].id
    const updated = updateFacility(db, id, { address: 'Main St 999' })
    assert.equal(updated.ok, true)

    const deleted = deleteFacility(db, id)
    assert.equal(deleted.ok, true)
})
