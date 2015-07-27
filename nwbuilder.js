/**
 * Created by USER on 26.07.2015.
 */
var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
    files: './breathe/**/**', // use the glob format
    platforms: ['win64'],
    gypModules: ['gyp', 'zmq', './breathe/node_modules/serialport/build/serialport/v1.7.4/Release/node-v14-win32-x64/serialport']
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
    console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
