const req = require('supertest')
const server = require('../server').server
const db = require('../database/config')

const CONTENT_TYPE = "application/json; charset=utf-8"

beforeAll(() => {
     return db.seed.run()
})

afterAll(() => {
    return db.destroy()
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

describe('POST /api/plants', () => {
  it('adds a new plant object', async () => {
    const res = await req(server).post('/api/plants').send({
      token: token,
      nickname: 'Test Plant',
      species: 'Testus Plantus',
      h2oFrequency: 2,
      h2oTime: '15:30',
    })
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toBe(CONTENT_TYPE)
    expect(res.body.id).toBeDefined()
    expect(res.body.nickname).toBe("Test Plant")
    expect(res.body.species).toBe("Testus Plantus")
  })
})

describe('PUT /api/plants/:id', ()=> {
  it('updates plant with new data', async () => {
    const res = await req(server)
      .put('/api/plants/2')
      .send({token: token, species: "Prickley Pear Cactus", h2oFrequency: 10})
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toBe(CONTENT_TYPE)
    expect(res.body.nickname).toBe("Prickley")
    expect(res.body.species).toBe("Prickley Pear Cactus")
    expect(res.body.h2oFrequency).toBe(10)
  })
})

describe('DELETE /api/plant/:id', ()=> {
  it('removes plant', async () => {
    const res = await req(server).delete('/api/plants/3').send({token: token})
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toBe(CONTENT_TYPE)
    expect(res.body.message).toBe('Plant removed')
    const check = await req(server).get('/api/plants/3').send({token: token})
    expect(check.statusCode).toBe(404)
    expect(check.body.message).toBe('Plant not found')
  })
})
