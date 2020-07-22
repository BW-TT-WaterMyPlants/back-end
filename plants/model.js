const db = require('../database/config')

async function add(plant) {
    const [id] = await db('plants').insert(plant)
    return findById(id)
}

function find() {
    return db('plants').select('*').
}

function findBy(filter) {
    return db('plants')
        .select('*')
        .where(filter)
}

function findById(id) {
    return db('plants')
        .select('*')
        .where({id})
        .first()
}

module.exports = {
    add,
    find,
    findBy,
    findById
}