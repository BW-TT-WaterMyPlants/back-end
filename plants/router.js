const router = require('express').Router()
const model = require('./model')

const authenticate = require('../server/middleware/authenticate')

router.get('/:id', authenticate(), async (req, res, next) => {
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

router.post('/', authenticate(), async (req, res, next) => {
    try {
        const plant = await model.add(req.body)

        return res.status(201).json(newPlant)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', authenticate(), async (req, res, next) => {
  try {
    const plant = await model.findById(req.params.id)

    if (!plant) {
        return res.status(401).json({
            message: 'Plant not found'
        })
    }

    let {token, nickname, species, h2oFrequency, h2oTime} = req.body

    if (!nickname) { nickname = plant.nickname }
    if (!species) { species = plant.species }
    if (!h2oFrequency) { h2oFrequency = plant.h2oFrequency }
    if (!h2oTime) { h2oTime = plant.h2oTime }

    const updatedPlant = await model.update(req.params.id, {nickname, species, h2oFrequency, h2oTime})

    return res.status(200).json(updatedPlant)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate(), async (req, res, next) => {
    try {
        const plant = await model.findById(req.params.id)

        if (!plant) {
            return res.status(401).json({
                message: 'Plant not found'
            })
        }

        const success = await model.remove(req.params.id)
        if (success===1) {
          return res.status(200).json({message: 'Plant removed'})
        }
    } catch (err) {
        next(err)
    }
})

module.exports = router
