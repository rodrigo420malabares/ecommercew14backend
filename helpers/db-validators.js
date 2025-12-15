const Usuario = require('../models/usuario');
const Rol = require('../models/rol');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');


//Validar el correo
const emailExiste = async(correo) => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya se encuentra en la base de datos`)
    }
};


//Validar el rol
const esRolValido = async (rol) => {
    const existeRol = await Rol.findOne({rol});
    if(!existeRol){
        console.log('--- ERROR: Rol no encontrado. ---');
       throw new Error(`El rol ${rol} no existe en la base de datos`);
    }
};


//si el usuario existe en la DB con el id que pasan
const usuarioExiste = async(id) => {
     // ✅ CORRECCIÓN: Pasar el 'id' directamente como string
     const existeUsuario = await Usuario.findById(id); 
     if(!existeUsuario){
         throw new Error(`El id ${id} no corresponde a ningun usuario registrado`);
     }
}


//Validar si la categoria existe en la DB
const categoriaExiste = async(id) => {
     // ✅ CORRECCIÓN: Pasar el 'id' directamente como string
     const existeCategoria = await Categoria.findById(id); 
     if(!existeCategoria){
         throw new Error(`El id ${id} no corresponde a ninguna categoria registrada`)
     }
};


//Validar si el producto existe
const productoExiste = async(id) => {
     // ✅ CORRECCIÓN: Pasar el 'id' directamente como string
     const existeProducto = await Producto.findById(id); 
     if(!existeProducto){
         throw new Error(`El id ${id} no corresponde a ningun producto registrado`)
     }
};

module.exports = {
    emailExiste,
    esRolValido,
    usuarioExiste,
    categoriaExiste,
    productoExiste,
};