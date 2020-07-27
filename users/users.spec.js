const req = require('supertest')
const server = require('../server').server
const db = require ('../database/config')

const CONTENT_TYPE = "application/json; charset=utf-8"

beforeEach(async () => {
    await db.seed.run()
})

afterAll(async () => {
    await db.destroy()
})

describe('/api/users/', () => {
    describe('GET', () => {
        it('returns the correct data', async () => {
            const res = await req(server).get('/api/users')
            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.users).toBeDefined()
            if (res.body.length > 0) {
                const [firstUser] = res.body.users
                expect(firstUser.id).toBeDefined()
                expect(firstUser.username).toBeDefined()
            }
        })
    })

    describe('POST', () => {
        it('returns 400 if username is missing from the request body', async () => {
            const res = await req(server).post('/api/users').send({
                password: 'test12345',
                phoneNumber: '(666)666-6666'
            })
            expect(res.statusCode).toBe(400)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('missing required information')
        })
        it('returns 400 if password is missing from the request body', async () => {
            const res = await req(server).post('/api/users').send({
                username: 'test',
                phoneNumber: '(666)666-6666'
            })
            expect(res.statusCode).toBe(400)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('missing required information')
        })
        it('returns 400 if phoneNumber is missing from the request body', async () => {
            const res = await req(server).post('/api/users').send({
                username: 'test',
                password: 'test12345'
            })
            expect(res.statusCode).toBe(400)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('missing required information')
        })
        it('returns 409 and rejects a registration using an existing username', async () => {
            const res = await req(server).post('/api/users').send({
                username: 'janedoe',
                password: 'abc12345',
                phoneNumber: '(900)555-1212'
            })
            expect(res.statusCode).toBe(409)
            expect(res.headers["content-type"]).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('username unavailable')
        })
        it('returns 409 and rejects a registration with an in-use phone number', async () => {
            const res = await req(server).post('/api/users').send({
                username: 'junedoe',
                password: 'abc12345',
                phoneNumber: '(900)555-1212'
            })
            expect(res.statusCode).toBe(409)
            expect(res.headers["content-type"]).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('phone number unavailable')
        })
        it('returns 201 and the new user\'s id, username, and phoneNumber', async () => {
            const res = await req(server).post('/api/users').send({
                username: 'junedoe',
                password: 'abc12345',
                phoneNumber: '(666)666-6666'
            })
            expect(res.statusCode).toBe(201)
            expect(res.headers["content-type"]).toBe(CONTENT_TYPE)
            expect(res.body.newUser).toBeDefined()
            expect(res.body.newUser.id).toBeDefined()
            expect(res.body.newUser.username).toBe('junedoe')
            expect(res.body.newUser.phoneNumber).toBe('(666)666-6666')
        })
    })
})

let token

describe('/api/users/login', () => {
    describe('POST', () => {
        it('returns 401 and rejects an incorrect password', async () => {
            const res = await req(server).post('/api/users/login').send({
                username: 'janedoe',
                password: 'wrong'
            })
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('invalid login')
        })
        it('returns 401 and rejects a nonexistant username', async () => {
            const res = await req(server).post('/api/users/login').send({
                username: 'wrong',
                password: 'abc12345'
            })
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('invalid login')
        })
        it('returns 201 and token, user information on successful login', async () => {
            const res = await req(server).post('/api/users/login').send({
                username: 'janedoe',
                password: 'abc12345'
            })
            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.token).toBeDefined()
            expect(res.body.user).toBeDefined()
            expect(res.body.user.id).toBeDefined()
            expect(res.body.user.username).toBe('janedoe')
            expect(res.body.user.phoneNumber).toBe('(900)555-1212')
            expect(res.body.message).toBe('login successful')
            token = res.body.token
        })
    })
})