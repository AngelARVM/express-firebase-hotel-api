const express = require('express');
const router = express.Router();
const {getBookings, addBooking, getBookingById, updateBooking} = require('../controllers/bookingController')

// /bookings
router.get('/bookings', getBookings)

// /booking
router.get('/booking/:id', getBookingById)
router.put('/booking/:id', updateBooking)
router.post('/booking', addBooking)


module.exports = {
    routes: router
}