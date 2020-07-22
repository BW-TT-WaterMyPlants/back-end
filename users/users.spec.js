const req = require('supertest')
const server = require('../server').server
const db = require('../database/config')

const CONTENT_TYPE = "application/json; charset=utf-8"

beforeEach(async () => {
     await db.seed.run()
})

afterAll(async () => {
    await db.destroy()
})

describe('/api/users', () => {
    describe('GET /', () => {
        it('returns an OK status code', async () => {
            const res = await req(server).get('/api/users')
            expect(res.statusCode).toBe(200)
        })
        it('returns an array of users ({ id, username })', async () => {
            const res = await req(server).get('/api/users')
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            if (res.body.length > 0) {
                expect(res.body[0].id).toBeDefined()
                expect(res.body[0].username).toBeDefined()
            }
        })
    })
})