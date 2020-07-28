module.exports = () => async (req, res, next) => {
    try{
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({
                message: `missing required information`
            })
        }
        req.username = username
        req.password = password
        next()
    } catch (err) {
        next(err)
    }
}