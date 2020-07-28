
exports.up = async function(knex) {
    await knex.schema.table("plants", table => {
        table.renameColumn("last_watered", "lastWatered")
        table.renameColumn("user_id", "userId")
    })
};

exports.down = async function(knex) {
    await knex.schema.table("plants", table => {
        table.renameColumn("lastWatered", "last_watered")
        table.renameColumn("userId", "user_id")
    })
};
