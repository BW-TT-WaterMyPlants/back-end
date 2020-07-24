module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: './database/plants.db3' },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
      tableName: 'dbmigrations',
    },
    seeds: { directory: './database/seeds' },
    pool: {
  		afterCreate: (conn, done) => {
  			conn.run("PRAGMA foreign_keys = ON", done)
  		},
  	},
  },
  testing: {
    client: "pg",
  	useNullAsDefault: true,
  	connection: {
		host: '127.0.0.1',
		user: 'wmp',
		password: 'test',
		database: 'wmp_test'  
  	},
  	migrations: {
  		directory: "./database/migrations",
  	},
  	seeds: {
  		directory: "./database/seeds",
  	},
  	// pool: {
  	// 	afterCreate: (conn, done) => {
  	// 		conn.run("PRAGMA foreign_keys = ON", done)
  	// 	},
  	// },
  }
};
