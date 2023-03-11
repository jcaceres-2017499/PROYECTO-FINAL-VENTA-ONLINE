'use strict'
const Carrito = require('../carrito/carrito.model')
const Factura = require('../factura/factura.model')

exports.test = (req,res)=>{
    res.send({message: 'Test function is running'});
}

exports.addFactura = async(req, res)=>{
    try{
        //obtener la informacion a agregar
        let data = req.body;
        //validacion si existe la compra del carrito para meterla en la factura
        let existsShop = await Carrito.findOne({_id: data.carrito});
        if(!existsShop) return res.status(404).send({message: 'Shop not found'});
        //guardar
        let factura = new Factura(data);
        await factura.save();
        return res.send({message: 'La factura ya se ha generado', factura}) 
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error saving factura'});
    }
}