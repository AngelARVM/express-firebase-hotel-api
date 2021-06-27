const firebase = require('../../db')
const Room = require('../models/room')
const firestore = firebase.firestore()
const status =["libre", "ocupado"]

const addRoom = async (req, res, next) => {
    try{
        const newRoom = req.body

        if(!status.includes(newRoom.status)){
          return res.status(400).send('El status de la habitacion solo puede ser "libre" u "ocupado"')
        }

        await firestore.collection('rooms').doc().set(newRoom)
        res.status(201).send('Habitación agregada.')
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const getAllRooms = async (req, res, next) => {
  try {
    const { available } = req.query
    const result = []

    if (available !== undefined){
      await firestore.collection('rooms').where("status", "==", (eval(available) ? "libre" : "ocupado")).get()
        .then(docs => docs.forEach(doc => result.push({...doc.data(), id:doc.id})))
      return res.send(result)
    } else {
      await firestore.collection('rooms').get().then(docs => docs.forEach(doc => result.push({...doc.data(), id:doc.id})))
      return res.send(result)
    }
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const getRoomById = async (req, res, next) => {
  try {
    const {id} = req.params
    if (isNaN(id)){
      const result =  await firestore.collection('rooms').doc(id).get()
      if (!result.data()){
        return res.sendStatus(404)
      }
      return res.send([{id: result.id, ...result.data()}])
    }

    const result = []
    await firestore.collection('rooms').where('id_ref', "==", id).get()
      .then(docs => docs.forEach(e => result.push(e.data())))

    if(!result[0]){
      return res.sendStatus(404)
    }
    return res.send(result)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = req.body
    delete updatedRoom.id
    const {id} = req.params

    if(!status.includes(updatedRoom.status)){
      return res.status(400).send('El status de la habitacion solo puede ser "libre" u "ocupado"')
    }

    const room =  await firestore.collection('rooms').doc(id).get()
    if (!room.data()){
      return res.sendStatus(400)
    }

    await firestore.collection('rooms').doc(id).update(updatedRoom)
    return res.send('room updated')

  } catch (error) {
    res.status(400).send(error.message)
  }
  
}

module.exports = {
    addRoom,
    getAllRooms,
    getRoomById,
    updateRoom
}