const db = require('../database/config')
const model = require('./model')

beforeEach(async () => {
     await db.seed.run()
})

afterAll(async () => {
    await db.destroy()
})

describe('find()', () => {
    it('returns a list of all users { id, username } in an array', () => {
        console.log(model.find())
    })
    it('returns falsy if no users', () => {

    })
})

describe('findBy(filter)', () => {
    it('returns the user { id, username, password, phoneNumber } if found', () => {

    })
    it('returns falsy if user not found', () => {

    })
})

describe('findById(id)', () => {
    it('returns the user { id, username, phoneNumber } if found', () => {

    })
    it('returns falsy if user not found', () => {

    })
})

describe('add(user)', () => {
    it('returns findById(n) of new User with id of n if successful', () => {

    })
    it('returns falsy if it fails', () => {

    })
})

describe('update(user)', () => {
    it('updates user information', () => {

    })
    it('returns falsy if it fails', () => {

    })
})