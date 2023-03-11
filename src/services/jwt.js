'use strict'

//Archivo para creación de tokens
const jwt = require('jsonwebtoken');

exports.createToken = async (user) => {
    try {
        let payload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            role: user.role,
            iat: Date.now(), //Fecha actual en formato UNIX
            exp: Date.now() + (60 * 60)
        }
        return jwt.sign(payload, `${process.env.SECRET_KEY}`);
    } catch (err) {
        console.error(err);
        return err;
    }
}