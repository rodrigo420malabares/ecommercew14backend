const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {

        this.app = express();
        this.port = process.env.PORT || 3000;
        this.authPath = '/api/auth'
        this.usuariosPath = '/api/usuarios';        
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.buscarPath = '/api/buscar'
        

        //Conectar con la base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Funcion para las rutas

        this.routes();

    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Leer lo que el usuario envia por el cuerpo de la peticion
        this.app.use(express.json());

        //Definir la carpeta publica
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.categoriasPath, require('../routes/categorias'));
        this.app.use(this.productosPath, require('../routes/productos'));
      this.app.use(this.buscarPath, require('../routes/buscador'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server online port: ', this.port);
        })
    }
}


module.exports = Server;