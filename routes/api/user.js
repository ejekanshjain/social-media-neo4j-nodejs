const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { neo4j } = require('../../db')
const { RegisterUserSchema, LoginUserSchema } = require('../../validation')
const { transformUser } = require('../../util')

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const driver = neo4j.session()
        const validatedObj = await RegisterUserSchema.validateAsync(req.body)
        await driver.run('CREATE (u:USER {username: $username, name: $name, gender: $gender, dateOfBirth: $dateOfBirth, email: $email, password: $password, createdAt: $createdAt})', {
            ...validatedObj,
            dateOfBirth: validatedObj.dateOfBirth.getTime(),
            password: await bcrypt.hash(validatedObj.password, 10),
            createdAt: Date.now()
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
        console.log(err)
        res.status(500).json({
            status: 500,
            success: false,
            message: err.toString()
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const driver = neo4j.session()
        const validatedObj = await LoginUserSchema.validateAsync(req.body)
        const result = await driver.run('MATCH (user:USER {username: $username}) RETURN user{id: ID(user), .username, .name, .gender, .dateOfBirth, .email, .password, .profileImage, .createdAt}', {
            username: validatedObj.username
        })
        await driver.close()
        if (!result.records.length)
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invlid username or password'
            })
        if (!(await bcrypt.compare(validatedObj.password, result.records[0].get('user').password)))
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invlid username or password'
            })
        const user = transformUser(result.records[0].get('user'))
        res.json({
            status: 200,
            success: true,
            message: 'Login Successful',
            data: {
                user,
                token: jwt.sign({ id: user.id }, process.env.JWT_SECRET)
            }
        })
    } catch (err) {
        if (err.name === 'ValidationError')
            return res.status(400).json({
                status: 400,
                success: false,
                message: err.message
            })
        console.log(err)
        res.status(500).json({
            status: 500,
            success: false,
            message: err.toString()
        })
    }
})

module.exports = router