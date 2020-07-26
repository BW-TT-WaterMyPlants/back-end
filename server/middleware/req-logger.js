module.exports = () => {
    return (req, res, next) => {
        console.log(
          `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}`
        )
        console.log("Token Header:", req.get('token'))
        console.log("Request Body:", req.body)
        next()
    }
}
