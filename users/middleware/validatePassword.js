const model = require("../model")
const bcrypt = require('bcryptjs')

module.exports = (failStatus = 401, failMessage = 'invalid login') => async (req, res, next) => {
    try {
        const {password} = req.body
        const passwordValid = await bcrypt.compare(password, req.user.password)
        if (!passwordValid) {
            return res.status(failStatus).json({
                message: failMessage
            })
        }
        req.passwordValid = passwordValid
        next()
    } catch (err) {
        next(err)
    }
}