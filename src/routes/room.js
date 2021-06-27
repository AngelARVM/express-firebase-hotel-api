const express = require('express')
const {addRoom, getAllRooms, getRoomById, updateRoom} = require('../controllers/roomController')

const router = express.Router()

// /Rooms
router.get('/rooms', getAllRooms)

// /Room
router.get('/room/:id', getRoomById)
router.put('/room/:id', updateRoom)
router.post('/room', addRoom)

module.exports = {
    routes: router
}