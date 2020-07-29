const req = require('supertest')
const server = require('../server').server
const db = require('../database/config')

const CONTENT_TYPE = "application/json; charset=utf-8"

beforeEach(() => {
     return db.seed.run()
})

afterAll(() => {
    return db.destroy()
})

let token;

describe('login user to get token', () => {
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

describe('/api/plants/:plantId', () => {
  describe('GET', () => {
    it('returns the plant if the plant exists', async () => {
        const res = await req(server).get('/api/plants/1').set('token',token)
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('Plant found')
        expect(res.body.plant.nickname).toBe("Spidey")
        expect(res.body.plant.species).toBe("Spider Plant")
    })
    it('returns 404 and the correct message if plant not found', async () => {
        const res = await req(server).get('/api/plants/999').set('token',token)
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe('Plant not found')
    })
    it('returns 401 and correct message if request is missing token header', async () => {
        const res = await req(server).get('/api/plants/1')
        expect(res.statusCode).toBe(401)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('Missing required token')
    })
    it("returns 401 and correct message if token header is invalid", async () => {
        const res = await req(server).get('/api/plants/1').set('token', 'invalid')
        expect(res.statusCode).toBe(401)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('Invalid token')
    })
    it("returns 403 and correct message if the token userId doesn't match plant userId", async () => {
        const res = await req(server).get('/api/plants/5').set('token', token)
        expect(res.statusCode).toBe(403)
        expect(res.headers['content-type']).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('Unauthorized')
    })
  })
  describe('PUT', () => {
    it('updates plant with new data', async () => {
      const res = await req(server)
        .put('/api/plants/2')
        .send({species: "Prickley Pear Cactus", h2oFrequency: 10})
        .set('token',token)
      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toBe(CONTENT_TYPE)
      expect(res.body.message).toBe('update successful')
      expect(res.body.plant.nickname).toBe("Prickley")
      expect(res.body.plant.species).toBe("Prickley Pear Cactus")
      expect(res.body.plant.h2oFrequency).toBe(10)
    })
  })
  describe('PATCH', () => {
    it('updates lastWatered', async () => {
      const newDate = new Date(Date.now()).toISOString()
      const res = await req(server)
        .patch('/api/plants/1')
        .send({lastWatered: newDate})
        .set('token',token)
      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toBe(CONTENT_TYPE)
      expect(res.body.message).toBe('update successful')
      expect(res.body.plant.nickname).toBe('Spidey')
      expect(res.body.plant.lastWatered).toEqual(newDate)
    })
  })
  describe('DELETE', ()=> {
    it('removes plant', async () => {
      const res = await req(server).delete('/api/plants/3').set('token',token)
      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toBe(CONTENT_TYPE)
      expect(res.body.message).toBe('Plant removed')
      const check = await req(server).get('/api/plants/3').set('token',token)
      expect(check.statusCode).toBe(404)
      expect(check.body.message).toBe('Plant not found')
    })
  })
})
