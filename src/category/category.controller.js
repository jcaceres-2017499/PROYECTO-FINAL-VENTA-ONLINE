'use strict'
//Logica

const Category = require('./category.model');
const Product = require('../product/product.model');

exports.defaultCategory = async () => {
    try {
        let data = {
            name: 'Default',
            description: 'Default category'
        }
        let existCategory = await Category.findOne({ name: 'Default' });
        if (existCategory) return console.log('Default category already created');
        let defCategory = new Category(data);
        await defCategory.save();
        return console.log('Default category created');
    } catch (err) {
        return console.error(err);
    }
}

exports.addCategory = async (req, res) => {
    try {
        let data = req.body;
        //Validar duplicados
        let existsCategory = await Category.findOne({ name: data.name });
        if (existsCategory) {
            return res.send({ message: 'category already created' });
        }
        let category = new Category(data);
        await category.save();
        return res.status(201).send({ message: 'Created category' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'ERROR saving category' });
    }

}

exports.getCategories = async (req, res) => {
    try {
        let categories = await Category.find();
        return res.send({ message: 'Categories found', categories })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting categories' });
    }
}

exports.getCategory = async (req, res) => {
    try {
        let categoryId = req.params.id;
        let category = await Category.findOne({ _id: categoryId });
        if (!category) return res.status(404).send({ message: 'Category not found' });
        return res.send({ message: 'Category found', category })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting category' });
    }
}

//udate
exports.updateCategory = async (req, res) => {
    try {
        let categoryId = req.params.id;
        let data = req.body;
        let existsCategory = await Category.findOne({ name: data.name }).lean();
        if (existsCategory) {
            if (existsCategory._id != categoryId) return res.send({ message: 'Category already created' });
            let updateCategory = await Category.findOneAndUpdate(
                { _id: categoryId },
                data,
                { new: true }
            )
            if (!updateCategory) return res.status(404).send({ message: 'Category not found and update' });
            return res.send({ message: 'Category update', updateCategory });
        }
        let updateCategory = await Category.findOneAndUpdate(
            { _id: categoryId },
            data,
            { new: true }
        )
        if (!updateCategory) return res.status(404).send({ message: 'Category not found and update' });
        return res.send({ message: 'Category update', updateCategory });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating category' });
    }
}

//eliminar
exports.deleteCategory = async (req, res) => {
    try {
        //id de la categoria
        let categoryId = req.params.id
        // validacion si hay productos con la categoria a eliminar
        //actualizar los productos con el id de la categoia default
        let defaultCategory = await Category.findOne({ name: 'Default' });
        if (defaultCategory._id == categoryId) return res.send({ message: 'Default category cannot deleted' });
        await Product.updateMany({ category: categoryId }, { category: defaultCategory._id });
        let deletedCategory = await Category.findOneAndDelete({ _id: categoryId });
        if (!deletedCategory) return res.status(404).send({ message: 'Category not found and not deleted' });
        return res.send({ message: 'Category deleted sucessfuly' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting category' });
    }
}