const router = require('express').Router()
const model = {
    users: require('./model'),
    plants: require('../plants').model
}
const db = require('../database/config')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authenticate = require('../server/middleware/authenticate')
const verifyUserId = require('../server/middleware/verifyUserId')
const nodemon = require('nodemon')

router.get('/', async (req, res, next) => {
    try {
        const users = await model.users.find()

        if (!users) {
            return res.status(404).json({
                message: 'no users found'
            })
        }

        return res.status(200).json({users})
    } catch (err) {
        next(err)
    }
})

router.get('/:id', authenitcate(), verifyUserId(), async (req, res, next) => {
    try {
        const user = await model.users.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        return res.status(200).json({user})
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { username, password, phoneNumber } = req.body

        const user = await model.users.findBy({username}).first()

        if (user) {
            return res.status(409).json({
                message: 'username unavailable'
            })
        }

        //  Password Validation

        const phoneTaken = await model.users.findBy({phoneNumber}).first()

        if (phoneTaken) {
            return res.status(409).json({
                message: 'phone number in use'
            })
        }

        const userToAdd = {
            username,
            password: await bcrypt.hash(password, 14),
            phoneNumber
        }

        const newUser = await model.users.add(userToAdd)

        return res.status(201).json(newUser)
    } catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await model.users.findBy({username}).first()

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

router.put('/:id', authenticate(), verifyUserId(),  async (req, res, next) => {
    try {
        const user = await model.users.findBy({id: req.params.id})

        if (!user) {
            return req.status(404).json({
                message: 'invalid user'
            })
        }

        const changes = {}

        if (req.body.newPassword && req.body.password) {

            const passwordValid = await bcrypt.compare(req.body.password, user[0].password)

            if (!passwordValid) {
                return req.status(401).json({
                    message: 'invalid password'
                })
            }

            changes.password = await bcrypt.hash(req.body.newPassword, 14)

        } else if (!req.body.newPassword && req.body.password) {

            return req.status(400).json({
                message: 'missing newPassword'
            })

        } else if (req.body.newPassword && !req.body.password) {

            return req.status(400).json({
                message: 'missing password'
            })

        }

        if (req.body.phoneNumber) {

            const phoneTaken = await model.users.findBy({phoneNumber: req.body.phoneNumber}).first()

            if (phoneTaken) {
                return res.status(409).json({
                    message: 'phone number in-use'
                })
            }

            changes.phoneNumber = req.body.phoneNumber

        }

        const updatedUser = await model.users.update(changes, req.params.id)

        res.status(200).json({
            user: updatedUser
        })


    } catch (err) {
        next(err)
    }
})

router.get('/:id/plants', authenticate(), verifyUserId(), async (req, res, next) => {
    try {
        const plants = await model.plants.findBy({user_id: req.params.id})
        if (!plants) {
            return res.status(200).json({
                plants: []
            })
        }
        res.status(200).json({
            plants
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router
