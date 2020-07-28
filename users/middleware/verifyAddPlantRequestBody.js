module.exports = () => async (req, res, next) => {
    try {
        const { nickname, species, h2oFrequency, imageUrl, lastWatered } = req.body

        req.plant = {
            nickname: nickname,
            species: species,
            h2oFrequency: h2oFrequency,
            imageUrl: imageUrl,
            lastWatered: (lastWatered) ? Date(lastWatered) : lastWatered,
            userId: req.user.id
        }
        next()
    } catch (err) {
        next(err)
    }
}