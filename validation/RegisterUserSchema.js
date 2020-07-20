const Joi = require('@hapi/joi')

module.exports = Joi.object({
    username: Joi.string().min(1).max(32).required(),
    name: Joi.string().min(1).required(),
    gender: Joi.string().equal('male', 'female', 'other').required(),
    dateOfBirth: Joi.date().required(),
    email: Joi.string().min(1).email().required(),
    password: Joi.string().min(1).required()
})