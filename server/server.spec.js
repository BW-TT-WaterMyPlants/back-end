const server = require('./server')
const supertest = require('supertest')

const CONTENT_TYPE = "application/json; charset=utf-8"

describe('GET /', () => {
    it('returns an OK status code and welcome message', async () => {
        const res = await supertest(server).get('/')
        expect(res.statusCode).toBe(200)
        expect(res.headers["content-type"]).toBe(CONTENT_TYPE)
        expect(res.body.message).toBe('Welcome to the Water My Plants API!')
    })
})