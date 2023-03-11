'use strict'

const express = require('express');
const api = express.Router();
const productController = require('./product.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.get('/test', [ensureAuth, isAdmin], productController.test);
api.post('/add', [ensureAuth, isAdmin], productController.addProduct);
api.get('/get', [ensureAuth, isAdmin], productController.getProducts);
api.get('/get/:id', [ensureAuth, isAdmin], productController.getProduct);
api.post('/search', ensureAuth, productController.search);
api.get('/searchProduct/:id', ensureAuth, productController.searchProductsByCategory);
api.put('/update/:id', [ensureAuth, isAdmin], productController.updateProduct);
api.delete('/delete/:id', [ensureAuth, isAdmin], productController.deleteProduct);
api.get('/getBestSellers', ensureAuth, productController.getBestSellers);
api.get('/getSoldOutProducts', [ensureAuth, isAdmin], productController.getProductSoldOut);
module.exports = api;