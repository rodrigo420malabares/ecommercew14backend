const { Router } = require('express');
const { usuarioGet, usuarioGetId, usuarioPost, usuarioDelete, usuarioPut } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const { check } = require('express-validator');
const { usuarioExiste, emailExiste, esRolValido } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validarCampos');




const router = Router();


router.get('/',[
    validarJWT,
    esAdminRole,

], usuarioGet );

router.get('/:id',[
    check('id',"El id no es valido").isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos, 
], usuarioGetId );

router.post('/', [
    check("nombre", "el nombre es obligatorio").notEmpty(),
    check("apellido", "el apellido es obligatorio").notEmpty(),
    check("correo").custom(emailExiste),
    check("password", "La contraseña debe tener un minimo de 6 caracteres").isLength({min: 6}),
    check("rol").custom(esRolValido),
    validarCampos,
], usuarioPost );

router.put('/:id', [
    validarJWT,
    check("id","No es un id valido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos,

], usuarioPut );

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos,

], usuarioDelete );

module.exports = router;