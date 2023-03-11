'use strict'
const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

//Ruta de testeo
api.get('/test', [ensureAuth, isAdmin], userController.test);
api.post('/register', userController.register);
api.post('/save', [ensureAuth, isAdmin], userController.save);
api.post('/login', userController.login);
api.put('/update/:id', ensureAuth, userController.update);
api.delete('/delete/:id', ensureAuth, userController.delete);
module.exports = api;