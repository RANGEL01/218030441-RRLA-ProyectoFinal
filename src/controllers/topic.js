'use strict'

var validator = require('validator');
var Topic = require('../models/topic');


var controller = {

    save : function (req, res) {
        var params = req.body;

        try {
            
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);

        } catch (error) {
            return res.status(500).send({
                message: 'Faltan datos por enviar',
                error: error
            });
        }
        
        if (validate_title && validate_content && validate_lang) {
            
            var topic = new Topic();

            topic.title = params.title;
            topic.content = params.content;
            topic.lang = params.lang;
            topic.code = params.code;
            topic.user = req.user.sub;


            topic.save((err, topicStored) => {

                if (err || !topicStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El tema no se ha guardado'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    topic: topicStored
                });
            });

        } else {
            return res.status(200).send({
                message: 'Los datos no son validos'
            });
        }
    },

    getTopics: function (req, res) {

        // RECOGER PAGINA ACTUAL
        var page = req.params.page;
        if (req.params.page == null || req.params.page == undefined || !req.params.page || req.params.page == 0 || req.params.page == "0") {
            var page = 1;
        }
        else {
            var page = parseInt(req.params.page);
        }

        // OPCIONES DE LA PAGINACIÓN
        var options = {
            sort : { data: -1 },
            populate : 'user',
            limit: 5,
            page: page
        };

        Topic.paginate({ }, options, (err, topics) => {

            if(err) {
                return  res.status(500).send({
                    status: 'error',
                    message: 'Error en la consulta'
                });
            }

            if(!topics) {
                return  res.status(404).send({
                    status: 'error',
                    message: 'No hay temas'
                });
            }

            if(page > topics.totalPages) {
                return  res.status(404).send({
                    status: 'error',
                    message: 'No hay temas en esta pagina el, el limite de paginas es de: ' + topics.totalPages
                });
            }

            return res.status(200).send({
                status: 'success',
                topics: topics.docs,
                totalDocs: topics.totalDocs,
                totalPages: topics.totalPages,
                message: 'Metodo getTopics'
            });
        });
    },

    getTopicsByUser: function (req, res) {
        // OBTENER USUARIO
        var userId = req.params.user;
        // ENCONTRAR TOPICS DE USUARIO
        Topic.find({
            user: userId
        }).sort([['date', 'descending']]).exec((err, topics) => {
            if(err) {
                return  res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if(!topics) {
                return  res.status(404).send({
                    status: 'error',
                    message: 'No hay temas para mostrar'
                });
            }
            return  res.status(200).send({
                status: 'success',
                topics
            });
        });
    },

    getTopic: function (req, res) {
        // SACAR EL ID DEL TOPIC DE LA URL
        var topicId = req.params.id;

        Topic.findById(topicId).populate('user').exec((err, topic) => {
            if(err) {
                return  res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if(!topic) {
                return  res.status(404).send({
                    status: 'error',
                    message: 'El tema no existe'
                });
            }

            return  res.status(200).send({
                status: 'success',
                topic
            });
        });
    },

    update: function (req,res) {
        // RECOGER EL TOPIC A MODIFICAR
        var topicId = req.params.id;

        // RECOGER DATOS
        var params = req.body;
        // VALIDAR QUE DATOS NO ESTEN VACIOS
        try {
            
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);

        } catch (error) {
            return res.status(500).send({
                message: 'Faltan datos por enviar',
                error: error
            });
        }

        if (validate_title && validate_content && validate_lang) {
            var update = {
                title: params.title,
                content: params.content,
                code: params.code,
                lang: params.lang
            };

            Topic.findOneAndUpdate({_id: topicId, user: req.user.sub}, update, {new: true}, (err, topicUpdated) => {
                if(err) {
                    return  res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion'
                    });
                }
                if(!topicUpdated) {
                    return  res.status(404).send({
                        status: 'error',
                        message: 'No se ha podido actualizar el tema'
                    });
                }
    
                return  res.status(200).send({
                    status: 'success',
                    topic: topicUpdated
                });
            });
        }
        else {
            return res.status(200).send({
                status: 'error',
                message: 'Validacion de los datos no es correcta'
            });
        }

    },

    delete: function (req, res) {
        // SACAR EL ID DEL TOPIC DE LA URL
        var topicId = req.params.id;

        // BUSCAR TOPIC A ELIMINAR
        Topic.findByIdAndDelete({ _id: topicId, user: req.user.sub }, (err, topicRemoved) => {

            if(err) {
                return  res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if(!topicRemoved) {
                return  res.status(404).send({
                    status: 'error',
                    message: 'No se ha podido eliminar el tema'
                });
            }

            return res.status(200).send({
                status: 'success',
                topic: topicRemoved
            });
        });
    },

    search: function (req, res) {
        // SEARCH STRING A BUSCAR DE LA URL
        var searchString = req.params.search;

        Topic.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"} },
            { "content": { "$regex": searchString, "$options": "i"} },
            { "lang": { "$regex": searchString, "$options": "i"} },
            { "code": { "$regex": searchString, "$options": "i"} }
        ]}).sort([['date', 'descending']]).exec(( err, topics)=> {
            if(err) {
                return  res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if(!topics) {
                return  res.status(404).send({
                    status: 'error',
                    message: 'No hay temas disponibles'
                });
            }

            return res.status(200).send({
                status: 'success',
                topics
            });
        });
    }

};

module.exports = controller;