# Desarrollá los endpoints para el sistema de reservas de habitación de un hotel.

#### CONDICIONES:
- Las reservas pueden tener 3 estados: Pendiente, Pagado y Eliminado.
- Los datos a almacenar para la reserva son: los detalles del cuarto reservado, los días de estadía, los datos de facturación e identificación del cliente, el monto pagado y el método de pago.
- Proponé los endpoints a crearse para tratar de cubrir el flujo normal de operación de reserva y explicar por qué, además de desarrollarlos.
  Luego que tengas ya todo el código
  -Crear un repositorio para la entrega del código y en un readme del repositorio la justificación de los endpoints creados

#### Tecnologías utilizadas
- Node
- Express
- Firebase

#### ENDPOINTS


* /api
    *   /rooms GET -> Necesario para obtener una lista de todos las habitaciones pertenecientes al hotel
        *  devuelve una coleccion de todos las habitaciones
        *   FLAGS: available (true | false) 
        *   en caso de available=true devuelve todos las habitaciones diponibles
        *   en caso de available=false devuelve todas las habitaciones ocupadas 
    *   /room/:id GET -> Necesario para obtener un detalle de una habitación en particular
        *   devuelve la habitacion a la cual pertenece el id
        *   (id puede ser id de documento o id de referencia "id_ref")


    *   /room POST -> Necesario para agregar habitaciones en caso de ampliación
        *   Agrega una nueva habitación con los datos recibidos por body(*)


    *   /room/:id PUT -> Necesario para modificar propiedades como precio, descripcion o habitaciones y máximo de personas en caso de remodelacion
        *   Modifica los datos de la habitación a la cual pertenece el id
        *   (en este caso id hace referencia al id del documento)

    *   /bookings    GET -> Necesario para obtener una lista de todas las reservas que ha recibido el hotel
        * devuelve una coleccion de todos las reservas
        * FLAGS: client_id=(num, documento de identidad) ^ status=("Pendiente" | "Pagado" | "Eliminado") (toma unicamente la primera)
    *   /booking/:id GET -> Necesario para verificar el estado y/o los datos de un cliente dada una reserva en particular
        * devuelve la reserva a la cual pertenece el id
    *   /booking/:id PUT -> Necesario para actualizar datos como estado, monto pagado, dias de reserva, etc
        * Modifica una reserva de ese id con los datos recibidos por body(**)
        * (En caso de modificar status a Eliminado, la habitacion cambia su status a libre)
    *   /booking     POST -> Necesario para crear nuevas reservas
        * Agrega una nueva reserva con los datos recibidos por body(**)

Ejemplo respuesta /booking/:id :
```javascript
{
  "phone": "5554664",
  "amount_paid": "150002",
  "client_id": "78741212",
  "status": "Eliminado",
  "email": "mail@email.com2",
  "payment_method": "Tarjeta2",
  "room_detail": {
    "bedrooms": "5",
    "id_ref": "1",
    "price": "15000",
    "maxPeople": "8",
    "detail": "Amplio espacioso y bello"
  },
  "zip": "3344",
  "days_booked": [
    2459392,
    2459393,
    2459394,
    2459395
  ],
  "address": "avenida siempre viva2",
  "client_name": "H J Thompson2"
}

```

Ejemplo respuesta /room/:id
```javascript 
[
  {
    "id": "4qJz49bBuAK2KP7wdNO7",
    "id_ref": "1",
    "bedrooms": "5",
    "price": "15000",
    "detail": "Amplio espacioso y bello",
    "status": "libre",
    "maxPeople": "8"
  }
]
```



##### notas
###### (*) body debe tener las propiedades id_ref(alphanum), detail(text), price(num), maxPeople(num), bedrooms(num), status("libre" | "ocupado")
###### (**) body debe tener obligatoriamente las propiedades client_id(num, documento de identidad) client_name(text) status("Pendiente" | "Pagado" | "Eliminado") day_in(aaaa/mm/dd o juliano) day_out(aaaa/mm/dd o juliano). Cuando status es Pagado payment_method(text) y amount_paid(num) son requeridos. Tambien recibe opcionalmente datos de facturacion address(text) email(text) phone(num) zip(num)


Hecho con :heart: