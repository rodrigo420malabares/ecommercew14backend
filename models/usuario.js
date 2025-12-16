const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {type:String, required:[true,'El nombre es obligatorio']},
    apellido: {type:String, required:[true,'El apellido es obligatorio']},
    correo: {type:String, required:[true,'El correo es obligatorio'], unique:true},
    password: {type:String, required:[true,'La contraseña es obligatoria']},
    rol: {type:String, required:[true,'El rol es obligatorio']},
    img: {type:String},
    fechaRegistro: {type:Date, default: Date.now},
    estado:{type:Boolean, default: true}

});

UsuarioSchema.methods.toJSON = function() {
    // 'this' hace referencia a la instancia del objeto (el usuario)
    const { __v, password, _id, ...usuario } = this.toObject();
    
    // Cambiamos el nombre de _id por uid
    usuario.uid = _id; 
    
    return usuario;
};


module.exports = model('Usuario', UsuarioSchema)