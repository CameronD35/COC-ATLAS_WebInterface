const serverPort = 3000;
//const commPort = 42069;
const IP = '192.168.1.10'
const nanoIP = '192.168.1.20'

// Grabbing necessary modules (express.js and socket.io)
const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');

const net = require('net');
const { create } = require('node:domain');

// Initializing express.js app and socket.io server
const app = express(serverPort);
const server = createServer(app);
const io = new Server(server);

// const app2 = express();
// const server2 = createServer(app2);
// const io2 = createServer(server2);

// server2.listen('3001', '192.168.1.10', () => {
//     console.log('test');
// });

// app2.get('/', (req, res) => {
//     console.log('hi');
// });

// io2.on('connection', (socket) => {
//     console.log('working');

//     socket.on('disconnect', () => {
//         io.emit('logMessage', 'User connected');
//         console.log('jon disconnected');
//     });
// })

// Serving the static files (in the /static directory) to the client (browser)
app.use(express.static('static'));

// The home route handler; essentially the first page/link 
// that opens upon accessing the URL
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Sends message to server when a client connects or disconnects

io.on('connection', (socket) => {
    io.emit('logMessage', 'User connected', false, true);
    // On disconnect, send message
    socket.on('disconnect', () => {
        io.emit('logMessage', 'User disconnnected', true, false);
        console.log('A user disconnected');
    });
    
    // Response when any of the initialization processes are toggled on
    socket.on('ActivateInit', (sys) => {
        console.log(`Beginning \u001b[1m${sys}\u001b[0m Sequence.`);
    });

    // Response when any of the initialization processes are toggled off
    socket.on('DeactivateInit', (sys) => {
        console.log(`Concluding \u001b[1m${sys}\u001b[0m Sequence.`);
    });

    socket.on('data', () => {
        console.log('test')
    });
});


// Opens server listener on port serverPort (localhost:serverPort)
server.listen(serverPort, IP, () => {
    console.log(`server running at http://${IP}:${serverPort}`)
});

function checkCommPortAvailability(portNumber, nanoIP){
    // Promise that returns if the port is occupied or not
    return new Promise((resolve, reject) => {
        const testServer = net.createServer();

        testServer.once('error', (err) => {
            // This error code indicates that the port is in use by some other application
            if (err.code == 'EADDRINUSE'){
                resolve(false);
            // Other errors
            } else {
                reject(err)
            }
        });

        // If the server is opened, that indicates it's unoccupied
        // Since we don't want to establish a connection yet, we close the server and resolve the Promise as true
        testServer.once('listening', () => {
            testServer.close();
            resolve(true);
        });

        // Attempt to listen on port portNumber
        testServer.listen(portNumber, IP);

    });
}


setInterval( () => {
    
    let startTime = performance.now();

    checkCommPortAvailability(serverPort, nanoIP)
    .then((isAvailable) => {

        let endTime = performance.now();

        let timeElapsed = endTime - startTime;

        console.log(isAvailable)
            if (isAvailable) {
                //console.log(`Port ${serverPort} is open.`);

                // Emit event stating that there is no connection on the commPort
                io.emit('commConnection', false, nanoIP, serverPort, timeElapsed);

            } else {
                //console.log(`Port ${serverPort} is closed.`);

                // Emit event stating that there is a connection on the commPort
                // TODO: Check if connection is ethernet and not some other random thing
                io.emit('commConnection', true, nanoIP, serverPort, timeElapsed);
            }
        }   
    )}
, 2500)
