const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config')

const roomsRoutes = require('./src/routes/room')
const bookingsRoutes = require('./src/routes/booking')

const app = express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

app.use('/api', roomsRoutes.routes)
app.use('/api', bookingsRoutes.routes)

app.listen(config.port, () => console.log('Server listening at', config.host, config.port))