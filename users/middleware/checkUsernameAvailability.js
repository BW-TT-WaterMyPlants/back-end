const Users = require("../model")

module.exports = () => async (req, res, next) => {
    try {
        const username = req.username
        const user = await Users.findBy({username}).first()
        if (user) {
            return res.status(409).json({
                message: 'username unavailable'
            })
        }
        next()
    } catch (err) {
        next(err)
    }
}