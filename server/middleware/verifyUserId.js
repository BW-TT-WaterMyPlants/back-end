const plantsModel = require('../../plants/model')

module.exports = () => async (req, res, next) => {
    try {
        const plant = await plantsModel.findById(req.params.id)

        if (!plant) {
          return res.status(404).json({
            message: 'Plant not found'
          })
        }
        
        console.log('req.token:', req.token)

        if (plant.user_id !== req.token.userId) {
          return res.status(401).json({
              message: 'Unauthorized'
          })
        }

        next()

    } catch (err) {
        next(err)
    }
}
