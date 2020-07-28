
exports.up = async function(knex) {
    await knex.schema.table("plants", table => {
        table.renameColumn("image_url", "imageUrl")
    })
};

exports.down = async function(knex) {
    await knex.schema.table("plants", table => {
        table.renameColumn("imageUrl", "image_url")
    })
};
