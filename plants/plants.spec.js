const req = require('supertest')
const server = require('../server').server
const db = require('../database/config')

const CONTENT_TYPE = "application/json; charset=utf-8"

beforeAll(async () => {
     await db.seed.run()
})

afterAll(async () => {
    await db.destroy()
})

let token;

describe('login user to get token', () => {
  it('returns a json web token on a successful login', async () => {
      const res = await req(server).post('/api/users/login').send({
          username: 'janedoe',
          password: 'abc12345'
      })
      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toBe(CONTENT_TYPE)
      expect(res.body.message).toBe('janedoe logged in')
      expect(res.body.token).toBeDefined()
      token = res.body.token
  })
})

describe('GET /api/plants/:id', () => {
    it('returns the plant if the plant exists', async () => {
        const res = await req(server).get('/api/plants/1').send({token: token})
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.nickname).toBe("Spidey")
        expect(res.body.species).toBe("Spider Plant")
    })
    it('returns 404 and the correct message if plant not found', async () => {
        const res = await req(server).get('/api/plants/999').send({token: token})
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe('Plant not found')
    })
})
