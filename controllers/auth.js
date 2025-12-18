const {request, response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/generar-jwt');
const { transporter } = require('../helpers/mailer'); // Importar el mailer
const jwt = require('jsonwebtoken'); // Necesario para crear el token temporal

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

const forgotPassword = async (req, res) => {
    const { correo } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Por seguridad, no decimos si el usuario no existe, pero para dev podemos retornar 404
            return res.status(404).json({ msg: 'No existe un usuario con ese correo' });
        }

        // 1. Generar un token especial para el reset (duración 1 hora)
        // Usamos una firma directa aquí para poder controlar el tiempo de expiración (1h)
        const token = jwt.sign({ uid: usuario.id }, process.env.SECRETORPRIVATEKEY, { expiresIn: '1h' });

        // 2. Crear el link de recuperación
        // OJO: Aquí pon la URL de tu Frontend. Si estás en local: localhost:5173
        // Si ya subiste el front a Vercel/Netlify, pon esa URL.
        const verificationLink = `https://workifytienda.netlify.app//reset-password?token=${token}`;

        // 3. Configurar el correo
        const mailOptions = {
            from: '"Soporte Workify" <tu_correo@gmail.com>', // El remitente
            to: usuario.correo, // El destinatario
            subject: 'Recuperación de Contraseña - Workify',
            html: `
                <h1>Hola ${usuario.nombre},</h1>
                <p>Has solicitado restablecer tu contraseña.</p>
                <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                <a href="${verificationLink}" style="background-color: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no fuiste tú, ignora este correo.</p>
            `
        };

        // 4. Enviar el correo
        await transporter.sendMail(mailOptions);

        res.json({ msg: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hable con el administrador' });
    }
};

// controllers/auth.js

// Asegúrate de tener esto arriba:
const bcryptjs = require('bcryptjs'); 

// ... (tus otras funciones)

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // 1. Verificar el token (si expiró o es falso, esto saltará al catch)
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // 2. Buscar al usuario
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // 3. Encriptar la nueva contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(newPassword, salt);

        // 4. Guardar en BD
        await usuario.save();

        res.json({ msg: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' });

    } catch (error) {
        console.log(error);
        return res.status(401).json({ msg: 'El enlace es inválido o ha expirado.' });
    }
};



module.exports = {
    login,
    renewToken,
    forgotPassword,
    resetPassword,
}