const { Schema, model } = require('mongoose');

const ProductosSchema = Schema({
    nombre: {type:String, required:[true,'El nombre es obligatorio'],unique:true},
    estado: {type:Boolean, required: true, default: true},
    precio: {type:Number, default: 0},
    descripcion: {type:String},
    img: {type:String},
    destacado: {type:Boolean, default: false},
    stock: {type:Number, default: 0},
    fechaRegistro: {type:Date, default: Date.now},
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required: true},
    categoria: {type: Schema.Types.ObjectId, ref: 'Categoria', required: true},
    destacado: {type: Boolean, default: false
    },
})

module.exports = model('Producto', ProductosSchema)