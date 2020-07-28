const Users = require('../model')

module.exports = (failStatus = 409, failMessage = 'phone number in use') => async (req, res, next) => {
    try {
        const phoneNumber = req.phoneNumber
        if (!phoneNumber) {
            return next()
        }
        const phoneTaken = await Users.findBy({phoneNumber}).first()
        // console.log('  phoneTaken:', (phoneTaken) ? true : false)
        if (phoneTaken) {
            return res.status(409).json({
                message: 'phone number unavailable'
            })
        }
        next()
    } catch (err) {
        next(err)
    }
}