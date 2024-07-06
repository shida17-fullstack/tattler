# API CRUD Tattler - Backup de la Base de Datos inicial

Este proyecto contiene scripts y archivos necesarios para el respaldo, importación y exportación de datos de la base de datos de Tattler.

## Introducción

La API CRUD Tattler proporciona una interfaz para la gestión de datos de usuarios, restaurantes y puntuaciones, facilitando las operaciones de respaldo, importación y exportación de la base de datos de MongoDB.

## Requisitos previos

- Node.js (versión utilizada: 20.15.0)
- MongoDB (versión utilizada: 7.0.11)


## Instalación

### 1. Clonar el repositorio

```sh 

git clone --branch backup-bd https://github.com/shida17-fullstack/tattler.git

```
## Rama de Respaldo de la Base de Datos

Este respaldo fue actualizado de manera completa en la rama `crud-api-rest` para realizar las operaciones de CRUD. Si necesitas acceder a los datos de respaldo de la Base de Datos en MongoDB de manera completa, puedes cambiar a la rama `crud-api-rest` usando el siguiente comando:

```sh

git checkout crud-api-rest

```


### 2. Navegar al directorio del proyecto

```sh 

cd tattler

```

### 3. Instalar las dependencias conforme al archivo package.json

```bash

npm install 

```

### 4. Crear el archivo .env

Crea un archivo .env en la raíz del proyecto tomando como ejemplo .env.example con las siguientes variables de entorno:

```env

# .env.example

MONGODB_URI=tu-mongodb-uri
PORT=tu-preferido-puerto

```

## Estructura del Proyecto

```markdown

tattler
│
├── src
│   ├── app.js
│   ├── server.js
│   ├── bd
│   │   ├── backup_bd
│   │   │   ├── restaurantes.csv
│   │   │   ├── restaurantes.json
│   │   │   ├── tattler.puntuaciones.csv
│   │   │   ├── tattler.puntuaciones.json
│   │   │   ├── tattler.usuarios.json
│   │   │   └── usuarios.csv
│   │   ├── conexionMongoDB.js
│   │   ├── csv
│   │   │   ├── puntuaciones.csv
│   │   │   ├── restaurantes_nuevos.csv
│   │   │   ├── restaurantes.csv
│   │   │   └── usuarios.csv
│   │   └── json
│   │       ├── puntuaciones.json
│   │       ├── restaurantes.json
│   │       └── usuarios.json
│   ├── config
│   │   ├── .env
│   │   └── .env.example
│   ├── controllers
│   │   └── importController.js
│   ├── models
│   │   ├── puntuacionModel.js
│   │   ├── restauranteModel.js
│   │   └── usuarioModel.js
│   ├── services
│   │   └── importService.js
│   └── v1
│       └── routes
│           └── importRoutes.js
├── .gitignore
├── LICENSE.md
├── package-lock.json
└── package.json

```

## Explicación de las Carpetas

- **src**: Directorio principal del código fuente del proyecto.
  - **app.js**: Archivo principal de configuración de la aplicación.
  - **server.js**: Servidor de la aplicación.
  - **bd**: Contiene los archivos relacionados con la base de datos.
    - **backup_bd**: Archivos de respaldo de la base de datos inicial en MongoDB.
    - **conexionMongoDB.js**: Archivo de configuración de la conexión a MongoDB.
    - **csv**: Archivos CSV para la importación de datos.
    - **json**: Archivos JSON para la importación de datos.
  - **config**: Archivos de configuración del proyecto, incluyendo variables de entorno.
    - **.env**: Variables de entorno.
    - **.env.example**: Ejemplo de archivo de variables de entorno.
  - **controllers**: Controladores que manejan la lógica de las rutas.
    - **importController.js**: Controlador para la importación de datos.
  - **models**: Modelos de Mongoose para las colecciones de MongoDB.
    - **puntuacionModel.js**: Modelo para las puntuaciones.
    - **restauranteModel.js**: Modelo para los restaurantes.
    - **usuarioModel.js**: Modelo para los usuarios.
  - **services**: Servicios que encapsulan la lógica de negocio.
    - **importService.js**: Servicio para la importación de datos.
  - **v1**: Versionado de la API.
    - **routes**: Definición de las rutas de la API.
      - **importRoutes.js**: Rutas para la importación de datos.
- **.gitignore**: Archivos y directorios que Git debe ignorar.
- **LICENSE.md**: Licencia del proyecto.
- **package-lock.json**: Archivo de bloqueo de versiones de dependencias.
- **package.json**: Archivo de configuración del proyecto y dependencias.

## Uso

### Iniciar el servidor

Para iniciar el servidor en modo desarrollo:


```bash

npm run dev 

```
Para iniciar el servidor en modo producción:

```bash

npm start

```


### Importación de Datos

La importación de datos se puede realizar mediante la ruta `http://127.0.0.1:3000/api/v1/import`. La estructura de los datos se encuentra en los siguientes archivos:

- **Usuarios**: `src/bd/json/usuarios.json`, `src/bd/csv/usuarios.csv`
- **Restaurantes**: `src/bd/json/restaurantes.json`, `src/bd/csv/restaurantes_nuevos.csv`
- **Puntuaciones**: `src/bd/json/puntuaciones.json`, `src/bd/csv/puntuaciones.csv`

### Comando de Importación

Para importar los datos, se debe enviar una solicitud `POST` a la ruta `http://127.0.0.1:3000/api/v1/import`.

## Modelos de Datos

Los modelos de datos están definidos en la carpeta src/models e incluyen:

- puntuacionModel.js: Define el esquema y el modelo para las puntuaciones.
- restauranteModel.js: Define el esquema y el modelo para los restaurantes.
- usuarioModel.js: Define el esquema y el modelo para los usuarios.

## Contribuciones

Las contribuciones son bienvenidas. Para contribuir, sigue estos pasos:

- Haz un fork del repositorio.
- Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
- Haz tus cambios y haz commit (git commit -m 'Añadir nueva funcionalidad').
- Envía tus cambios al repositorio (git push origin feature/nueva-funcionalidad).
- Crea un Pull Request.

## Licencia
Este proyecto está licenciado bajo la LICENSE.md consultar para ver más detalles.

## Autor

shida17-fullstack
