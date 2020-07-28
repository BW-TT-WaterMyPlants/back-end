module.exports = () => async (req, res, next) => {
    try {
        const { nickname, species, h2oFrequency, imageUrl, lastWatered } = req.body

        req.plant = {
            nickname,
            species,
            h2oFrequency,
            imageUrl,
            lastWatered,
            userId: req.user.id
        }
        next()
    } catch (err) {
        next(err)
    }
}