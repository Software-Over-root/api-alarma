const nodemailer = require("nodemailer");
const admin = require('firebase-admin');

//      conexion base de datos
var serviceAccount = require("../../tecnologias-emergentes-13454-firebase-adminsdk-kqh6g-efaaaf58cd.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tecnologias-emergentes-13454-default-rtdb.firebaseio.com/'
});
const db = admin.firestore();


//console.log(port);


exports.inicio = (req, res, next) => {
    res.send({"success": true, "type": "Hola mundo desde la API de seguridad de intrucion"});
}

exports.confirmacion = async (req, res, next) => {

    //console.log(req.body)
    
    async function main() {

        let transporter = nodemailer.createTransport({
            host: "mail.softwareover.com.mx",
            port: 587,
            secure: false,
            auth: {
                user: 'web@softwareover.com.mx',
                pass: '$5Z2zZ5{bD},',
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: '"Correo de confirmacion" <web@softwareover.com.mx>',
            to: req.body.correo,
            subject: "Hola usario",
            text: "Tu codigo de confirmacion es: " + req.body.codigo,
            html: "<b>Tu codigo de confirmacion es: " + req.body.codigo + "</b>",
        });

        //console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    var respuesta = await main();
    if (respuesta === undefined) {
        res.send({"success": true, "type": "Mensaje enviado"});
    } else {
        res.send({"success": false, "type": "Error en autentificacion", "error": error});
    }
}

exports.dataArdruino = (req, res, next) => {
    /**conexiona  ardruino */
    const Serialport = require('serialport');
    const Readline = Serialport.parsers.Readline;
    const port = new Serialport('COM5', {
        baudRate: 9600
    });

    const parser = port.pipe(new Readline({ delimeter: '\r\n'}));

    parser.on('open', function () {
        res.send({"success": true, "type": "connection is open 2"});
    });

    parser.on('data', function (data) {
        console.log(data);

        //actualizacion de ardruino en la base de datos
        db.collection('ardruino').doc('kizVFeNN7Tl3cUjE8jw9').set({
            distancia: data
        });
    });
    
    port.on('error', function (err) {
        console.log(err);
        //res.send({"success": true, "type": "error en data ardruino", "error": err});
    });
    
    res.send({"success": true, "type": "connection is open"});
    /**conexiona  ardruino */
}

exports.calibrarAlarma = async (req, res, next) => {
    /**conexiona  ardruino */
    //console.log(req.body);

    const Serialport = require('serialport');
    const Readline = Serialport.parsers.Readline;
    const port = new Serialport('COM5', {
        baudRate: 9600
    });
    
    const parser = port.pipe(new Readline({ delimeter: '\r\n'}));
    
    parser.on('open', function () {
        res.send({"success": true, "type": "Alarma activadad 2"});
    });
    
    parser.on('data', function (data) {
        console.log(data);
        
        const userRef = db.collection('usuario').doc(req.body.id);
        
        // Set the 'capital' field of the city
        userRef.update({
            distancia: data
        }).then( () => {
            parser.destroy();
            port.close(err => {
                console.log(err);
            })
            console.log("termiono");
            res.send({"success": true, "type": "Alarma calibrada"});
        }).catch( error => {
            parser.destroy();
            port.close(err => {
                console.log(err);
            })
            console.log({"error": error});
            res.send({"success": false, "type": "Error al activar alarma"});
        })
    })

    parser.on('end', function (data) {
        console.log("entro");
        console.log(data);
    })
    
    port.on('error', function (err) {
        res.send({"success": false, "type": "error en data ardruino", "error": err});
    });
    
    /**conexiona  ardruino */
}

exports.activarAlarma = (req, res, next) => {
    /**conexiona  ardruino */
    const Serialport = require('serialport');
    const Readline = Serialport.parsers.Readline;
    const port = new Serialport('COM5', {
        baudRate: 9600
    });

    const parser = port.pipe(new Readline({ delimeter: '\r\n'}));

    parser.on('open', function () {
        res.send({"success": true, "type": "connection is open 2"});
    });

    parser.on('data', function (data) {
        
        console.log(data);
        if (data >= parseInt(req.body.distancia) + 2 || data <= parseInt(req.body.distancia) - 2) {
            const userRef = db.collection('usuario').doc(req.body.id);
            // Set the 'capital' field of the city
            userRef.update({
                estadoCasa: true
            }).then( () => {
                parser.destroy();
                port.close(err => {
                    console.log(err);
                })
                console.log("termiono");
                next();
            }).catch( error => {
                parser.destroy();
                port.close(err => {
                    console.log(err);
                })
                console.log({"error": error});
                res.send({"success": false, "type": "Error en la alarma"});
            })
        }
    });
    
    port.on('error', function (err) {
        console.log(err);
        //res.send({"success": true, "type": "error en data ardruino", "error": err});
    });
    
    /**conexiona  ardruino */
}

exports.enviarAlerta = async (req, res, next) => {
    console.log(req.body);
    async function main() {

        let transporter = nodemailer.createTransport({
            host: "mail.softwareover.com.mx",
            port: 587,
            secure: false,
            auth: {
                user: 'web@softwareover.com.mx',
                pass: '$5Z2zZ5{bD},',
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: '"Tu casa esta en peligro!!!" <web@softwareover.com.mx>',
            to: req.body.correo,
            subject: "Hola usario",
            text: "hay un problema en tu casa!!!",
            html: "<b>Hemos  detectado una intrusion en tu casa!!!!</b>",
        });

        //console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    var respuesta = await main();
    if (respuesta === undefined) {
        res.send({"success": true, "type": "Se a detectado una intrusion"});
    } else {
        res.send({"success": true, "type": "Se a detectado una intrusion, no se logro notificar"});
    }
}