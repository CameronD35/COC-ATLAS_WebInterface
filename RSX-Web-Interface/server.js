const serverPort = 3000;
//const commPort = 42069;
//const IP = '192.168.1.10';
const IP = '127.0.0.1';
const nanoIP = '192.168.1.20';
let clients = []

// Grabbing necessary modules (express.js and socket.io)
const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');

// Used for checking avialable connections
const net = require('net');

// Used for creating/reading files
const { lstat } = require('node:fs');

// Used for user input
const readLine = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const { spawn } = require('node:child_process');

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
    const clientID = socket.handshake.auth.token;

    // this indicates that a new client has connected
    if (!clients.includes(clientID)) {
        clients.push(clientID);
    }


    io.emit('clientID', clients);
    console.log(`\u001b[1m${clientID}\u001b[0m connected`)
    io.emit('logMessage', `'${clientID}' connected`, false, true, false);
    io.emit('reqStaticData');
    // On disconnect, send message
    socket.on('disconnect', () => {
        io.emit('logMessage', `'${clientID}' disconnnected`, true, false, false);


        console.log(`\u001b[1m${clientID}\u001b[0m disconnected`);
    });

    
    
    // Response when any of the initialization processes are toggled on
    socket.on('ActivateInit', (sys) => {
        console.log(`Beginning \u001b[1m${sys}\u001b[0m Sequence.`);
        io.emit('executeFile', `${sys}.py`);
    });

    // Response when any of the initialization processes are toggled off
    socket.on('DeactivateInit', (sys) => {
        console.log(`Concluding \u001b[1m${sys}\u001b[0m Sequence.`);
        io.emit('terminateFile', `${sys}.py`);
    });

    // gets data from JON python script and posts it to all clients with handlers
    socket.on('data', (data) => {
        let formattedData = JSON.parse(data);
        console.log(formattedData);
        io.emit('logMessage', `Msg: ${formattedData.msg.join(', ')} Tags: ${formattedData.tags.join(', ')}`, false, false, false);
        io.emit('interpretData', formattedData);
    });

    // takes data from interface regarding data frequency and sends it over to JON python script
    socket.on('dataFreq', (freq) => {
        io.emit('changeFreq', freq);
    });

});


// Opens server listener on port serverPort (localhost:serverPort)
server.listen(serverPort, () => {
    console.log(`server running at http://${IP}:${serverPort}`);
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
            } else if (err.code == 'EADDRNOTAVAIL'){
                resolve(true);
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

async function promptForCommand() {

    const programCommand = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // https://betterstack.com/community/questions/how-to-change-color-of-console-output-node-js/
    const red = '\x1b[31m';
    const blue = '\x1b[34m';
    const purple = '\x1b[35m';
    const reset = '\x1b[0m';
    const strikethrough = '\x1b[9m';
    const command = await programCommand.question(`\n\n${purple}TYPE 'Q' TO${reset}${red} QUIT ${reset}${purple}OR USE ${reset}${blue}${strikethrough}WEB INTERFACE${reset}\n\n\n`);

    interpretCommand(command);
}

function interpretCommand(cmd) {
    if (cmd.toLowerCase() == 'q') {
        process.exit(0)
    }
}


setInterval( () => {
    
    let startTime = performance.now();

    checkCommPortAvailability(serverPort, nanoIP)
    .then((isAvailable) => {
        
        // let endTime = performance.now();

        // let timeElapsed = endTime - startTime;

        //console.log(isAvailable)
            if (isAvailable) {
                //console.log(`Port ${serverPort} is open.`);

                // Emit event stating that there is no connection on the commPort
                io.emit('commConnection', false, nanoIP, serverPort);

            } else {
                //console.log(`Port ${serverPort} is closed.`);

                // Emit event stating that there is a connection on the commPort
                // TODO: Check if connection is ethernet and not some other random thing
                io.emit('commConnection', true, nanoIP, serverPort);
            }
        }   
    )}
, 2500);

promptForCommand();



