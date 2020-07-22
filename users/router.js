const router = require('express').Router()
const model = require('./model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authenticate = require('../server/middleware/authenticate')

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

router.get('/:id', async (req, res, next) => {
    try {
        const user = await model.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        return res.status(200).json(user)
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { username, password, phoneNumber } = req.body

        const user = await model.findBy({username}).first()

        if (user) {
            return res.status(409).json({
                message: 'username unavailable'
            })
        }

        // TODO: Password Validation

        const phoneTaken = await model.findBy({phoneNumber}).first()

        if (phoneTaken) {
            return res.status(409).json({
                message: 'phone number in use'
            })
        }

        const newUser = await model.add({
            username,
            password: await bcrypt.hash(password, 14),
            phoneNumber
        })

        return res.status(201).json(newUser)
    } catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await model.findBy({username}).first()

        if (!user) {
            return res.status(401).json({
                message: 'invalid login'
            })
        }

        const passwordValid = await bcrypt.compare(password, user.password)

        if (!passwordValid) {
            return res.status(401).json({
                message: 'invalid login'
            })
        }

        const payload = {
            userId: user.id,
            username: user.username,
            phoneNumber: user.phoneNumber
        }

        const options = {
            expiresIn: '1d'
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, options)

        res.status(200).json({
            message: `${user.username} logged in`,
            token
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router