import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from '../helpers/test-db.js'
import {
    createProjectEng,
    getAllProjectEng,
    updateProjectEng,
    deleteProjectEng
} from '../../repositories/projecteng.repo.js'

test('project engineer repository CRUD works', () => {
    const db = createTestDb()

    const created = createProjectEng(db, {
        name: 'Bob Engineer',
        email: 'bob.engineer@example.com',
        ext: '120',
        active: 1
    })
    assert.equal(created.ok, true)

    const list = getAllProjectEng(db)
    assert.equal(list.ok, true)
    assert.equal(list.data.length, 1)

    const id = list.data[0].id
    const updated = updateProjectEng(db, id, { ext: '121' })
    assert.equal(updated.ok, true)

    const deleted = deleteProjectEng(db, id)
    assert.equal(deleted.ok, true)
})
