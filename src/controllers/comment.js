"use strict"

var Topic = require('../models/topic');
var validator = require('validator');

var controller = {

    add: function (req, res) {

        // RECOGER ID DEL TOPIC MEDIANTE LA URL
        var topicId = req.params.topicId;

        // ENCONTRAR EL TEMA
        Topic.findById(topicId).exec(( err, topic) => {
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                }); 
            }
            if(!topic) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el tema'
                }); 
            }

            if(req.body.content) {
                try {
                    var validate_content = !validator.isEmpty(req.body.content);        
                } catch (error) {
                    return res.status(500).send({
                        message: 'No has comentado nada',
                        error: error
                    });
                }
                if(validate_content) {
                    var comment = {
                        user: req.user.sub,
                        content: req.body.content
                    };  

                    topic.comments.push(comment);

                    topic.save((err) => {

                        if(err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al guardar el comentario'
                            }); 
                        }

                        return res.status(200).send({
                            status: 'success',
                            topic
                        }); 
                    });

                }else{
                    return res.status(500).send({
                        message: 'Contenido incorrecto',
                        error: error
                    });
                }
            }

        });   
    },

    update: function (req, res) {
        // CONSEGUIR ID DEL COMENTARIO
        var commentId = req.params.commentId;
        // RECOGER DATOS A VALIDAR
        var params = req.body;

        try {
            var validate_content = !validator.isEmpty(req.body.content);        
        } catch (error) {
            return res.status(500).send({
                message: 'No has comentado nada',
                error: error
            });
        }

        if(validate_content) {
            Topic.findOneAndUpdate({ "comments._id": commentId }, { "$set": { "comments.$.content": params.content }}, { new:true }, (err, topicUpdated) => {
                if(err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar el comentario'
                    }); 
                }

                return res.status(200).send({
                    status: 'success',
                    topic: topicUpdated
                }); 
            });
        }
    },

    delete: function (req, res) {
        // SACAR EL ID DEL TEMA Y EL COMENTARIO A ELIMINAR
        var topicId = req.params.topicId;
        var commentId = req.params.commentId;

        // BUSCAR EL TEMA A ELIMINAR
        Topic.findByIdAndDelete(topicId, (err, topic) => {
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                }); 
            }
            if(!topic) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el tema'
                }); 
            }
            // SELECCIONAR EL SUBDOCUMENTO (COMENTARIO)
            var comment = topic.comments.id(commentId);
            // BORRAR EL COMENTARIO
            if (comment) {
                // REMOVER
                comment.remove();
                // GUARDAR EL TEMA
                topic.save(( err, topic ) => {
                    if(err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la peticion'
                        }); 
                    }

                    return res.status(200).send({
                        status: 'success',
                        topic
                    });    
                });
            }
            else {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el comentario'
                });
            }

        });
    }
    
};

module.exports = controller;