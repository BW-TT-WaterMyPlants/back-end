module.exports = () => async (req, res, next) => {
    try {
        if (req.token.userId !== req.plant.userId) {
            return res.status(403).json({
                message: `Unauthorized`
            })
        }

        next()
    } catch (err) {
        next(err)
    }
}
