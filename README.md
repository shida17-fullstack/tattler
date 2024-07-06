# API CRUD Tattler

## Descripción

Una API RESTful para gestionar datos de restaurantes usando MongoDB, con operaciones CRUD y funcionalidad de importación, exportación y backup de datos, colecciones e índices. Las operaciones CRUD incluyen:

- **Crear:** Añadir nuevos restaurantes, usuarios y puntuaciones.
- **Obtener:** Mostrar detalles individuales de restaurantes, usuarios y puntuaciones, así como listas completas de ellos.
- **Obtener por ID:** Recuperar detalles específicos de restaurantes, usuarios y puntuaciones mediante su identificador único.
- **Actualizar:** Modificar la información de restaurantes, usuarios y puntuaciones existentes.
- **Eliminar:** Borrar restaurantes, usuarios y puntuaciones.
- **Buscar restaurantes:** Filtrar y encontrar restaurantes basados en diversos criterios como nombre, tipo de cocina y proximidad a la ubicación del usuario.

La API también utiliza coordenadas geográficas y el índice 2dsphere en las colecciones de usuarios y restaurantes entre otros indices, para permitir operaciones geoespaciales eficientes:

- **Coordenadas:** Almacena las ubicaciones de los usuarios y restaurantes utilizando campos de coordenadas.
- **Índice 2dsphere:** Implementado tanto en la colección de usuarios como en la de restaurantes para soportar consultas geoespaciales como encontrar restaurantes cercanos a la ubicación de un usuario.

## Características

- Gestión de usuarios, restaurantes y puntuaciones.
- Operaciones CRUD completas para cada entidad.
- Importación, exportación y backup de datos.
- Versionado de la API.
- Manejo de errores centralizado.

## Requisitos previos

- Node.js (versión utilizada: 20.15.0)
- MongoDB (versión utilizada: 7.0.11)

## Instalación

### 1. Clonar el repositorio

```sh 

git clone --branch crud-api-rest https://github.com/shida17-fullstack/tattler.git

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
## Estructura de Carpetas

```markdown

tattler
├── src
│   ├── bd
│   │   ├── backup_bd_completa
│   │   └── conexionMongoBD.js
│   ├── config
│   │   ├── .env
│   │   └── .env.example
│   ├── controllers
│   │   ├── puntuacionController.js
│   │   ├── restauranteController.js
│   │   └── usuarioController.js
│   ├── models
│   │   ├── puntuacionModel.js
│   │   ├── restauranteModel.js
│   │   └── usuarioModel.js
│   ├── node_modules
│   ├── services
│   │   ├── puntuacionService.js
│   │   ├── restauranteService.js
│   │   └── usuarioService.js
│   ├── utils
│   │   └── errorHandler.js
│   ├── v1
│   │   ├── routes
│   │   │   ├── puntuacionRoutes.js
│   │   │   ├── restauranteRoutes.js
│   │   │   └── usuarioRoutes.js
│   ├── app.js
│   └── server.js
├── .gitignore
├── LICENSE.md
├── package-lock.json
├── package.json
└── README.md


```

## Explicación de las Carpetas

- **src:** Directorio principal del código fuente del proyecto.
  - **bd:** Contiene los archivos relacionados con la base de datos.
    - **backup_bd_completa:** Incluye el backup completo de la base de datos de MongoDB.
    - **conexionMongoBD.js:** Archivo de configuración de la conexión a MongoDB.
  - **config:** Archivos de configuración del proyecto, incluyendo variables de entorno.
    - **.env**
    - **.env.example**
  - **controllers:** Controladores que manejan la lógica de las rutas.
    - **puntuacionController.js:** Controlador para las puntuaciones.
    - **restauranteController.js:** Controlador para los restaurantes.
    - **usuarioController.js:** Controlador para los usuarios.
  - **models:** Modelos de Mongoose para las colecciones de MongoDB.
    - **puntuacionModel.js:** Modelo para las puntuaciones.
    - **restauranteModel.js:** Modelo para los restaurantes.
    - **usuarioModel.js:** Modelo para los usuarios.
  - **node_modules:** Módulos de Node.js instalados.
  - **services:** Servicios que encapsulan la lógica de negocio.
    - **puntuacionService.js:** Servicio para las puntuaciones.
    - **restauranteService.js:** Servicio para los restaurantes.
    - **usuarioService.js:** Servicio para los usuarios.
  - **utils:** Utilidades y funciones auxiliares.
    - **errorHandler.js:** Manejo de errores.
  - **v1:** Versionado de la API.
    - **routes:** Definición de las rutas de la API.
      - **puntuacionRoutes.js:** Rutas para las puntuaciones.
      - **restauranteRoutes.js:** Rutas para los restaurantes.
      - **usuarioRoutes.js:** Rutas para los usuarios.
  - **app.js:** Archivo principal de configuración de la aplicación.
  - **server.js:** Servidor de la aplicación.
- **.gitignore:** Archivos y directorios que Git debe ignorar.
- **LICENSE.md:** Licencia del proyecto.
- **package-lock.json:** Archivo de bloqueo de versiones de dependencias.
- **package.json:** Archivo de configuración del proyecto y dependencias.
- **README.md:** Documento con información sobre el proyecto.

## Rama de Respaldo de la Base de Datos

Además de la rama `crud-api-rest`, existe una rama `backup-bd` en el repositorio que contiene la lógica de importación y exportación de archivos JSON y CSV para realizar un respaldo de una base de datos de MongoDB. 

Este respaldo fue actualizado de manera completa en la rama `crud-api-rest` para realizar las operaciones de CRUD. Si necesitas acceder a los datos de respaldo parciales, puedes cambiar a la rama `backup-bd` usando el siguiente comando:

```sh

git checkout backup-bd

```

## Uso

Iniciar el servidor

Para iniciar el servidor en modo desarrollo:


```bash

npm run dev 

```
Para iniciar el servidor en modo producción:

```bash

npm start

```


## Endpoints

### Rutas de Usuario

- **Crear un nuevo usuario:**
  - **Método:** POST
  - **URL:** `http://127.0.0.1/api/v1/usuarios`

- **Obtener todos los usuarios:**
  - **Método:** GET
  - **URL:** `http://127.0.0.1/api/v1/usuarios`

- **Obtener un usuario por ID:**
  - **Método:** GET
  - **URL:** `http://127.0.0.1/api/v1/usuarios/:id`

- **Actualizar un usuario por ID:**
  - **Método:** PUT
  - **URL:** `http://127.0.0.1/api/v1/usuarios/:id`

- **Eliminar un usuario por ID:**
  - **Método:** DELETE
  - **URL:** `http://127.0.0.1/api/v1/usuarios/:id`

### Rutas de Restaurante

- **Crear un nuevo restaurante:**
  - **Método:** POST
  - **URL:** `http://127.0.0.1/api/v1/restaurantes`

- **Obtener todos los restaurantes:**
  - **Método:** GET
  - **URL:** `http://127.0.0.1/api/v1/restaurantes`

- **Buscar restaurantes por usuario ID:**
  - **Método:** GET
  - **URL:** `http://127.0.0.1/api/v1/restaurantes/buscar/:usuarioId`

- **Obtener un restaurante por ID:**
  - **Método:** GET
  - **URL:** `http://127.0.0.1/api/v1/restaurantes/:id`

- **Actualizar un restaurante por ID:**
  - **Método:** PUT
  - **URL:** `http://127.0.0.1/api/v1/restaurantes/:id`

- **Eliminar un restaurante por ID:**
  - **Método:** DELETE
  - **URL:** `http://127.0.0.1/api/v1/restaurantes/:id`

### Rutas de Puntuación

- **Añadir una nueva puntuación:**
  - **Método:** POST
  - **URL:** `http://127.0.0.1/api/v1/puntuaciones`

- **Obtener todas las puntuaciones:**
  - **Método:** GET
  - **URL:** `http://127.0.0.1/api/v1/puntuaciones`

- **Obtener una puntuación por ID:**
  - **Método:** GET
  - **URL:** `http://127.0.0.1/api/v1/puntuaciones/:id`

- **Actualizar una puntuación por ID:**
  - **Método:** PUT
  - **URL:** `http://127.0.0.1/api/v1/puntuaciones/:id_restaurante/:usuario_id`

- **Eliminar una puntuación por ID:**
  - **Método:** DELETE
  - **URL:** `http://127.0.0.1/api/v1/puntuaciones/:id_puntuacion/:usuario_id`

## Licencia

Este proyecto está bajo la licencia especificada en LICENSE.md.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para mejorar el proyecto.

## Enlaces Útiles

- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Documentación de Node.js](https://nodejs.org/en/docs/)

## Autor

shida17-fullstack
