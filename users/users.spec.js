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

describe('GET /api/users', () => {
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

describe('GET /api/users/:id', () => {
    it('returns 200 if the user exists', async () => {
        const res = await req(server).get('/api/users/1')
        expect(res.statusCode).toBe(200)
    })
    it('returns the user ({id, username, phoneNumber}) if the user exists', async () => {
        const res = await req(server).get('/api/users/1')
        expect(res.body.id).toBe(1)
        expect(res.body.username).toBe('janedoe')
        expect(res.body.phoneNumber).toBe('(900)555-1212')
    })
    it('returns 404 and the correct message if user not found', async () => {
        const res = await req(server).get('/api/users/5')
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe('user not found')
    })
})

describe('POST /api/users', () => {
    it('creates a new user', async () => {
        const res = await req(server).post('/api/users').send({
            username: 'junedoe',
            password: 'abc12345',
            phoneNumber: '(666)666-6666'
        })
        expect(res.statusCode).toBe(201)
        expect(res.headers["content-type"]).toBe(CONTENT_TYPE)
    })
    it('rejects a registration using an existing username', async () => {
        const res = await req(server).post('/api/users').send({
            username: 'janedoe',
            password: 'abc12345',
            phoneNumber: '(900)555-1212'
        })
        expect(res.statusCode).toBe(409)
        expect(res.headers["content-type"]).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('username unavailable')
    })
    // it('rejects a registration with an invalid password', async () => {
    //     const res = await req(server).post('/api/users').send({
    //         username: 'junedoe',
    //         password: 'abc1234'
    //     })
    //     expect(res.statusCode).toBe(400)
    //     expect(res.headers["content-type"]).toBe(CONTENT_TYPE)
    //     expect(res.body.message).toBe('password invalid')
    // })
})

describe('POST /api/users/login', () => {
    it('returns a json web token on a successful login', async () => {
        const res = await req(server).post('/api/users/login').send({
            username: 'janedoe',
            password: 'abc12345'
        })
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
        expect(res.body.message).toBe('janedoe logged in')
        expect(res.body.token).toBeDefined()
    })
    it('rejects an incorrect password', async () => {
        const res = await req(server).post('/api/users/login').send({
            username: 'janedoe',
            password: 'wrong'
        })
        expect(res.statusCode).toBe(401)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
        expect(res.body.message).toBe('invalid login')
    })
    it('rejects a nonexistant username', async () => {
        const res = await req(server).post('/api/users/login').send({
            username: 'wrong',
            password: 'abc12345'
        })
        expect(res.statusCode).toBe(401)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
        expect(res.body.message).toBe('invalid login')
    })
})