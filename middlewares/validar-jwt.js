const {request, response} = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req=request,res=response, next) => {
    const token = req.header('x-token');

    //Preguntar si no enviaron el token
    if(!token){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        })
    }


    //Si enviaron el token, hacer
    try {

        //Verificar el token y obtener el uid
        const{uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Obtener los datos del usuario autentica (uid)
        const usuario =  await Usuario.findById(uid);

        //validar si el usuario existe
        if(!usuario){
            return res.status(401).json({
                msg:'Token no valido - usuario no existe'
            })
        }

        //Validar que el usuario este activo
         if(!usuario.estado){
             return res.status(401).json({
                msg:'Token no valido - usuario inactivo'
            })

         }


        req.usuario = usuario;


        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'token no valido'
        })
    }
}


module.exports = {
    validarJWT,
}