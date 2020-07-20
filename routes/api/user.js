const express = require('express')
const bcrypt = require('bcryptjs')

const { neo4j } = require('../../db')
const { RegisterUserSchema } = require('../../validation')

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const driver = neo4j.session()
        const validatedObj = await RegisterUserSchema.validateAsync(req.body)
        await driver.run('CREATE (u:USER {username: $username, name: $name, gender: $gender, dateOfBirth: datetime($dateOfBirth), email: $email, password: $password, createdAt: datetime($createdAt)})', {
            ...validatedObj,
            dateOfBirth: validatedObj.dateOfBirth.toISOString(),
            password: await bcrypt.hash(validatedObj.password, 10),
            createdAt: new Date().toISOString()
        })
        await driver.close()
        res.status(201).json({
            status: 201,
            success: true,
            message: 'Registration Successful!'
        })
    } catch (err) {
        if (err.name === 'ValidationError')
            return res.status(400).json({
                status: 400,
                success: false,
                message: err.message
            })
        if (err.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
            let message = 'Validation Error'
            if (err.message.includes('email'))
                message = 'Email already exists!'
            if (err.message.includes('username'))
                message = 'Username already exists!'
            return res.status(400).json({
                status: 400,
                success: false,
                message
            })
        }
        console.log(JSON.stringify(err))
        res.status(500).json({
            status: 500,
            success: false,
            message: err.toString()
        })
    }
})

router.post('/login', async (req, res) => {
    try {
    } catch (err) {
        console.log(err)
    }
})

module.exports = router