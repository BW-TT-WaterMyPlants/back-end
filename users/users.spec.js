const req = require('supertest')
const server = require('../server').server
const db = require ('../database/config')
const { expectCt } = require('helmet')

const CONTENT_TYPE = "application/json; charset=utf-8"

beforeEach(async () => {
    await db.seed.run()
})

afterAll(async () => {
    await db.destroy()
})

describe('/api/users/', () => {
    describe('GET', () => {
        it('returns 200 and the correct data', async () => {
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
            expect(res.body.message).toBe('new user created successfully')
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
        it('returns 200 and token, user information on successful login', async () => {
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

describe('/api/users/:userId', () => {
    describe('GET', () => {
        it('returns 404 if the userId does not exist', async () => {
            const res = await req(server).get('/api/users/3').set('token', token)
            expect(res.statusCode).toBe(404)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('user not found')
        })
        it('returns 401 and correct message if request is missing token header', async () => {
            const res = await req(server).get('/api/users/1')
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('missing required token')
        })
        it("returns 401 and correct message if token header is invalid", async () => {
            const res = await req(server).get('/api/users/1').set('token', 'invalid')
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('invalid token')
        })
        it("returns 403 and correct message if the token userId doesn't match param userId", async () => {
            const res = await req(server).get('/api/users/2').set('token', token)
            expect(res.statusCode).toBe(403)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('unauthorized user')
        })
        it('returns 200 and correct user\'s id, username, phoneNumber if the user found and authorized', async () => {
            const res = await req(server).get('/api/users/1').set('token', token)
            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('user found')
            expect(res.body.user).toBeDefined()
            expect(res.body.user.id).toBe(1)
            expect(res.body.user.username).toBe('janedoe')
            expect(res.body.user.phoneNumber).toBe('(900)555-1212')
        })
    })
    describe('PUT', () => {
        it('returns 400 if request body contains no changes', async () => {
            const res = await req(server).put('/api/users/1').set('token', token)
            expect(res.statusCode).toBe(400)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('missing required information')
        })
        it('returns 400 if request contains password without newPassword', async () => {
            const res = await req(server).put('/api/users/1').set('token', token).send({
                password: 'test12345'
            })
            expect(res.statusCode).toBe(400)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('missing required information')
        })
        it('returns 400 if request contains newPassword without password', async () => {
            const res = await req(server).put('/api/users/1').set('token', token).send({
                newPassword: 'test12345'
            })
            expect(res.statusCode).toBe(400)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('missing required information')
        })
        it('returns 409 if new phoneNumber is already in use', async () => {
            const res = await req(server).put('/api/users/1').set('token', token).send({
                phoneNumber: '(202)555-1212'
            })
            expect(res.statusCode).toBe(409)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('phone number unavailable')
        })
        it('returns 401 if current password is not correct', async () => {
            const res = await req(server).put('/api/users/1').set('token', token).send({
                password: 'wrong',
                newPassword: 'test12345'
            })
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('invalid login')
        })
        it('returns 200 and updated user if password change successful', async () => {
            const res = await req(server).put('/api/users/1').set('token', token).send({
                password: 'abc12345',
                newPassword: 'test12345'
            })
            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('update successful')
            expect(res.body.user).toBeDefined()
            expect(res.body.user.id).toBe(1)
        })
        it('returns 200 and updated user if phoneNumber change successful', async () => {
            const res = await req(server).put('/api/users/1').set('token', token).send({
                phoneNumber: "(666)666-6666"
            })
            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('update successful')
            expect(res.body.user).toBeDefined()
            expect(res.body.user.id).toBe(1)
            expect(res.body.user.phoneNumber).toBe('(666)666-6666')
        })
        it('returns 200 and updated user if password and phoneNumber change successful', async () => {
            const res = await req(server).put('/api/users/1').set('token', token).send({
                password: 'abc12345',
                newPassword: 'test12345',
                phoneNumber: "(666)666-6666"
            })
            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('update successful')
            expect(res.body.user).toBeDefined()
            expect(res.body.user.id).toBe(1)
            expect(res.body.user.phoneNumber).toBe('(666)666-6666')
        })
    })
})

describe('/api/users/:userId/plants', () => {
    describe('GET', () => {
        it('returns 404 if the userId does not exist', async () => {
            const res = await req(server).get('/api/users/3/plants').set('token', token)
            expect(res.statusCode).toBe(404)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('user not found')
        })
        it('returns 401 and correct message if request is missing token header', async () => {
            const res = await req(server).get('/api/users/1/plants')
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('missing required token')
        })
        it("returns 401 and correct message if token header is invalid", async () => {
            const res = await req(server).get('/api/users/1/plants').set('token', 'invalid')
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('invalid token')
        })
        it("returns 403 and correct message if the token userId doesn't match param userId", async () => {
            const res = await req(server).get('/api/users/2/plants').set('token', token)
            expect(res.statusCode).toBe(403)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('unauthorized user')
        })
        it('returns 200 and a list of the user\'s plants', async () => {
            const res = await req(server).get('/api/users/1/plants').set('token', token)
            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('found 3 plants')
            expect(res.body.plants.length).toBe(3)
        })
    })
    describe('POST', () => {
        it('returns 404 if the userId does not exist', async () => {
            const res = await req(server).post('/api/users/3/plants').set('token', token)
            expect(res.statusCode).toBe(404)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('user not found')
        })
        it('returns 401 and correct message if request is missing token header', async () => {
            const res = await req(server).post('/api/users/1/plants')
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('missing required token')
        })
        it("returns 401 and correct message if token header is invalid", async () => {
            const res = await req(server).post('/api/users/1/plants').set('token', 'invalid')
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('invalid token')
        })
        it("returns 403 and correct message if the token userId doesn't match param userId", async () => {
            const res = await req(server).post('/api/users/2/plants').set('token', token)
            expect(res.statusCode).toBe(403)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('unauthorized user')
        })
        it("returns 201 and correct new plant if passed a full plant object", async () => {
            const res = await req(server).post('/api/users/1/plants').set('token', token).send({
                nickname: 'Bobby',
                species: 'Carrot',
                h2oFrequency: 1,
                imageUrl: "https://bitsofco.de/content/images/2018/12/broken-1.png",
                lastWatered: Date(2020, 6, 6, 6, 6, 6)
            })
            expect(res.statusCode).toBe(201)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('plant added')
            expect(res.body.plant).toBeDefined()
            expect(res.body.plant.id).toBeDefined()
            expect(res.body.plant.nickname).toBe('Bobby')
            expect(res.body.plant.species).toBe('Carrot')
            expect(res.body.plant.h2oFrequency).toBe(1)
            expect(res.body.plant.imageUrl).toBe("https://bitsofco.de/content/images/2018/12/broken-1.png")
            expect(res.body.plant.lastWatered).toBe(Date(2020, 6, 6, 6, 6, 6))
            expect(res.body.plant.userId).toBe(1)
        })
        it("returns 201 and correct new plant if passed a partial plant object", async () => {
            const res = await req(server).post('/api/users/1/plants').set('token', token).send({
                nickname: 'Bobby',
                species: 'Carrot',
                h2oFrequency: 1,
            })
            expect(res.statusCode).toBe(201)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('plant added')
            expect(res.body.plant).toBeDefined()
            expect(res.body.plant.id).toBeDefined()
            expect(res.body.plant.nickname).toBe('Bobby')
            expect(res.body.plant.species).toBe('Carrot')
            expect(res.body.plant.h2oFrequency).toBe(1)
            expect(res.body.plant.imageUrl).toBe(null)
            expect(res.body.plant.lastWatered).toBe(null)
            expect(res.body.plant.userId).toBe(1)
        })
        it("returns 201 and correct new plant if passed an empty plant object", async () => {
            const res = await req(server).post('/api/users/1/plants').set('token', token)
            expect(res.statusCode).toBe(201)
            expect(res.headers['content-type']).toBe(CONTENT_TYPE)
            expect(res.body.message).toBe('plant added')
            expect(res.body.plant).toBeDefined()
            expect(res.body.plant.id).toBeDefined()
            expect(res.body.plant.nickname).toBe(null)
            expect(res.body.plant.species).toBe(null)
            expect(res.body.plant.h2oFrequency).toBe(null)
            expect(res.body.plant.imageUrl).toBe(null)
            expect(res.body.plant.lastWatered).toBe(null)
            expect(res.body.plant.userId).toBe(1)
        })
    })
})