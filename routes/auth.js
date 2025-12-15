const { Router } = require('express');
const { login } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.post('/login', [
    check('correo', 'el correo no es valido').isEmail(),
    check('password', 'la contraseña es obligatoria').notEmpty(),
    validarCampos,

], login);

module.exports = router;