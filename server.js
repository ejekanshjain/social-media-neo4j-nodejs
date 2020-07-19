require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const port = process.env.PORT

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', require('./routes/routes'))

app.listen(port, console.log(`${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'} Server started on port ${port}...`))