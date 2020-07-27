exports.up = function(knex) {
  return knex.schema.table("plants", (table) => {
    table.datetime("watered_at");
    table.datetime("next_watering");
  })
};

exports.down = function(knex) {
  return knex.table("plants", (table) => {
    table.dropColumn("next_watering")
    table.dropColumn("watered_at")
  })
};
