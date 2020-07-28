const model = require("../model")
const bcrypt = require('bcryptjs')

module.exports = () => async (req, res, next) => {
    try {
        const password = req.password
        if (!password) {
            return next()
        }
        const passwordValid = await bcrypt.compare(password, req.user.password)
        if (!passwordValid) {
            return res.status(401).json({
                message: 'invalid login'
            })
        }
        req.passwordValid = passwordValid
        next()
    } catch (err) {
        next(err)
    }
}