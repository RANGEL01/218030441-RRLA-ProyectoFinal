'use strict'

var secret = "clave-super-secreta-para-generar-token-1221";
var jwt = require('jwt-simple');
var moment = require('moment');

exports.authenticated = function (req, res, next) {

    // Comprobar Si Llega La Autorización
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: "La peticion no tiene las credenciales de autorización"
        });
    }

    // Limpiar Token
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        
        // Decodificar Token
        var payload = jwt.decode(token, secret);

        // Comprobar Expiración Del Token
        if (payload.exp <= moment().unix()) {
            return res.status(404).send({
                message: "El token ha expirado, lo siento"
            });
        }
        
    } 
    catch (error) {
        return res.status(404).send({
            message: "El token no es valido"
        });
    }

    req.user = payload;

    next();
};