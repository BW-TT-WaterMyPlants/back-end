const db = require('../database/config')

async function add(user) {
    const [id] = await db('users').insert(user).returning('id')
    return findById(id)
}

function find() {
    return db('users').select('id', 'username')
}

function findBy(filter) {
    return db('users')
        .select('*')
        .where(filter)
}

function findById(id) {
    return db('users')
        .select('id', 'username', 'phoneNumber')
        .where({id})
        .first()
}

async function update(changes, id) {
    const updatedId = await db('users')
        .where({id})
        .returning('id')
        .update({
            password: changes.password,
            phoneNumber: changes.phoneNumber
        })
    return findById(updatedId)
}

module.exports = {
    add,
    find,
    findBy,
    findById,
    update
}
