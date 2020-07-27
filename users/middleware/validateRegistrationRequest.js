module.exports = () => (req, res, next) => {
    try{
        const { username, password, phoneNumber } = req.body
        if (!username || !password || !phoneNumber) {
            return res.status(400).json({
                message: `missing required information`
            })
        }
        req.username = username
        req.password = password
        req.phoneNumber = phoneNumber
        next()
    } catch (err) {
        next(err)
    }
}