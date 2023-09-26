# Sinteplast Construccion ecommerce
## Entrega final

### Railway url deployment

https://sinteplastecommercefinal-production.up.railway.app/


### URLS por router

#### Users router

##### "/" [GET]

Muestra el formulario de login

##### "/login" [GET]

Muestra el formulario de login

##### "/login" [POST]

Loguea al usuario y lo redirecciona a */products*.
El error lo devuelve a */login* con un mensaje de error

ejemplo de payload

```
{
  "email": "adminCoder@coder.com",
  "password": "adminCod3r123"
}
```

##### "/logout" [POST]

Cierra la sesión del usuario lo redirecciona a */login*.

##### "/register" [GET]

Muestra el formulario de registro.

##### "/register" [POST]

Registra un usuario y lo redirecciona a */products*.

ejemplo de payload

```
{
	"first_name": "Usuario",
	"last_name": "Basico",
	"email": "usuario%40premium.com",
	"age": "55",
	"password": "%25trrr%21dd",
}
```

El error lo devuelve a */register* con un mensaje de error

##### "/current" [GET]

Devuelve un objeto con los datos nos sensibles del usuario logueado.

ejemplo de respuesta
```
{
  "first_name": "Admin",
  "last_name": "Coder",
  "email": "adminCoder@coder.com",
  "age": 0,
  "role": "admin",
  "cart": null
}
```

##### "/registerAdmin" [GET]

Muestra el formulario de registro de usuarios para Administradores.

##### "/registerAdmin" [POST]

Registra un usuario y lo redirecciona a */registerAdmin*.

ejemplo de payload

```
{
	"first_name": "Usuario",
	"last_name": "Basico",
	"email": "usuario%40premium.com",
	"age": "55",
	"password": "%25trrr%21dd",
	"role": "admin"
}
```

El error lo devuelve a */registerAdmin* con un mensaje de error

##### "/users/:id" [GET]

Muestra el formulario de administración de roles y eliminación de usuarios para Administradores.

##### "/api/users/:id" [POST]

Actualiza el rol de un usuario y lo redirecciona a */users/:id*.

ejemplo de payload

```
{
	"role": "admin"
}
```

##### "/api/users/:id/delete" [POST]

Elimina un usuario y lo redirecciona a */users/:id*.

El error lo devuelve a */users/:id* con un mensaje de error

##### "api/users/" [GET]

Devuelve los datos basicos de los usuarios registrados

ejemplo de respuesta
```
{
  "docs": [
    {
      "first_name": "Admin",
      "last_name": "Coder",
      "email": "adminCoder@coder.com.ar",
      "role": "admin"
    },
    {
      "first_name": "Juan Martin",
      "last_name": "Socorro",
      "email": "jmsocorro@gmail.com",
      "role": "user"
    },
    {
      "first_name": "Usuario",
      "last_name": "Prueb",
      "email": "us@pueba.cc",
      "role": "user"
    },
    {
      "first_name": "Usuario",
      "last_name": "Premiun",
      "email": "usuario@premium.com",
      "role": "premium"
    },
    {
      "first_name": "Otro Usuario",
      "last_name": "Basico",
      "email": "otrousuario@basico",
      "role": "user"
    },
    {
      "first_name": "Otro Usuario",
      "last_name": "Premiun",
      "email": "otrousuario@premium.com",
      "role": "user"
    },
    {
      "first_name": "Juan Martín Socorro",
      "last_name": "jmsocorro",
      "email": "jsocorro@sismatica.net",
      "role": "user"
    }
  ],
  "totalDocs": 7,
  "limit": 10,
  "totalPages": 1,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```

##### "api/users/" [DELETE]

Elimina los usuarios sin actividad en las últimas 48 horas y devuelve una lista de los usuarios borrados. No elimina usuarios con rol **admin**

ejemplo de respuesta
```
{
  "docs": [
    {
      "first_name": "Otro Usuario",
      "last_name": "Premiun",
      "email": "otrousuario@premium.com",
      "role": "user"
    },
    {
      "first_name": "Juan Martín Socorro",
      "last_name": "jmsocorro",
      "email": "jsocorro@sismatica.net",
      "role": "user"
    }
  ],
  "totalDocs": 2,
  "limit": 10,
  "totalPages": 1,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```

##### "/reset" [GET]

Muestra el formulario para pedir el reestablecimiento la clave

##### "/reset" [POST]

Envia un mail al usuario con el token para completar el reestablecimiento y muestra un mensaje a */reset*.
El error lo devuelve a */reset* con un mensaje de error

ejemplo de payload

```
{
  "email": "adminCoder@coder.com",
}
```
##### "/reset/:token" [GET]

Muestra el formulario para reestablecer la clave

##### "/reset/:token" [POST]

Reestablece la clave y redirecciona a */login*.
El error lo devuelve a */reset/:token* con un mensaje de error

ejemplo de payload

```
{
  "email": "adminCoder@coder.com",
  "password": "adminCod3r123"
}
```


#### Carts router

##### "carts/" [GET]

Muestra una lista de todos los carros para usuarios **admin**

##### "carts/:cid" [GET]

Muestra el carro con el parametro *cid*

##### "carts/" [POST]

Agrega un carro vacio al usuario logueado

##### "carts/:cid/product/:pid" [GET]

Agrega un producto al carro y redirecciona a *carts/:cid*
El error muestra un mensaje de error en la vista que se encuentra

##### "carts/:cid" [DELETE]

Vacia el carro con el parametro *cid*

Ejemplo de response
```
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

##### "carts/:cid/product/:pid" [DELETE]

Elimina el producto *pid* el carro con el parametro *cid*

Ejemplo de response
```
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

##### "carts/:cid/product/:pid" [PUT]

Actualiza la cantidad del producto *pid* el carro con el parametro *cid*

Ejemplo de payload
```
{
  "qty": 1
}

```
Ejemplo de response
```
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

##### "carts/:cid/" [PUT]

Actualiza todos los productos del carro con el parametro *cid*

Ejemplo de payload
```
{
  "products": [
    {
      "product": {
        "_id": "646f88b5d0738d8d23e1798a",
        "title": "Membrana con Poliuretano",
        "description": "Impermeabilizante con poliuretano para cubiertas",
        "category": "Impermeabilizantes",
        "status": true,
        "thumbnails": [
          "membrana-poliuretanica-20kg-02.png"
        ],
        "code": "CODX000003",
        "stock": 1,
        "price": 1058.17
      },
      "quantity": 100
    },
    {
      "product": {
        "_id": "646f88b5d0738d8d23e179c6",
        "title": "Adhesivo Impermeable",
        "description": "Adhesivo para cerámicos, azulejos y piezas de media y alta\nabsorción.",
        "category": "Adhesivos",
        "status": true,
        "thumbnails": [
          "951.impermeable_bolsa_25kg-03.png"
        ],
        "code": "CODX000486",
        "stock": 90,
        "price": 5548.72
      },
      "quantity": 1
    }
  ]
}

```
Ejemplo de response
```
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

##### "carts/:cid/purchase" [GET]

Finaliza la compra y envia un email al usuario y redirecciona a *cartpurchase*.
Los productos sin stock quedan en el carro


