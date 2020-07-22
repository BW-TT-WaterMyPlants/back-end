const express = require('express')
const helmet = require('helmet')
const reqLogger = require('./middleware/req-logger')
const errLogger = require('./middleware/err-logger')

const Users = require('../users').router
const Plants = require('../plants').router

const server = express()

server.use(helmet())
server.use(express.json())

// Logger
if (process.env.NODE_ENV != 'testing') {
    server.use(reqLogger())
}

// Routers
server.use('/api/users', Users)
// server.use('/api/plants', Plants)

// Error Logger
if (process.env.NODE_ENV != 'testing') {
    server.use(errLogger())
}

// Test Endpoint

server.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to the Water My Plants API!'
    })
})

module.exports = server