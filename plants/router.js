const router = require('express').Router()
const model = require('./model')

const authenticate = require('../server/middleware/authenticate')
const verifyUserId = require('../server/middleware/verifyUserId')

router.get('/:id', authenticate(), verifyUserId(), async (req, res, next) => {
    try {
        const plant = await model.findById(req.params.id)

        if (!plant) {
            return res.status(404).json({
                message: 'Plant not found'
            })
        }

        return res.status(200).json(plant)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', authenticate(), verifyUserId(), async (req, res, next) => {
  try {
    const plant = await model.findById(req.params.id)

    if (!plant) {
        return res.status(401).json({
            message: 'Plant not found'
        })
    }

<<<<<<< HEAD
    let {token, nickname, species, h2oFrequency, h2oTime} = req.body

    if (!nickname) { nickname = plant.nickname }
    if (!species) { species = plant.species }
    if (!h2oFrequency) { h2oFrequency = plant.h2oFrequency }
    if (!h2oTime) { h2oTime = plant.h2oTime }

    const updatedPlant = await model.update(req.params.id, {nickname, species, h2oFrequency, h2oTime})

    return res.status(200).json(updatedPlant)
  } catch (err) {
    next(err)
=======
    const updatedPlant = await model.update(req.params.id, req.body)
    return res.status(200).json(updatedPlant)
  } catch (err) {
      next(err)
>>>>>>> eric-dev
  }
})

router.delete('/:id', authenticate(), verifyUserId(), async (req, res, next) => {
    try {
        const plant = await model.findById(req.params.id)

        if (!plant) {
            return res.status(401).json({
                message: 'Plant not found'
            })
        }

<<<<<<< HEAD
        const success = await model.remove(req.params.id)
        if (success===1) {
          return res.status(200).json({message: 'Plant removed'})
        }
=======
        const message = await model.remove(req.params.id)

        return res.status(200).json(message)

>>>>>>> eric-dev
    } catch (err) {
        next(err)
    }
})

module.exports = router
