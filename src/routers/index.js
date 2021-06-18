const express = require('express');
const router = express.Router();
const conexion = require('../controllers/conexion');

module.exports  = function(){
    router.get('/', conexion.inicio);
    router.post('/registro', conexion.confirmacion);

    return router;
}