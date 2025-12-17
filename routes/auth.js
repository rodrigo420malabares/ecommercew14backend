const { Router } = require('express');
const { login, renewToken, forgotPassword, resetPassword } = require('../controllers/auth');


const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/login', [
    check('correo', 'el correo no es valido').isEmail(),
    check('password', 'la contraseña es obligatoria').notEmpty(),
    validarCampos,

], login);

router.get('/renew', validarJWT, renewToken);

// NUEVA RUTA: Recibir el token y la nueva password
router.post('/reset-password', [
    check('newPassword', 'La contraseña debe tener más de 6 letras').isLength({ min: 6 }),
    check('token', 'El token es obligatorio').not().isEmpty(),
    validarCampos,
], resetPassword);

router.post('/forgot-password', [
    check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], forgotPassword);

module.exports = router;