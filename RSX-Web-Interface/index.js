const serverPort = 3000;
const commPort = 42069;

// Grabbing necessary modules (express.js and socket.io)
const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');

const net = require('net');

// Initializing express.js app and socket.io server
const app = express(serverPort);
const server = createServer(app);
const io = new Server(server);

// Serving the static files (in the /static directory) to the client (browser)
app.use(express.static('static'))

// The home route handler; essentially the first page/link 
// that opens upon accessing the URL
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Sends message to server when a client connects or disconnects

io.on('connection', (socket) => {
    io.emit('logMessage', 'User connected');
    // On disconnect, send message
    socket.on('disconnect', () => {
        io.emit('logMessage', 'User connected');
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
});

// Opens server listener on port serverPort (localhost:serverPort)
server.listen(serverPort, () => {
    console.log(`server running at http://localhost:${serverPort}`)
});

function checkCommPortAvailability(portNumber){
    // Promise that returns if the port is occupied or not
    return new Promise((resolve, reject) => {
        const server = net.createServer();

        server.once('error', (err) => {
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
        server.once('listening', () => {
            server.close();
            resolve(true);
        });

        // Attempt to listen on port portNumber
        server.listen(portNumber);

    });
}


setInterval( () => {
    checkCommPortAvailability(commPort)
    .then((isAvailable) => {
        console.log(isAvailable)
            if (isAvailable) {
                console.log(`Port ${commPort} is open.`);
                // Emit event stating that there is no connection on the commPort
                io.emit('commConnection', false, commPort);

            } else {
                console.log(`Port ${commPort} is closed.`);
                // Emit event stating that there is a connection on the commPort
                // TODO: Check if connection is ethernet and not some other random thing
                io.emit('commConnection', true, commPort);
            }
        }   
    )}
, 10000)
