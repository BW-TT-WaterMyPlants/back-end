const router = require('express').Router()
const Plants = require('./model')

const getPlantIdParam = require('./middleware/getPlantIdParam')
const validateAuthToken = require('./middleware/validateAuthToken')
const validatePlantUser = require('./middleware/validatePlantUser')

router.route('/')
  .get(async (req, res, next) => {
    try {
        const plants = await Plants.find()

        if (!plants) {
            return res.status(404).json({
                message: 'No plants found'
            })
        }

        return res.status(200).json(plants)
    } catch (err) {
        next(err)
    }
})

router.param('plantId', getPlantIdParam())

router.route('/:plantId')
  .all(validateAuthToken(),validatePlantUser())
  .get(async (req, res, next) => {
      try {
          return res.status(200).json({
              message: 'Plant found',
              plant:req.plant
          })
      } catch (err) {
          next(err)
      }
})
  .put(async (req, res, next) => {
    try {
      const plant = await Plants.update(req.plant.id, req.body)
      return res.status(200).json({
          message: 'update successful',
          plant: plant
      })
    } catch (err) {
      next(err)
    }
  })
  .patch(async(req, res, next) => {
    try {
      let lastWatered = new Date(Date.now()).toISOString()
      if (req.body && req.body.lastWatered) {
        lastWatered = req.body.lastWatered
      }
      const plant = await Plants.update(req.plant.id, {lastWatered: lastWatered})
      return res.status(200).json({
          message: 'update successful',
          plant: plant
      })
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
        const success = await Plants.remove(req.plant.id)
        if (success===1) {
          return res.status(200).json({message: 'Plant removed'})
        }
    } catch (err) {
        next(err)
    }
  })


module.exports = router
