const firebase = require('../../db')
const firestore = firebase.firestore()
const {verifyData} = require('../utils/bookingUtils')
const querys = ['client_id', 'status']
const getBookings = async (req, res, next) => {
  try {
    let {query} = req
    query = Object.entries(query)[0]
    let result = []
    await firestore.collection('bookings').get().then(docs => docs.forEach(doc => result.push({...doc.data(), id:doc.id})))

    if(query?.length && querys.includes(query[0])){
      result = result.filter(booking => booking[query[0]] == query[1])
    }

    return res.send(result)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const addBooking = async (req, res, next) => {
  try {
    const booking = req.body
    const validation = verifyData(booking)
    
    if(!validation.isValid){
      return res.status(400).send(validation.message)
    }

    let room = await firestore.collection('rooms').doc(booking.room_id).get()
    room = room.data()
    if (room.status == "libre" ){
      validation.booking.room_detail = room
      
      if(validation.booking.status !== "Eliminado"){
        await firestore.collection('rooms').doc(booking.room_id).update({...room, status: "ocupado"})
      }
      delete validation.booking.status
      
      await firestore.collection('bookings').doc().set(validation.booking)
      return res.status(201).send('Reserva creada')
    } 

    return res.status(400).send('No existe la habitacion o está ocupada.')
  } catch (error){
    console.log(error.message)
    res.status(400).send(error.message)
  }
}

const getBookingById = async (req, res, next) => {
  try {
    const {id} = req.params
    const booking =await firestore.collection('bookings').doc(id).get()
    return res.send(booking.data())
  } catch (error) {
    res.status(400).send(error.message)
  }
}


const updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = req.body
    delete updatedBooking.id
    const {id} = req.params
    const validation = verifyData(updatedBooking)

    if(!validation.isValid){
      return res.status(400).send(validation.message)
    }

    if (validation.booking.status === "Eliminado"){
      const oldBooking =  await firestore.collection('bookings').doc(id).get()
      const id_ref = oldBooking.data().room_detail.id_ref
      const room = []
      await firestore.collection('rooms').where('id_ref', '==', id_ref).get().then(docs => docs.forEach(data => room.push({id: data.id,...data.data()})))
  
      if (!room[0]){
        return res.sendStatus(400)
      }
      
      let room_id = room[0].id
      
      delete room[0].id
      
      await firestore.collection('rooms').doc(room_id).update({...room[0],status: "libre"})
      delete room[0].status
      await firestore.collection('bookings').doc(id).update({...validation.booking,room_detail: room[0]})

      return res.send("Reserva eliminada existosamente")
    }

    await firestore.collection('bookings').doc().set(validation.booking)
    return res.send("Reserva modificada existosamente")

  } catch (error) {
    res.status(400).send(error.message)
  }
}

module.exports = {
  getBookings,
  addBooking,
  getBookingById,    
  updateBooking
}