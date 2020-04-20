'use strict';

var validator = require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var jwt = require('../services/jwt');

var controller = {

	save: function(req, res) {

		// RECOGER LOS PARAMETROS DE LA PETICIÓN
		var params = req.body;
		
		try {

			// VALIDAR LOS DATOS
			var validate_name = !validator.isEmpty(params.name);
			var validate_surname = !validator.isEmpty(params.surname);
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);

		} catch (error) {

			return res.status(200).send({
				message: 'Datos vacios'
			});

		}
		
		// COMPROBAR VALIDACIÓN
		if (validate_name && validate_surname && validate_email && validate_password) {
			
			// CREAR OBJETO DE USUARIO
			var user = new User();
			
			// ASIGNAR LOS VALORES RECIBIDOS AL OBJETO
			user.name = params.name;
			user.surname = params.surname;
			user.email = params.email.toLowerCase();
			user.rol = 'ROLE_USER';
			user.image = null;
			
			// COMPROBAR EXISTENCIA EN LA BD
			User.findOne({ email: user.email.toLowerCase() }, (error, issetUser) => {
			
				if (error) {
					return res.status(200).send({
						message: 'Error al comprobar el usuario, intenta de nuevo'
					});
				}
			
				if (!issetUser) {
					// CIFRAR CONTRASEÑA
					bcrypt.hash(params.password, null, null, (err, hash) => {
						user.password = hash;

						// GUARDAR USUARIO
						user.save((err, UserStored) => {
							if (err) {
								return res.status(500).send({
									message: 'Error al guardar el usuario'
								});
							}
							if (!UserStored) {
								return res.status(400).send({
									message: 'El usuario no se ha guardado'
								});
							}
							return res.status(200).send({
								status: 'success',
								user: UserStored,
								message: 'Usuario guradado exitosamente'
							});
						});
					});
					return res.status(200).send({
						message: 'Error al comprobar el usuario, intenta de nuevo'
					});
				} else {
					return res.status(200).send({
						message: 'Usuario ya existe en la base de datos, intenta de nuevo'
					});
				}
			});
		} else {
			return res.status(200).send({
				message: 'Validación de los datos del usuario incorrecta, intenta de nuevo'
			});
		}
	},

	login: function(req, res) {
		// RECOGER LOS PARAMETROS DE LA PETICIÓN
		var params = req.body;
		try {
			// VALIDAR LOS DATOS
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
		} catch (error) {
			return res.status(200).send({
				message: 'Datos vacios'
			});
		}
		if (!validate_email || !validate_password) {
			return res.status(200).send({
				message: 'Los datos son incorrectos, Inente de nuevo'
			});
		}
		// COMPROBAR SI EL USUARIO EXISTE EN LA BASE DE DATOS
		User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
			// COMPROBAR OPERACIÓN
			if (err) {
				return res.status(500).send({
					message: 'Error al comprobar tus credenciales'
				});
			}
			// SI NO HAY USUARIO
			if (!user) {
				return res.status(404).send({
					message: 'El usuario no existe en la base de datos'
				});
			}

			// COMPROBAR CONTRASEÑA
			// DESENCRIPTAR
			bcrypt.compare(params.password, user.password, (err, check) => {
				// SI TODO ES CORRECTO
				if (check) {
					if (params.gettoken) {
						return res.status(200).send({
							token: jwt.createToken(user)
						});
					} else {
						// LIMPIAR OBJETO
						user.password = undefined;

						// DEVOLVER DATOS
						return res.status(200).send({
							status: 'success',
							user
						});
					}
				} else {
					return res.status(200).send({
						message: 'Las credenciales no son correctas'
					});
				}
			});
		});
	},

	update: function(req, res) {
		// Recoger los datos
		var params = req.body;

		try {
			// VALIDAR LOS DATOS
			var validate_name = !validator.isEmpty(params.name);
			var validate_surname = !validator.isEmpty(params.surname);
			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
		} catch (error) {
			return res.status(200).send({
				message: 'Datos vacios'
			});
		}

		// COMPROBAR VALIDACIÓN
		if (validate_name && validate_surname && validate_email) {
			// Eliminar Propiedades Innecesarias
			delete params.password;

			var userId = req.user.sub;

			// Comprobar Email Unico
			if (req.user.email != params.email) {
				// COMPROBAR SI EL USUARIO EXISTE EN LA BASE DE DATOS
				User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
					// COMPROBAR OPERACIÓN
					if (err) {
						return res.status(500).send({
							message: 'Error al comprobar tus credenciales'
						});
					}
					// SI NO HAY USUARIO
					if (user && user.email == params.email) {
						return res.status(200).send({
							message: 'El email esta vinculado con otra cuenta'
						});
					}
					else {
						User.findOneAndUpdate({ _id: userId }, params, { new: true }, (error, userUpdate) => {
							if (error) {
								return res.status(500).send({
									status: 'error',
									message: 'Error al actualizar usuario'
								});
							}
		
							if (!userUpdate) {
								return res.status(200).send({
									status: 'error',
									message: 'No se ha actualizado el usuario'
								});
							}
		
							// Devolver respuesta
							return res.status(200).send({
								status: 'success',
								user: userUpdate
							});
						});
					}
				});
			}
			else {
				User.findOneAndUpdate({ _id: userId }, params, { new: true }, (error, userUpdate) => {
					if (error) {
						return res.status(500).send({
							status: 'error',
							message: 'Error al actualizar usuario'
						});
					}

					if (!userUpdate) {
						return res.status(200).send({
							status: 'error',
							message: 'No se ha actualizado el usuario'
						});
					}

					// Devolver respuesta
					return res.status(200).send({
						status: 'success',
						user: userUpdate
					});
				});
			}
		} else {
			return res.status(200).send({
				message: 'Validación de los datos del usuario incorrecta, intenta de nuevo'
			});
		}
	},

	uploadAvatar: function(req, res) {
		
		// Recoger El Fichero De La Petición
		var file_name = 'Avatar no subido...';

		// Compobar Si El Archivo Llega
		if (!req.files) {
			return res.status(404).send({
				status: 'error',
				message: file_name
			}); 
		}

		// Conseguir El Nombre Y La Extención Del Archivo
		var file_path = req.files.file0.path;
		var file_split = file_path.split('\\');
		/** En linux o mac es "/" */

		// Nombre Del Archivo
		var file_name = file_split[2];
		// Extención
		var ext_split = file_name.split('\.');
		var extencion = ext_split[ext_split.length - 1];

		// Comprobar Imagenes
		if (extencion != 'png' && extencion != 'jpg' && extencion != 'jpeg' && extencion != 'gif') {
			fs.unlink(file_path, (error) => {
				if (error) {
					return res.status(200).send({
						status: 'error',
						message: 'La extención no es valida'
					}); 
				}
			});
		}
		else {
			
			var userId = req.user.sub;

			User.findOneAndUpdate({ _id: userId }, { image: file_name }, { new: true }, (error, UserUpdated) => {
				
				if (error || !UserUpdated) {
					return res.status(500).send({
						status: 'error',
						message: 'Error al guardar imagen'
					});
				}

				// Devolver Respuesta
				return res.status(200).send({
					status: 'succes',
					user: UserUpdated
				}); 
			});
		}

	},

	avatar: function(req, res) {
		var fileName = req.params.fileName;
		var pathFile = './uploads/users/' + fileName;

		fs.exists(pathFile, () => {
			if (exists) {
				return res.sendFile(path.resolve(pathFile));
			}
			else {
				return res.status(404).send({
					message: 'Sin imagen'
				});
			}
		});

	},

	getUsers: function(req, res) {
		User.find().exec((error, users) => {
			if (error || !users) {
				return res.status(404).send({
					status: 'error',
					message: 'No hay usuarios que mostrar'
				});
			}

			return res.status(200).send({
				status: 'success',
				users
			});
		});
	},

	getUser: function(req, res) {
		var userId = req.params.userId;
		User.findById(userId).exec((error, user) => {
			if (error || !user) {
				return res.status(404).send({
					status: 'error',
					message: 'No existe el usuario'
				});
			}

			return res.status(200).send({
				status: 'success',
				user
			});
		});
	}
};

module.exports = controller;