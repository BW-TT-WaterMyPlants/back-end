const db = require('../database/config')

async function add(plant) {
    const [id] = await db('plants').insert(plant).returning('id')
    return findById(id)
}

function find() {
    return db('plants').select('*')
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

function remove(id) {
    return db('plants')
      .where({ id })
      .del()
}

async function update(id, data) {
	await db('plants').where({ id }).update(data).returning('id')
	return findById(id)
}


module.exports = {
    add,
    find,
    findBy,
    findById,
    remove,
    update,
}
