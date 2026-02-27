import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from '../helpers/test-db.js'
import adminSalesManagersRouter from '../../routes/admin.salesmanagers.routes.js'
import adminProjectEngRouter from '../../routes/admin.projecteng.routes.js'
import salesManagersRouter from '../../routes/salesmanagers.routes.js'
import projectEngRouter from '../../routes/projecteng.routes.js'
import customersRouter from '../../routes/customers.routes.js'
import facilitiesRouter from '../../routes/facilities.routes.js'

function getRouteHandler(router, method, path) {
    const layer = router.stack.find((item) =>
        item.route &&
        item.route.path === path &&
        item.route.methods[method]
    )
    return layer.route.stack[0].handle
}

function createMockRes() {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code
            return this
        },
        json(payload) {
            this.body = payload
            return this
        }
    }
}

test('admin sales manager create + public read works', () => {
    const createHandler = getRouteHandler(adminSalesManagersRouter, 'post', '/admin/salesmanagers')
    const readHandler = getRouteHandler(salesManagersRouter, 'get', '/salesmanagers')
    const db = createTestDb()

    const createRes = createMockRes()
    createHandler({ db, body: { name: 'Alice', email: 'alice@example.com', active: 1 } }, createRes)
    assert.equal(createRes.statusCode, 201)

    const readRes = createMockRes()
    readHandler({ db }, readRes)
    assert.equal(readRes.statusCode, 200)
    assert.equal(readRes.body.data.length, 1)
})

test('admin project engineer create + public read works', () => {
    const createHandler = getRouteHandler(adminProjectEngRouter, 'post', '/admin/projecteng')
    const readHandler = getRouteHandler(projectEngRouter, 'get', '/projecteng')
    const db = createTestDb()

    const createRes = createMockRes()
    createHandler({ db, body: { name: 'Bob', email: 'bob@example.com', active: 1 } }, createRes)
    assert.equal(createRes.statusCode, 201)

    const readRes = createMockRes()
    readHandler({ db }, readRes)
    assert.equal(readRes.statusCode, 200)
    assert.equal(readRes.body.data.length, 1)
})

test('public customer and facility creation works', () => {
    const createCustomerHandler = getRouteHandler(customersRouter, 'post', '/customers')
    const createFacilityHandler = getRouteHandler(facilitiesRouter, 'post', '/facilities')
    const db = createTestDb()

    const customerRes = createMockRes()
    createCustomerHandler({ db, body: { name: 'ACME', country: 'US' } }, customerRes)
    assert.equal(customerRes.statusCode, 201)

    const customer = db.prepare('SELECT id FROM customers WHERE name = ?').get('ACME')
    const facilityRes = createMockRes()
    createFacilityHandler({ db, body: { name: 'Plant 1', customer_id: customer.id } }, facilityRes)
    assert.equal(facilityRes.statusCode, 201)
})
