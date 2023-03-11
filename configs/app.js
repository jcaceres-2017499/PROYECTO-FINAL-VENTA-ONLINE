'use strict'

const express = require('express');
//Logs de las solicitudes que recibe el servidor
const morgan = require('morgan');
//Seguridad basica al servidor
const helmet = require('helmet');
//Aceptacion de solicitudes
const cors = require('cors');
//Instancia de express
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('../src/user/user.routes');
const categoryRoutes = require('../src/category/category.routes');
const productRoutes = require('../src/product/product.routes');
const carritoRoutes = require('../src/carrito/carrito.routes');
const facturaRoutes = require('../src/factura/factura.routes');

//Configurar el servidor HTTP De Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/carrito', carritoRoutes);
app.use('/factura', facturaRoutes);
//Funcion desde que se levanta el servidor
exports.initServer = () => {
    app.listen(port);
    console.log(`Server is running in port ${port}`)
}