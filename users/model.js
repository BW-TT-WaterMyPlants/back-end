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

function update(changes, id) {
    return db('users')
        .where({id})
        .update({
            password: changes.password,
            phoneNumber: changes.phoneNumber
        }, ['id', 'username', 'phoneNumber'])
}

module.exports = {
    add,
    find,
    findBy,
    findById,
    update
}
