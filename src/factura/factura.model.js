'use strict'
const mongoose = require('mongoose');

const facturaSchema = mongoose.Schema({
    shop: {type: mongoose.Schema.Types.ObjectId, ref: 'Shop'},
});

module.exports = mongoose.model('Factura', facturaSchema);