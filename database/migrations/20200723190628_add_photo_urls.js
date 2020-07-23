exports.up = function(knex) {
  return knex.schema.table("plants", (table) => {
    table.text("image_url").defaultTo("https://bitsofco.de/content/images/2018/12/broken-1.png")
  })
};

exports.down = function(knex) {
  return knex.table("plants", (table) => {
    table.dropColumn("image_url")
  })
};
