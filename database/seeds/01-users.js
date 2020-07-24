const hashedPassword = "$2a$14$qHqCbXUImiBOgXlFNX47wuA7uFWNGNAZutYLvOeye9eotewGlfYV6"

exports.seed = function(knex) {
	return knex("users").insert([
		{ username: "janedoe", password: hashedPassword, phoneNumber: "(900)555-1212" },
		{ username: "johndoe", password: hashedPassword, phoneNumber: "(202)555-1212" },
	])
}
