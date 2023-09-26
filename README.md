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


