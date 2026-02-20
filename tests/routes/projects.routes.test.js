import test from 'node:test'
import assert from 'node:assert/strict'
import projectsRouter from '../../routes/projects.routes.js'
import { createTestDb } from '../helpers/test-db.js'

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

test('POST /createProject creates project', () => {
    const handler = getRouteHandler(projectsRouter, 'post', '/createProject')
    const db = createTestDb()
    const res = createMockRes()

    handler(
        {
            db,
            body: {
                project_number: 'P-3000',
                customer_name: 'ACME'
            }
        },
        res
    )

    assert.equal(res.statusCode, 201)
    assert.match(res.body.message, /was created successfully/)
})

test('POST /createProject returns 409 for duplicate project_number', () => {
    const handler = getRouteHandler(projectsRouter, 'post', '/createProject')
    const db = createTestDb()
    const payload = {
        project_number: 'P-3001',
        customer_name: 'ACME'
    }

    const firstRes = createMockRes()
    const duplicateRes = createMockRes()

    handler({ db, body: payload }, firstRes)
    handler({ db, body: payload }, duplicateRes)

    assert.equal(firstRes.statusCode, 201)
    assert.equal(duplicateRes.statusCode, 409)
    assert.equal(duplicateRes.body.error, 'project already exists')
})

test('GET /projects/:project_number returns 404 when missing', () => {
    const handler = getRouteHandler(projectsRouter, 'get', '/projects/:project_number')
    const db = createTestDb()
    const res = createMockRes()

    handler(
        {
            db,
            params: {
                project_number: 'DOES-NOT-EXIST'
            }
        },
        res
    )

    assert.equal(res.statusCode, 404)
    assert.equal(res.body.error, 'project not found')
})
