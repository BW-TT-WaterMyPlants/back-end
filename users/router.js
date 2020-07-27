const router = require('express').Router()
const Users = require('./model')
const Plants = require('../plants').model

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const getUserIdParam = require('./middleware/getUserIdParam')
const validateUsername = require('./middleware/validateUsername')
const validatePassword = require('./middleware/validatePassword')
const validateRegistration = require('./middleware/validateRegistrationRequest')
const verifyUsernameAvailability = require('./middleware/verifyUsernameAvailability')
const verifyPhoneNumberAvailability = require('./middleware/verifyPhoneNumberAvailability')
const authenticate = require('../server/middleware/authenticate')
const model = require('./model')

router.param('user_id', getUserIdParam())

router.route('/')
    .get(
        async (req, res, next) => {
            try {
                const users = await Users.find()

                if (!users) {
                    return res.status(404).json({
                        message: 'no users found'
                    })
                }

                return res.status(200).json({users})
            } catch (err) {
                next(err)
            }
        }
    )
    .post(
        validateRegistration(),
        verifyUsernameAvailability(),
        verifyPhoneNumberAvailability(),
        async (req, res, next) => {
            try {
                const newUser = await Users.add({
                    username: req.username,
                    password: await bcrypt.hash(req.password, 14),
                    phoneNumber: req.phoneNumber
                })
                return res.status(201).json({newUser})
            } catch (err) {
                next(err)
            }
        }
    )

router.route('/login')
    .post(
        validateUsername(),
        validatePassword(),
        (req, res, next) => {
            try {
                const user = req.user
                const payload = {
                    userId: user.id,
                    username: user.username,
                    phoneNumber: user.phoneNumber
                }
                const options = {
                    expiresIn: '1d'
                }
                const token = jwt.sign(payload, process.env.JWT_SECRET, options)
                return res.status(200).json({
                    user,
                    token,
                    message: 'login successful'
                })
            } catch (err) {
                next(err)
            }
        }
    )

router.route('/:user_id')
    // .all(authenticate())

module.exports = router