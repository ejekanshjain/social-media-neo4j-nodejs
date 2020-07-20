const express = require('express')

const router = express.Router()

router.get('/', (req, res) =>
    res.json({
        status: 200,
        success: true,
        message: 'API Server Up and Running...'
    })
)

router.use('/user', require('./user'))

module.exports = router