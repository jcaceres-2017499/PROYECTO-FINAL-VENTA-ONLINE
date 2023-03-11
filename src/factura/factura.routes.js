'use strict'
const express = require('express');
const api = express.Router();
const facturaController = require('./factura.controller');
const {ensureAuth, isAdmin} = require('../services/authenticated');

api.get('/test', facturaController.test);
api.post('/add', [ensureAuth, isAdmin], facturaController.addFactura);

module.exports = api;