'use strict'
const Product = require('../product/product.model');
const Carrito = require ('./carrito.model');
const User = require('../user/user.model')

exports.test = (req,res)=>{
    res.send({message: 'Test function is running'});
}

exports.addCarrito = async (req, res) => {
    try{
        //capturar lo que voy a comprar
        const { name, quantity } = req.body;
        //buscar si el producto existe
        const product = await Product.findOne({ name });
        if (!product) return res.status(404).send({ message: 'Product not found.' });
        //validar si hay en existencia
        let stock = product.stock;
        if (stock < quantity) return res.send({ message: 'There is not in stock' });
        const item = {
            productId: product._id,
            quantity,
        };
        //agregarle una compra al usuario
        const updatedUser = await User.findByIdAndUpdate(
            req.user.sub,
            { $push: { cart: item } },
            { new: true }
        );
        if (!updatedUser) return res.send({ message: "Product not added"});
        return res.send({ message: "Product added to cart" });
    }catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Error shopping"});
    }
  };

exports.getByUser = async(req,res)=>{
    try{
        //obtener el id
        let user = req.params.id
        // verificar si existe la categoria
        let existUser = await User.findOne({_id: user})
        if(!existUser) return res.send({message: 'User does not exist'})
        //buscar
        let carrito = await Carrito.find({user: user})
        return res.send({message: carrito})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching carritos by user'});
    }
};
