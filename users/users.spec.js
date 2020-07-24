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
            expect(res.body.users[0].id).toBeDefined()
            expect(res.body.users[0].username).toBeDefined()
        }
    })
})

describe('GET /api/users/:id', () => {
    it('returns the user if the user exists', async () => {
        const res = await req(server).get('/api/users/1')
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
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
        expect(res.body.newUser).toBeDefined()
        // expect(res.body.newUser.username).toBe('junedoe')
        // expect(res.body.newUser.password).toBe('abc12345')
        // expect(res.body.newUser.phoneNumber).toBe('(666)666-6666')
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
    it('rejects a registration with an in-use phone number', async () => {
        const res = await req(server).post('/api/users').send({
            username: 'junedoe',
            password: 'abc12345',
            phoneNumber: '(900)555-1212'
        })
        expect(res.statusCode).toBe(409)
        expect(res.headers["content-type"]).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('phone number in use')
    })
})

describe('POST /api/users/login', () => {
    it('returns a json web token on a successful login', async () => {
        const res = await req(server).post('/api/users/login').send({
            username: 'janedoe',
            password: 'abc12345'
        })
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('janedoe logged in')
        expect(res.body.token).toBeDefined()
    })
    it('rejects an incorrect password', async () => {
        const res = await req(server).post('/api/users/login').send({
            username: 'janedoe',
            password: 'wrong'
        })
        expect(res.statusCode).toBe(401)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('invalid login')
    })
    it('rejects a nonexistant username', async () => {
        const res = await req(server).post('/api/users/login').send({
            username: 'wrong',
            password: 'abc12345'
        })
        expect(res.statusCode).toBe(401)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('invalid login')
    })
})

describe('PUT /api/users/:id', () => {
    it('updates password and returns the updated user', async () => {
        const login = await req(server).post('/api/users/login').send({
            username: 'janedoe',
            password: 'abc12345'
        })
        const res = await req(server).put('/api/users/1').send({
            token: login.body.token,
            password: 'abc12345',
            newPassword: 'abc66666'
        })
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.user).toBeDefined()
    })
    it('updates phone number and returns the updated user', async () => {
        const login = await req(server).post('/api/users/login').send({
            username: 'janedoe',
            password: 'abc12345'
        })
        const res = await req(server).put('/api/users/1').send({
            token: login.body.token,
            phoneNumber: '(666)666-6666'
        })
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.user).toBeDefined()
    })
    it('updates password and phone number and returns the updated user', async () => {
        const login = await req(server).post('/api/users/login').send({
            username: 'janedoe',
            password: 'abc12345'
        })
        const res = await req(server).put('/api/users/1').send({
            token: login.body.token,
            password: 'abc12345',
            newPassword: 'abc66666',
            phoneNumber: '(666)666-6666'
        })
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.user).toBeDefined()
    })
    it('rejects an in-use phone number', async () => {
        const login = await req(server).post('/api/users/login').send({
            username: 'janedoe',
            password: 'abc12345'
        })
        const res = await req(server).put('/api/users/1').send({
            token: login.body.token,
            phoneNumber: '(202)555-1212'
        })
        expect(res.statusCode).toBe(409)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('phone number in-use')
    })
})

describe('GET /api/users/:id/plants', () => {
    it('returns a list of the user\'s plants', async () => {
        const login = await req(server).post('/api/users/login').send({
            username: 'janedoe',
            password: 'abc12345'
        })
        const res = await req(server).get('/api/users/1/plants').send({
            token: login.body.token
        })
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
    })
})
