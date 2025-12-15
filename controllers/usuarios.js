const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs')
const { body } = require('express-validator');

const usuarioGet = async (req = request, res = response) => {
    const { desde = 0, limite = 5 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(desde).limit(limite)
    ]);


    res.json({
        mensaje: 'Usuarios obtenidos',
        total,
        usuarios
    });
};


const usuarioGetId = async (req = request, res = response) => {
    const { id } = req.params;

    const usuario = await Usuario.findById(id);

    res.json({
        mensaje: 'Usuario obtenido',
        usuario
    })
};


const usuarioPost = async (req = request, res = response) => {
    //Recibir el cuerpo de la peticion
    const datos = req.body;

    const { nombre, apellido, correo, password, rol } = datos;
    const usuario = new Usuario({ nombre, apellido, correo, password, rol })
    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    usuario.password = hash;
    //Guardar los datos en la base de datos
    await usuario.save();


    res.json({
        mensaje: 'Usuario cargado correctamente',
        usuario
    })

};

const usuarioPut = async (req = request, res = response) => {
    const { id } = req.params;

    //Obtener datos para actualizar
    const { password, correo, ...resto } = req.body;
    //Si actualiza el password, debo encriptarlo
    if(password){
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt)
    }
    //Modificacion de datos
    
    resto.correo = correo;
    //Buscar el usuario y actualizarlo
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });


    res.json({
        mensaje: 'Usuario actualizado correctamente',
        usuario
    })

}



const usuarioDelete = async (req = request, res = response) => {
    const { id } = req.params;

    //Eliminacion del registro fisicamente
    // const usuarioBorrado = await Usuario.findByIdAndDelete(id);

    //Eliminacion logica o cambio de estado o false
    const usuario = await Usuario.findById(id);

    if (!usuario.estado) {
        return res.json({
            mensaje: 'Usuario no existe!'
        })
    }

    const usuarioInhabilitado = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });


    res.json({
        // mensaje: 'Usuario eliminado exitosamente',
        // usuarioBorrado
        mensaje: 'Usuario inhabilitado exitosamente!',
        usuarioInhabilitado
    })
};


module.exports = {
    usuarioGet,
    usuarioGetId,
    usuarioPost,
    usuarioPut,
    usuarioDelete,
}