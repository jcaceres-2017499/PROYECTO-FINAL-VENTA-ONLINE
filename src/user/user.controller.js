'use strict'
const User = require('./user.model');
const { validateData, encrypt, checkPassword } = require('../utils/validate');
const { createToken } = require('../services/jwt')

exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}

exports.register = async (req, res) => {
    try {
        //Capturar el formulario de registro
        let data = req.body;
        let params = {
            password: data.password
        }
        let validate = validateData(params)
        //ROl predefinido
        data.role = 'CLIENT'
        //Encriptar constraseña
        data.password = await encrypt(data.password);
        //guardar info
        let user = new User(data);
        await user.save();
        return res.send({ message: 'Account created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating acount', error: err.message })
    }
}

exports.save = async (req, res) => {
    try {
        let data = req.body;
        let params = {
            password: data.password
        }
        let validate = validateData(params);
        if (validate) return res.status(400).send(validateData);
        data.password = await encrypt(data.password);
        let user = new User(data);
        await user.save();
        return res.send({ message: 'Acount created succesfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving user ' })
    }
}

exports.login = async (req, res) => {
    try {
        //obtener la data a validad(username y password)
        let data = req.body;
        let cretentials = {
            username: data.username,
            password: data.password
        }
        let msg = validateData(cretentials);
        if (msg) return res.status(400).send(msg);
        //validar que exista en la DB
        let user = await User.findOne({ username: data.username });
        //validar la constraseña
        if (user && await checkPassword(data.password, user.password)) {
            let token = await createToken(user);
            //retornar un mensaje de logeo con un token
            return res.send({ message: 'User logges succesfully', token });
        }
        return res.status(401).send({ message: 'Invalid credentials' });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error, not logged' });
    }
}

exports.update = async (req, res) => {
    try {
        //Obtener el Id del usuario a actualizar;
        let userId = req.params.id;
        //Obtener los datos a actualizar
        let data = req.body;
        //Validar si tiene permisos
        if (userId != req.user.sub) return res.status(401).send({ message: 'Dont have permission to do this action' });
        //Validar que le llegue data a actualizar
        if (data.password || Object.entries(data).length === 0 || data.role) return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
        let userUpdated = await User.findOneAndUpdate(
            { _id: req.user.sub },
            data,
            { new: true }
        )
        if (!userUpdated) return res.status(404).send({ message: 'User not found adn not updated' });
        return res.send({ message: 'User updated', userUpdated })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not updated', err: `Username ${err.keyValue.username} is already taken` });
    }
}

exports.delete = async (req, res) => {
    try {
        //Obtener el id a eliminar
        let userId = req.params.id;
        //Validar si tiene permisos
        if (userId != req.user.sub) return res.status(401).send({ message: 'Dont have permission to do this action' });
        //Eliminar
        let userDeleted = await User.findOneAndDelete({ _id: req.user.sub });
        if (!userDeleted) return res.send({ message: 'Account not found and not deleted' });
        return res.send({ message: `Account with username ${userDeleted.username} deleted sucessfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not deleted' });
    }
}