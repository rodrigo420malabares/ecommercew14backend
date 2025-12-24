# 🔙 Workify Backend API

API RESTful construida con **Node.js** y **Express 5** para gestionar la lógica de negocio del e-commerce Workify. Esta API maneja autenticación segura, gestión de inventario, usuarios, recuperación de contraseñas por email y almacenamiento de imágenes en la nube.

## 🛠️ Stack Tecnológico

* **Runtime:** Node.js (Recomendado v20+ para soporte de `--watch` y `--env-file`).
* **Framework:** Express.js v5 (Beta/Next).
* **Base de Datos:** MongoDB & Mongoose v9.
* **Seguridad:**
    * `bcryptjs` para hasheo de contraseñas.
    * `jsonwebtoken` (JWT) para autenticación de sesiones.
    * `express-validator` para validación de datos entrantes.
* **Servicios Externos:**
    * **Cloudinary:** Gestión y optimización de imágenes.
    * **Nodemailer:** Envío de correos transaccionales (Recuperación de contraseña).

## ⚙️ Instalación y Configuración

1.  **Clonar el repositorio y navegar a la carpeta:**
    ```bash
    cd backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Variables de Entorno (.env):**
    Crear un archivo `.env` en la raíz de la carpeta `backend`.
    **Importante:** Este archivo contiene credenciales sensibles. NO subir a GitHub.

    Copia y pega la siguiente plantilla rellenando con tus datos reales:

    ```env
    # Configuración del Servidor
    PORT=8080

    # Base de Datos (MongoDB Atlas)
    MONGODB_CNN=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/workify_db

    # Seguridad (JWT)
    SECRETORPRIVATEKEY=tu_palabra_secreta_super_segura

    # Cloudinary (Imágenes)
    CLOUDINARY_CLOUD_NAME=tu_cloud_name
    API_KEY_CLOUDINARY=tu_api_key
    API_SECRET_CLOUDINARY=tu_api_secret

    # Nodemailer (Gmail App Password)
    EMAIL_USER=tu_email@gmail.com
    EMAIL_PASS=tu_password_de_aplicacion_google
    ```

## 🚀 Ejecución

Este proyecto utiliza las características nativas de las versiones recientes de Node.js.

* **Modo Desarrollo (con Watch Mode):**
    Recarga automática ante cambios y carga automática de variables de entorno.
    ```bash
    npm run dev
    ```

* **Modo Producción:**
    ```bash
    npm start
    ```

## 📡 Documentación de Endpoints

### 🔐 Autenticación (`/api/auth`)
* `POST /login`: Inicia sesión. Retorna usuario y Token.
* `GET /renew`: Renueva el token del usuario logueado.
* `POST /forgot-password`: Envía un correo con link de recuperación.
* `POST /reset-password`: Establece una nueva contraseña usando el token del correo.

### 👤 Usuarios (`/api/usuarios`)
* `GET /`: Obtener lista de usuarios (Soporta paginación `?desde=0&limite=5`).
* `GET /:id`: Obtener un usuario por ID.
* `POST /`: Registrar nuevo usuario (Rol por defecto: `usuario`).
* `PUT /:id`: Actualizar datos de usuario.
* `DELETE /:id`: Baja lógica (cambia estado a `false`).

### 📦 Productos (`/api/productos`)
* `GET /`: Listar productos (con paginación y populate de categoría/usuario).
* `GET /:id`: Ver detalle de producto.
* `POST /`: Crear producto (Sube imagen a Cloudinary automáticamente).
* `PUT /:id`: Actualizar producto (Si se envía imagen nueva, borra la anterior de Cloudinary).
* `DELETE /:id`: Baja lógica del producto.

### 📂 Categorías (`/api/categorias`)
* `GET /`: Listar todas las categorías.
* `GET /:id`: Obtener una categoría específica.
* `POST /`: Crear categoría (Valida que no exista previamente).
* `PUT /:id`: Editar nombre de categoría.
* `DELETE /:id`: Baja lógica de categoría.

### 🔍 Buscador (`/api/buscar`)
* `GET /productos/:termino`: Busca productos por coincidencia en **nombre** o **descripción** (Regex case-insensitive). También acepta búsqueda por ID de Mongo.

## 📂 Estructura del Proyecto

```text
backend/
├── controllers/    # Lógica de negocio (funciones de cada ruta)
├── database/       # Configuración de conexión a MongoDB
├── helpers/        # Utilidades (JWT, Nodemailer, Validadores)
├── middlewares/    # Validaciones intermedias (Auth, Roles, Campos)
├── models/         # Esquemas de datos (Mongoose)
├── routes/         # Definición de rutas de la API
├── index.js        # Punto de entrada del servidor
└── package.json    # Dependencias y scripts


---
Desarrollado por **Rodrigo Oscar Galarza** - 2025