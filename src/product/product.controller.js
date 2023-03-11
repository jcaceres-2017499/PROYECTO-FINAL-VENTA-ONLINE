'use strict'
const Product = require('./product.model');
const Category = require('../category/category.model');
const { validateData } = require('../utils/validate');


exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}

exports.addProduct = async (req, res) => {
    try {
        //obtener la informacion a agregar
        let data = req.body;
        //validacion si existe la cateogry
        let existsCategory = await Category.findOne({ _id: data.category });
        if (!existsCategory) return res.status(404).send({ message: 'Category not found' });//mensaje si si no existe
        //guardar
        let product = new Product(data);
        await product.save();
        return res.send({ message: 'Product saved sucessfully', product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating product' });
    }
}

exports.search = async(req, res)=>{
    try{
        let params = {
            name: req.body.name
        }
        let validate = validateData(params)
        if(validate) return res.status(400).send(validate);
        let productss = await Product.find({
            name: {
                $regex: params.name,
                $options: 'i'
            }
        });
        return res.send({productss})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching product'});
    }
}

exports.searchProductsByCategory = async(req, res)=>{
    try{
        //obtener el id
        let category = req.params.id
        // verificar si existe la categoria
        let existCategory = await Category.findOne({_id: category})
        if(!existCategory) return res.send({message: 'The category does not exist'})
        //buscar
        let products = await Product.find({category: category})
        return res.send({message: products})        
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching  products by category'})
    }
}

exports.getProducts = async (req, res) => {
    try {
        //buscar datos
        let products = await Product.find().populate('category');
        return res.send({ message: 'Products found', products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting products' });
    }
}

exports.getProduct = async (req, res) => {
    try {
        //obtener el id del producto
        let productId = req.params.id;
        //buscar en DB
        let product = await Product.findOne({ _id: productId }).populate('category');
        //validar que exista el producto
        if (!product) return res.status(404).send({ message: 'Product not found' });
        //Si existe lo devuelve
        return res.send({ message: 'Product found', product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting products' });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        //obtener el id del producto
        let productId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        //Validar que exita la categoria
        if(data.category){
            let existsCategory = await Category.findOne({_id: data.category});
        if(!existsCategory) return res.status(404).send({message: 'Category not found'});
        }
        //Actualizar
        let updatedProduct = await Product.findOneAndUpdate(
            { _id: productId },
            data,
            { new: true }
        )
        if (!updatedProduct) return res.send({ message: 'Product not found and not updated' });
        return res.send({ message: 'Product updated', updatedProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating product' });
    }
}

//eliminar
exports.deleteProduct = async (req, res) => {
    try {
        //Obtener el id a eliminar
        let productId = req.params.id;
        //Eliminar
        let productDeleted = await Product.findOneAndDelete({ _id: productId });
        if (!productDeleted) return res.send({ message: 'Product not found and not deleted' });
        return res.send({ message: 'Product deleted succesfull' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting product' });
    }
}

//ver los productos mas vendidos
exports.getBestSellers = async(req,res)=>{
    try {
        let products = await Product.find().sort({ sales: 'desc' }).limit(3);
        return res.send({products});
    }catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error getting products'});
    }
}

//ver los productos agotados
exports.getProductSoldOut = async(req,res)=>{
    try{
        let products = await Product.find({stock: 0});
        return res.send({products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting products'});
    }
}