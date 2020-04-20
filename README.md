# APLICACIÓN WHALE'S

### ¿Qué es WHALE'S?
---
WHALE'S es una aplicación que nace en la compañia **WHALE'S Inc** ( Compañia de desarrollo de software ) esto surgue gracias a que la empresa para mejorar la comunicacion y la productividad de los empleados. Esta aplicación trata de la realizacion de un foro para realizar discusiones de los proyectos o temas de interes. Algo que también sera un punto a favor es la oportunidad que tienen los usuarios para consultar información o problemas resueltos previamente.




### Tabla de contenidos
---
- [Como empezar.](#start)
- [Trabajar con la aplicacón.](#work)


#### NOTAS:
Cabe mencionar que la aplicación no esta terminada asi que algunas funciones daran error.
  
  
<a name="start"></a>
### Como empezar
---

Una vez descargado el proyecto para comenzar a utilizarlo es necesario seguir algunos pasos:

* Iniciar cliente de MongoDB (mongod).

* Descargar dependecias.
>``` npm install ```

* Iniciar servidor 
> ``` npm run dev ``` ó ``` npm start``` 

* El servidor trabajará de manera local en la ruta http://localhost:3000/

<a name="work"></a>
### Trabajar con la aplicacion
---

La aplicación esta basada en el Modelo Vista Controlador y la forma en la que se diseño el sistema permite separar las rutas para obtener datos, de las rutas para interactuar con el usuario. De este modo tenemos rutas de una API que se encargan de brindar toda la información recibiendo parametros en especificos.

### Rutas de API

#### *Ruta de para registrar un usuario*
---

http://localhost:3000/api/register (POST) esta ruta permite registar un nuevo usuario mediante datos recibidos de un formulario.

**Notas**:  
Esta recoge los datos del body en un formato de *x-www-form-urlencoded*.  

Los parametros que recibe esta direccion son
```
name (NOMBRE)
surname (APELLIDOS)
email (CORREO)
password (CONTRASEÑA)
```

La respuesta que puede dar son:

> Exito
``` json
{
    "status" : "success",
    "user" : {
        "_id": "5c5adba567bdsaefa4353",
        "name": "Luis Angel",
        "surname": "Rios Rosales",
        "email": "angel@whaledev.com",
        "role": "ROLE_USER",
        "image": null,
        "__v": 0
    }
}
```

> Error Registrar un usuario registrado

``` json
{
    "status": "error",
    "message": "El usuario ya esta registrado"
}
```
> Error
``` json
{
    "status": "error",
    "message": "Upps! Tenemos algunos problemas",
    "errors": []
}
```

#### *Ruta de para el logeo de usuarios*
---

http://localhost:3000/api/login (POST) esta ruta permite iniciar sesión a un usuario mediante datos recibidos de un formulario.

**Notas**:  
Esta recoge los datos del body en un formato de *x-www-form-urlencoded*.  

Los parametros que recibe esta direccion son:
```
email (CORREO)
password (CONTRASEÑA)
token (True o False) *Con esto podemos obtener le token o los datos del usuario.
```

La respuesta que puede dar son:

> Exito sin la propiedad gettoken
``` json
{
    "status" : "success",
    "user" : {
        "_id": "5c5adba567bdsaefa4353",
        "name": "Luis Angel",
        "surname": "Rios Rosales",
        "email": "angel@whaledev.com",
        "role": "ROLE_USER",
        "image": null,
        "__v": 0
    }
}
```
> Exito con la propiedad gettoken
``` json
{
    "status" : "success",
    "token" : "ey324JHF6hdsgaHG6fdsJHFGDSmbkfjd78FjiufdsKJFHDA88FADSGKuhfk786fdsafd87aasslI9FAFAF"
}
```

> Error
``` json
{
    "status": "error",
    "message": "Upps! Tenemos algunos problemas",
    "errors": []
}
```
  

#### *Ruta de para actualizar un usuario*
---

http://localhost:3000/api/update (PUT) esta ruta permite actulizar un usuario mediante datos recibidos de un formulario.

**Notas**:  
Esta recoge los datos del body en un formato de *x-www-form-urlencoded*.  

Los parametros que recibe esta direccion son
```
name (NOMBRE)
surname (APELLIDOS)
email (CORREO)
password (CONTRASEÑA)
token
```

La respuesta que puede dar son:

> Exito
``` json
{
    "status" : "success",
    "user" : {
        "_id": "5c5adba567bdsaefa4353",
        "name": "Luis Angel",
        "surname": "Rios Rosales",
        "email": "angel1@whaledev.com",
        "role": "ROLE_USER",
        "image": null,
        "__v": 0
    }
}
```

> Error
``` json
{
    "status": "error",
    "message": "Upps! Tenemos algunos problemas",
    "errors": []
}
```



#### *Ruta de para subir avatar de un usuario*
---

http://localhost:3000/api/upload-avatar (POST) esta ruta permite subir un avatar a un usuario mediante datos recibidos de un formulario y cabe mencionar que se necesita el token del usuario para realizar esta operacion.

**Notas**:  
Esta recoge los datos del body en un formato de *form-data*.  

Los parametros que recibe esta direccion son:
```
file0 (ARCHIVO)
token
```

La respuesta que puede dar son:

> Exito
``` json
{
    "status" : "success",
    "user" : {
        "_id": "5c5adba567bdsaefa4353",
        "name": "Luis Angel",
        "surname": "Rios Rosales",
        "email": "angel@whaledev.com",
        "role": "ROLE_USER",
        "image": "osito-bebe.png",
        "__v": 0
    }
}
```
> Error no es imagen
``` json
{
    "status" : "error",
    "message" : "La extención del archivo no es valida"
}
```

> Error
``` json
{
    "status": "error",
    "message": "Upps! Tenemos algunos problemas",
    "errors": []
}
```


#### *Ruta de para obtener avatar*
---

http://localhost:3000/api/avatar/:fileName (GET) esta ruta permite obtener un avatar de un usuario mediante una url y cabe mencionar que se necesita el token del usuario para realizar esta operacion.


Los parametros que recibe esta direccion son:
```
token (ARCHIVO)
```

La respuesta que puede dar son:

> Exito
``` json
osito-bebe.png (Imagen)
```
> Error no hay imagen
``` json
{
    "status" : "error",
    "message" : "La imagen no existe"
}
```

> Error
``` json
{
    "status": "error",
    "message": "Upps! Tenemos algunos problemas",
    "errors": []
}
```

#### *Ruta de para obtener todos los usuario*
---

http://localhost:3000/api/users (GET) esta ruta permite obtener todos los usuarios en un json.

La respuesta que puede dar son:

> Exito
``` json
{
    "status":"success",
    "users":[
        {
            "_id":"5e441f16fda60d3df802fbe3",
            "name":"Julia",
            "surname":"Apolinares",
            "email":"julia@wewhaledev.com",
            "image":null,
            "__v":0
        },
        {
            "_id":"5e4420940db31317706d92d5",
            "name":"Luis Angel",
            "surname":"Rios Rosales",
            "email":"angel@wewhaledev.com",
            "image":null,
            "__v":0
        }
    ]
}
```

> Error
``` json
{
    "status": "error",
    "message": "Upps! Tenemos algunos problemas",
    "errors": []
}
```

#### *Ruta de para obtener un usuario*
---

http://localhost:3000/api/users/:userId (GET) esta ruta permite obtener el usuario cuya id mandan el la url.


> Exito
``` json
{
    "status":"success",
    "user": {
                "_id":"5e441f16fda60d3df802fbe3",
                "name":"Julia",
                "surname":"Apolinares",
                "email":"julia@wewhaledev.com",
                "image":null,
                "__v":0
     }
}
```

> Error
``` json
{
    "status": "error",
    "message": "Upps! Tenemos algunos problemas",
    "errors": []
}
```
