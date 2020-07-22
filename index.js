const server = require('./server').server
const PORT = process.env.PORT || 5666;

server.listen(PORT, () => {
    console.log(`*** Server listening on port ${PORT} ***`)
})