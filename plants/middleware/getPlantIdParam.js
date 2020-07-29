const Plants = require('../model')

module.exports = () => async (req, res, next, plantId) => {
    try {
        const plant = await Plants.findBy({id: plantId}).first()

        if (!plant) {
            return res.status(404).json({
                message: `Plant not found`
            })
        }
        req.plant = plant
        next()
    } catch (err) {
        next(err)
    }
}
