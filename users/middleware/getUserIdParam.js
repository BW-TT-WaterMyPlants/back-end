const Users = require('../model')

module.exports = () => async (req, res, next, user_id) => {
    try {
        const user = Users.findById(user_id)

        if (!user) {
            return res.status(404).json({
                message: `user not found`
            })
        }
        req.user = user
        next()
    } catch (err) {
        next(err)
    }
}