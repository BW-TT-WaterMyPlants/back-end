const Users = require('../model')

module.exports = (failStatus = 401, failMessage = 'invalid login') => async (req, res, next) => {
    try {
        const username = req.username
        const user = await Users.findBy({username}).first()
        if (!user) {
            return res.status(failStatus).json({
                message: failMessage
            })
        }
        req.user = user
        next()
    } catch (err) {
        next(err)
    }
}