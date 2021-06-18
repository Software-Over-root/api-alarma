const nodemailer = require("nodemailer");
const admin = require('firebase-admin');

//      conexion base de datos
var serviceAccount = require("../../tecnologias-emergentes-13454-firebase-adminsdk-kqh6g-efaaaf58cd.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tecnologias-emergentes-13454-default-rtdb.firebaseio.com/'
});
const db = admin.firestore();


exports.inicio = (req, res, next) => {
    res.send({"success": true, "type": "Hola mundo desde la API de seguridad de intrucion 3"});
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

exports.registrar = async (req, res, next) => {

    const respuesta = await db.collection('usuario').add({
        nombre: req.body.nombre,
        correo: req.body.correo,
        codigo: req.body.codigo,
        distancia: "",
        estado: false,
        estadoCasa: false,
        password: req.body.password,
        ubicacion: {
            lat: req.body.ubicacion.lat,
            long: req.body.ubicacion.long
        }
    }).catch( error => {
        console.log({"error": error});
        res.send({"success": false, "type": "Error al registara usuario"});
    })

    
    console.log("termiono");
    console.log('Added document with ID: ', respuesta.id);
    res.send({"success": true, "type": "usuario registrado", data: {"id": respuesta.id}});
        

}

exports.login = async (req, res, next) => {
    console.log("entro");

    const citiesRef = db.collection('usuario');
    const snapshot = await citiesRef.where('correo', '==', req.body.correo).get();
    if (snapshot.empty) {
        res.send({"success": false, "type": "Correo no registrado"});
        return;
    }

    snapshot.forEach(doc => {
        res.send({"success": true, "data": doc.data()});
        console.log(doc.id, '=>', doc.data());
    });

}

exports.insertarConfirmarcion = async (req, res, next) => {
    console.log(req.body);
    var codigo;

    const citiesRef = db.collection('usuario');
    const snapshot = await citiesRef.where('correo', '==', req.body.correo).get();
    if (snapshot.empty) {
        res.send({"success": false, "type": "Correo no registrado"});
        return;
    }

    snapshot.forEach(doc => {
        codigo = doc.data().codigo
    });

    if (codigo == req.body.codigo) {
        const userRef = db.collection('usuario').doc(req.body.id);

        userRef.update({
            codigo: false
        }).then( () => {
            console.log("termiono");
            res.send({"success": true, "type": "Codigo correcto"});
        }).catch( error => {
            console.log({"error": error});
            res.send({"success": false, "type": "Error al confirmar codigo"});
        })
    } else {
        res.send({"success": false, "type": "Codigo incorrecto"});
    }
}

exports.general = async (req, res, next) => {
    const citiesRef = db.collection('usuario');
    const snapshot = await citiesRef.where('correo', '==', req.body.correo).get();
    if (snapshot.empty) {
        res.send({"success": false, "type": "Correo no registrado"});
        return;
    }

    snapshot.forEach(doc => {
        res.send({"success": true, "data": {
            estadoAlarma: doc.data().estado,
            estadoCasa: doc.data().estadoCasa
        }});
        console.log(doc.id, '=>', doc.data());
    });
}
