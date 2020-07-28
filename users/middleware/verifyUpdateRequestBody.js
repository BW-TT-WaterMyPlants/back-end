const Users = require('../model')

module.exports = () => (req, res, next) => {
    try {
        const { phoneNumber, password, newPassword } = req.body

        if (!phoneNumber && !password && !newPassword) {
            return res.status(400).json({
                message: 'missing required information'
            })
        }

        if (password && !newPassword) {
            return res.status(400).json({
                message: 'missing required information'
            })
        }

        if (!password && newPassword) {
            return res.status(400).json({
                message: 'missing required information'
            })
        }

        req.phoneNumber = phoneNumber
        req.password = password
        req.newPassword = newPassword
        next()
    } catch (err) {
        next(err)
    }
}