
// Grabbing necessary modules (express.js and socket.io)
const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io')

// Initializing express.js app and socket.io server
const app = express(3000);
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

// Opens server listener on port 3000 (localhost:3000)
server.listen(3000, () => {
    console.log('server running at http://localhost:3000')
});