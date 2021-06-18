const Serialport = require('serialport');
const Readline = Serialport.parsers.Readline;

const port = new Serialport('COM3', {
    baudRate: 9600
});

const parser = port.pipe(new Readline({ delimeter: '\r\n'}));

parser.on('open', function () {
    console.log('connection is open')
});

parser.on('data', function (data) {
    console.log(data)
});

port.on('error', function (err) {
    console.log(err)
});