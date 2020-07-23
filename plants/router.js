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

    const updatedPlant = await model.update(req.params.id, req.body)

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

        const message = await model.remove(req.params.id)

        return res.status(200).json(message)
    } catch (err) {
        next(err)
    }
})

module.exports = router
