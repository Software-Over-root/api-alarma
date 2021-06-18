const express = require('express');
const router = express.Router();
const conexion = require('../controllers/conexion');

module.exports  = function(){
    router.get('/', conexion.inicio);
    router.post('/registro', conexion.confirmacion);
    router.get('/data-ardruino', conexion.dataArdruino);
    router.post('/calibrar-alarma', conexion.calibrarAlarma);
    router.post('/activar-alarma', conexion.activarAlarma, conexion.enviarAlerta);

    return router;
}