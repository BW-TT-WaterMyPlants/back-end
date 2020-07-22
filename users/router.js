const router = require('express').Router()
const model = require('./model')

router.get('/', async (req, res, next) => {
    try {
        const users = await model.find()

        if (!users) {
            return res.status(404).json({
                message: 'no users found'
            })
        }

        return res.status(200).json(users)
    } catch (err) {
        next(err)
    }
})

module.exports = router