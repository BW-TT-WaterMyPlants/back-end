exports.up = async function(knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments()
    table.text("username").notNullable().unique()
    table.text("password").notNullable()
    table.text("phoneNumber").unique()
  })

	await knex.schema.createTable("plants", (table) => {
		table.increments()
    table.text("nickname")
		table.text("species")
    table.integer("h2oFrequency")
    table.time("h2oTime")
    table.integer("user_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
	})
}

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists("plants")
  await knex.schema.dropTableIfExists("users")
}
