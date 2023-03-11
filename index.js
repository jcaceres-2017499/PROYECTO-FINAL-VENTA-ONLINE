'use strict'

require('dotenv').config()
const { application } = require('express');
const mongoConfig = require('./configs/mongo');
const app = require('./configs/app');
const categoryController = require('./src/category/category.controller');
mongoConfig.connect();
app.initServer();
categoryController.defaultCategory();