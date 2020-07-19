const express = require('express')

const router = express.Router()

router.get('/', (req, res) =>
    res.json({
        status: 200,
        success: true,
        message: 'Server Up and Running...'
    })
)

router.use('/api', require('./api'))

router.use('*', (req, res) =>
    res.status(404).json({
        status: 404,
        success: false,
        message: 'No resource exists here.'
    })
)

module.exports = router