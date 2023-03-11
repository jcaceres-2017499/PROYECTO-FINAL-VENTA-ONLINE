'use strict'

const express = require('express');
const api = express.Router();
const carritoController = require('./carrito.controller');
const {ensureAuth, isAdmin} = require('../services/authenticated');

api.get('/test', carritoController.test);
api.post('/addCarrito', ensureAuth, carritoController.addCarrito);
api.get('/get/:id',[ensureAuth, isAdmin], carritoController.getByUser);
module.exports = api;