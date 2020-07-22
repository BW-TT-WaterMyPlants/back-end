const model = require('../model')

module.exports = () => async (req, res, next) => {
    const username = req.body.username
    const user = await model.findBy({username}).first()

    if (user) {
        req.user = user
        next()
    }

    next()
}