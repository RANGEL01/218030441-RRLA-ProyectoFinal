'use strict'

// REQUIRES
const path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

// EJECUTAR EXPRESS
var app = express();

// VISTAS EJS
app.set('view engine', 'ejs');
app.set('views', 'src/views');

// CARPETA ESTATICA
app.use(express.static(path.join(__dirname,'public')));

// CARGAR ARCHIVOS DE RUTA
var ErrorController = require('./controllers/error');
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');
var comment_routes = require('./routes/comment');
var pages_routes = require('./routes/pages');

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// CORS

// REESCRIBIR RUTAS INTERNAS PARA LA APLICACION
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

// RUTAS PARA LOS USUARIOS
app.use(pages_routes);

// RUTA NO FOUNT
app.use(ErrorController.get404);

//EXPORTAR MODULO
module.exports = app;