const express = require('express')
const helmet = require('helmet')
const reqLogger = require('./middleware/req-logger')
const errLogger = require('./middleware/err-logger')

const server = express()

server.use(helmet())
server.use(express.json())
server.use(reqLogger())

// Routers

server.use(errLogger())

// Test Endpoint

server.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to the Water My Plants API!'
    })
})

module.exports = server