const router = require('express').Router()
const Users = require('./model')
const Plants = require('../plants').model

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const checkPhoneNumberAvailability = require('./middleware/checkPhoneNumberAvailability')
const checkUsernameAvailability = require('./middleware/checkUsernameAvailability')
const getUserIdParam = require('./middleware/getUserIdParam')
const validateAuthToken = require('./middleware/validateAuthToken')
const validatePassword = require('./middleware/validatePassword')
const validateUsername = require('./middleware/validateUsername')
const verifyAddPlantRequestBody = require('./middleware/verifyAddPlantRequestBody')
const verifyLoginRequestBody = require('./middleware/verifyLoginRequestBody')
const verifyRegistrationRequestBody = require('./middleware/verifyRegistrationRequestBody')
const verifyUpdateRequestBody = require('./middleware/verifyUpdateRequestBody')

const SALT = 14

router.route('/')
    .get(async (req, res, next) => {
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
    })
    .post(verifyRegistrationRequestBody(), checkUsernameAvailability(),
          checkPhoneNumberAvailability(), async (req, res, next) => {
        try {
            const newUser = await Users.add({
                username: req.username,
                password: await bcrypt.hash(req.newPassword, SALT),
                phoneNumber: req.phoneNumber
            })
            return res.status(201).json({
                message: 'new user created successfully',
                newUser
            })
        } catch (err) {
            next(err)
        }
    })

router.route('/login')
    .post(verifyLoginRequestBody(), validateUsername(), validatePassword(), (req, res, next) => {
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
    })

router.param('userId', getUserIdParam())

router.route('/:userId')
    .all(validateAuthToken())
    .get((req, res, next) => {
        try {
            return res.status(200).json({
                message: 'user found',
                user:req.user
            })
        } catch (err) {
            next(err)
        }
    })
    .put(verifyUpdateRequestBody(), checkPhoneNumberAvailability(), validatePassword(), async (req, res, next) => {
        try {
            const [newPassword, phoneNumber] = [req.newPassword, req.phoneNumber]
            const changes = {}
            if (newPassword) {
                changes.password = await bcrypt.hash(newPassword, SALT)
            }
            if (phoneNumber) {
                changes.phoneNumber = phoneNumber
            }
            const user = await Users.update(changes, req.user.id)
            return res.status(200).json({
                message: 'update successful',
                user
            })
        } catch (err) {
            next(err)
        }
    })

router.route('/:userId/plants')
    .all(validateAuthToken())
    .get(async (req, res, next) => {
        try {
            const plants = await Plants.findBy({userId: req.user.id})
            if (!plants) {
                return res.status(200).json({
                    message: 'found 0 plants',
                    plants: []
                })
            }
            return res.status(200).json({
                message: `found ${plants.length} plants`,
                plants
            })
        } catch (err) {
            next(err)
        }
    })
    .post(verifyAddPlantRequestBody(), async (req, res, next) => {
        try {
            const plant = await Plants.add(req.plant)
            return res.status(201).json({
                message: 'plant added',
                plant
            })
        } catch (err) {
            next(err)
        }
    })

module.exports = router