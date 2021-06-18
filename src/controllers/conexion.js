const nodemailer = require("nodemailer");
const admin = require('firebase-admin');


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
