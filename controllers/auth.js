const {request, response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/generar-jwt');


const login = async (req=request, res=response) => {
    const {correo, password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo});


        //Verificar si el correo existe
        if(!usuario){
            return res.status(400).json({
                msg:'Correo o password incorrectos | usuario inexistente'
            })
        }

        //Verificar si el usuario esta activo

        if(!usuario){
            return res.status(400).json({
                msg:'correo o password incorrectos | usuario inactivo' 
            })
        }

        //Verificar el password
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg:'correo o password incorrecto | password erroneo'
            })
        }

        //Generar el token del usuario 
        const token = await generarJWT(usuario.id);

        res.json({
            msg:'Login Ok',
            usuario,
            token
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Hable con el administrador del sistema'
        })
    }  
};

const renewToken = async (req = request, res = response) => {
    // El middleware validarJWT ya adjuntó el usuario al request.
    const { usuario: usuarioRenovado } = req;
    
    // El 'uid' (ID de usuario) lo extrae validarJWT de tu JWT original
    const uid = usuarioRenovado.id; 

    // 1. Generar un nuevo JWT (con un nuevo tiempo de expiración de 4h)
    const token = await generarJWT(uid);

    res.json({
        msg: 'Token Renovado OK',
        usuario: usuarioRenovado, // Devolver los datos del usuario (opcionalmente puedes traerlos de la DB aquí)
        token                   // Devolver el nuevo token
    });
};


module.exports = {
    login,
    renewToken
}