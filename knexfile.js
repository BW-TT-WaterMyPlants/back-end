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
  testing_sqlite: {
    client: 'sqlite3',
    connection: { filename: './database/test.db3' },
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
  testing_pg: {
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
  	}
  },
  production: {
    client: "pg",
  	useNullAsDefault: true,
  	connection: {
		host: `${process.env.DB_HOST}`,
		user: `${process.env.DB_USER}`,
		password: `${process.env.DB_PASSWORD}`,
		database: `${process.env.DB_NAME}`  
  	},
  	migrations: {
  		directory: "./database/migrations",
  	},
  	seeds: {
  		directory: "./database/seeds",
  	}
  }
};
