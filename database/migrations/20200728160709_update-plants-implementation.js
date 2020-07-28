
exports.up = async function(knex) {
    await knex.schema.table("plants", (table) => {
        table.dropColumn("next_watering")
        table.dropColumn("h2oTime")
        table.renameColumn("watered_at", "last_watered")
    })
};

exports.down = async function(knex) {
    await knex.schema.table("plants", (table) => {
        table.datetime("watered_at")
        table.datetime("next_watering")
        table.renameColumn("last_watered", "watered_at")
    })
};
