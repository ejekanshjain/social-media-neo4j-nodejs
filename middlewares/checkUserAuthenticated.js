const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token)
        return res.status(401).json({
            status: 401,
            success: false,
            message: 'Authorization Token is required in Header!'
        })
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        return next()
    } catch (err) {
        return res.status(401).json({
            status: 401,
            success: false,
            message: 'Invalid Authorization Token'
        })
    }
}