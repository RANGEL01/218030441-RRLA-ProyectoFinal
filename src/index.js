'use strict'

// REQUIRES
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;

// CONEXIÓN CON MONGO

mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api-forum', { useNewUrlParser: true })
        .then( () => {
            console.log('Conexión a la base de datos de mongo se ha realizado correctamente');
            // CREAR SERVIDOR
            app.listen(port, () => {
                console.log('El servidor http://localhost:' + port + ' está funcionando');
            });
        })
        .catch( error => console.log(error));