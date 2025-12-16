const { Router } = require('express');
const { login, renewToken } = require('../controllers/auth');

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

module.exports = router;