const express = require('express');
const router = express.Router();
const conexion = require('../controllers/conexion');

module.exports  = function(){
    router.get('/', conexion.inicio);
    router.post('/registro-codigo', conexion.confirmacion);
    router.post('/registro', conexion.registrar);
    router.post('/login', conexion.login);
    router.put('/registrar-codigo', conexion.insertarConfirmarcion);
    router.post('/general', conexion.general);

    return router;
}