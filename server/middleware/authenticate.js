const jwt = require('jsonwebtoken')

module.exports = () => (req, res, next) => {
    const authError = {
        message: 'unauthorized'
    }

    try {
        const token = req.get('token')
        console.log(token)
        
        if (!token) {
            return res.status(401).json(authError)
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json(authError)
            }
            req.token = decoded
            next()
        })
    } catch (err) {
        next(err)
    }
}
