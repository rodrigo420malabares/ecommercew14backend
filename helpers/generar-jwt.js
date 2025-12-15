const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        //Crear un PAYLOAD
        const payload = {uid};

        //generar json web token 
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {expiresIn: "4h"}, (error, token) => {
            if(error){
                console.log(error);
                reject('No se puede generar el token');
            } else {
                resolve(token);
            }
        })


    })
}


module.exports = {
    generarJWT,
}