const router = require('express').Router()
const model = require('./model')

const authenticate = require('../server/middleware/authenticate')
const verifyUserId = require('../server/middleware/verifyUserId')

router.get('/', async (req, res, next) => {
    try {
        const plants = await model.find()

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
    let {token, nickname, species, h2oFrequency, h2oTime, image_url, watered_at, next_watering} = req.body

    if (!nickname) { nickname = "Unnamed Plant" }
    if (!species) { species = "" }
    if (!h2oFrequency) { h2oFrequency = 1 }
    if (!h2oTime) { h2oTime = '12:00' }
    if (!image_url) {
        image_url = "https://bitsofco.de/content/images/2018/12/broken-1.png"
    }
    if (!watered_at) {
      const watered_at = new Date(Date.now())
    }
    if (!next_watering) {
      next_watering = new Date(Date.now())
      next_watering.setDate(next_watering.getDate() + h2oFrequency);
      const hours = parseInt(h2oTime.slice(0,2))
      const minutes = parseInt(h2oTime.slice(3))
      next_watering.setHours(hours,minutes);
    }


    const user_id = req.token.userId

    const plant = await model.add({nickname, species, h2oFrequency, h2oTime, image_url, user_id, watered_at, next_watering})

    return res.status(200).json(plant)
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


    const { token, ...updates } = req.body

    const updatedPlant = await model.update(req.params.id, {...plant, ...updates})
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

router.patch('/:id/water', authenticate(), async (req, res, next) => {
  try {
    const plant = await model.findById(req.params.id)

    if (!plant) {
        return res.status(401).json({
            message: 'Plant not found'
        })
    }

    const watered_at = new Date(Date.now())

    let next_watering = new Date(Date.now())
    next_watering.setDate(next_watering.getDate() + plant.h2oFrequency)
    const hours = parseInt(plant.h2oTime.slice(0,2))
    const minutes = parseInt(plant.h2oTime.slice(3))
    next_watering.setHours(hours,minutes);


    const updatedPlant = await model.update(req.params.id, {...plant, watered_at, next_watering })

    return res.status(200).json(updatedPlant)


  } catch (err) {
    next(err)
  }
})

module.exports = router
