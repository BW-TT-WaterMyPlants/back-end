const Users = require('../model')

module.exports = () => async (req, res, next, userId) => {
    try {
        const user = await Users.findBy({id: userId}).first()

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