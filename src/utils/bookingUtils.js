const julian = require('julian')

const verifyData = (data) => {
  var error = ""
  if (!data){
    error = "No se han recibido suficientes datos"
    return {isValid: false, message: error}
  }
  const status = ['Pendiente', 'Pagado', 'Eliminado']
  const days_booked = []

  if (!data.client_id || !data.client_name || !data.status || !data.day_in || !data.day_out || !data.room_id){
    error = "Los campos client_id client_name status room_id day_in day_out son requeridos"
    return {isValid: false, message: error}
  }
  if (!status.includes(data.status)){
    error = "Status es un campo requerido "
    return {isValid: false, message: error}
  }
  if (data.status === "Pagado"){
    if(!data.payment_method || !data.amount_paid){
      error = "Cuando el estado es Pagado metodo de pago y monto de pago son requeridos"
      return {isValid: false, message: error}
    }
  }
  if (isNaN(data.day_in) || `${data.day_in}`.length != 7){
    data.day_in = parseInt(julian(new Date(data.day_in)).split('.')[0])
  }
  if (isNaN(data.day_out) || `${data.day_out}`.length != 7){
    data.day_out = parseInt(julian(new Date(data.day_out)).split('.')[0])
  }
  
  for (let i = data.day_in; i <= data.day_out; i++){
    days_booked.push(i)
  }

  let booking = {
    address: data.address || "",
    email: data.email || "",
    phone: data.phone || "",
    zip: data.zip || "",
    payment_method: data.payment_method || "",
    amount_paid: data.amount_paid || "",
    client_id: data.client_id,
    client_name: data.client_name,
    days_booked,
    status: data.status,
  }
  return {isValid: true, booking}
}

module.exports = {
  verifyData
}