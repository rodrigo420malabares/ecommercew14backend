const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const Producto = require('../models/producto'); // Asegurate que la ruta al modelo esté bien

const buscarProductos = async (req, res = response) => {
    // El término viene en la URL (ej: /api/buscar/teclado)
    const { termino } = req.params;

    // 1. Validación opcional: Si es un ID de Mongo, buscamos por ID exacto
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    // 2. Búsqueda por Nombre (Usando Regex para que sea insensible a mayúsculas)
    const regex = new RegExp(termino, 'i'); // 'i' = insensibles a mayusculas/minusculas

    const productos = await Producto.find({
        $or: [{ nombre: regex }, { descripcion: regex }], // Busca en nombre O descripción
        $and: [{ estado: true }] // Solo productos activos
    }).populate('categoria', 'nombre'); // Trae el nombre de la categoría también

    res.json({
        results: productos
    });
};

module.exports = {
    buscarProductos
};