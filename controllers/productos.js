const { response, request } = require('express');
const Producto = require('../models/producto');
const cloudinary = require('cloudinary').v2;

const productosGet = async (req = request, res = response) => {
   // 1. Recibimos limite y desde del frontend
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }; // Solo productos activos

    // 2. Ejecutamos dos consultas a la vez: Contar Total y Buscar Productos
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    // 3. Devolvemos AMBOS datos
    res.json({
        total,
        productos
    });
}

const productoGet = async (req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'correo')
        //.pupulate('categoria', 'nombre');

    res.json({
        msg: 'Producto obtenido segun lo solcitado',
        producto
    })
};

const productoPost = async (req = request, res = response) => {
    const { precio, categoria, descripcion, img, stock, } = req.body;
    const nombre = req.body.nombre.toUpperCase();
    const productoDB = await Producto.findOne({ nombre });


    //Subir la imagen a cloudinary
    const imagen = async (img) => {

        // Use the uploaded file's name as the asset's public ID and 
        // allow overwriting the asset with new versions

        try {
            // Upload the image
            const result = await cloudinary.uploader.upload(img);

            return result.secure_url;
        } catch (error) {
            console.error(error);
        }
    };

    const imgId = await imagen(img)



    // const result = await cloudinary.uploader.upload(img);
    // const imagen = result.secure_url;

    //Validar si el producto existe
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe.`
        })
    }

    //Generar la data que voy a guardar en la DB
    const data = { nombre, categoria, precio, descripcion, img: imgId, stock, usuario: req.usuario._id }
    // usuario:req.usuario._id^^^^^^^
    const producto = new Producto(data);


    //Grabar en la DB

    await producto.save();

    res.status(201).json({
        msg: 'Producto creado con exito',
        producto
    })


};


const productoPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { precio, categoria, descripcion, destacado, img, stock } = req.body;
    console.log

    const usuario = req.usuario_id;

    //Borrar la imagen anterior 
    if (img) {
        const productoActual = await Producto.findById(id);
        const imagenBorrar = productoActual.img;
        const nombreArr = imagenBorrar.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        await cloudinary.uploader.destroy(public_id)
    }

    //Carga de la imagen nueva
    const imagen = async (img) => {

        // Use the uploaded file's name as the asset's public ID and 
        // allow overwriting the asset with new versions

        try {
            // Upload the image
            const result = await cloudinary.uploader.upload(img);

            return result.secure_url;
        } catch (error) {
            console.error(error);
        }
    };

    const imgId = await imagen(img)


    let data = { precio, descripcion, categoria, destacado, img:imgId, stock, };

    //usuario^^^^^^^^^^

    //Si viene el nombre del producto
    if (req.body.nombre) {
        data.nombre = req.body.nombre.toUpperCase();
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json({
        msg: 'El producto se actualizo correctamente',
        producto
    })

};

const productoDelete = async (req = request, res = response) => {
    const { id } = req.params;

    const productoInactivo = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        msg: `El producto ${productoInactivo.nombre} se inactivó `,
        productoInactivo
    })
}

module.exports = {
    productosGet,
    productoGet,
    productoPost,
    productoPut,
    productoDelete,
}