// Grabbing necessary modules (express.js and socket.io)
const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');

// Used for checking avialable connections
const net = require('net');

// Used for creating/reading files
const { lstat, writeFile, write } = require('node:fs');

// Used for user input
const readLine = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');

// Initializing express.js app and socket.io server
const app = express(serverPort);
const server = createServer(app);
const io = new Server(server);

// Configuring dotenv module
require('dotenv').config()

const serverPort = 3000;
//const IP = '192.168.1.10';
const IP = '127.0.0.1';
const nanoIP = process.env.NANOIP;
let clients = []

// Serving the static files (in the /static directory) to the client (browser)
app.use(express.static('static'));

// The home route handler; essentially the first page/link 
// that opens upon accessing the URL
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.get('/downloadLog', (req, res) => {

    // Getting a time format that will be used for the log file's name
    const date = new Date(Date.now())

    const calendarDate = date.toDateString().substring(4).replaceAll(' ', '-');
    const currentTime = date.toTimeString().substring(0, 8).replaceAll(':', '-');

    const fullDate = calendarDate + '_' + currentTime;

    const fileName = 'ATLASLOG_' + fullDate + '.txt';

    //console.log(fileName);

    // download the file, but output an error to the interface log if something goes awry
    res.download('./output/log.txt', fileName, (err) => {

        if (err) {

            io.emit('logMessage', `Error retriving log.txt file: ${err}`, true, false, true);

        } else {

            io.emit('logMessage', 'Retrieved file successfully!', false, true, false);

        }

    });

})

// Sends message to server when a client connects or disconnects

io.on('connection', (socket) => {
    const clientID = socket.handshake.auth.token;

    // this indicates that a new client has connected
    if (!clients.includes(clientID)) {
        clients.push(clientID);
    }

    const connectMsg = `${clientID} connected`;

    // Update list of clients (excluding duplicates)
    io.emit('clientID', clients);


    //console.log(connectMsg);
    writeToLog(connectMsg, 'C');


    io.emit('logMessage', `'${clientID}' connected`, false, true, false);

    // request static data such as IP, OS, and Name
    io.emit('reqStaticData');
    // On disconnect, send message
    socket.on('disconnect', () => {
        const msg = `'${clientID}' disconnnected`;
        io.emit('logMessage', msg, true, false, false);

        writeToLog(msg, '!!');

        //console.log(msg);
    });

    
    
    // Response when any of the initialization processes are toggled on
    socket.on('ActivateInit', (sys) => {
        const msg = `Beginning ${sys} Sequence.`
        //console.log(`Beginning \x1b[1m${sys}\x1b[0m Sequence.`);
        io.emit('executeFile', `${sys}.py`);

        writeToLog(msg);
    });

    // Response when any of the initialization processes are toggled off
    socket.on('DeactivateInit', (sys) => {
        const msg = `Terminating ${sys} Sequence.`
        //console.log(`Beginning \x1b[1m${sys}\x1b[0m Sequence.`);
        io.emit('terminateFile', `${sys}.py`);

        writeToLog(msg, '!');
    });

    // gets data from JON python script and posts it to all clients with handlers
    socket.on('data', (data) => {
        let formattedData = JSON.parse(data);

        const msg = `Msg: ${formattedData.msg.join(', ')} Tags: ${formattedData.tags.join(', ')}`;

        console.log(formattedData);
        io.emit('logMessage', msg, false, false, false);
        io.emit('interpretData', formattedData);

        writeToLog(msg, '!');
    });

    // takes data from interface regarding data frequency and sends it over to JON python script
    socket.on('dataFreq', (freq) => {
        const msg = `Changing frequency to ${freq} seconds.`
        io.emit('changeFreq', freq);

        writeToLog(msg);
    });

    // writeToLog has two arguments: 'msg' and 'type'
    //socket.on('writeLog', writeToLog);

});


// Opens server listener on port serverPort (IP:serverPort)
server.listen(serverPort, () => {
    const green = '\x1b[32m';
    const reset = '\x1b[0m';
    console.log(`server running at ${green}http://${IP}:${serverPort}${reset}\n\n`);
    initializeFiles();
});

// Writes a message to the log with the format specificed in the ./output/log.txt file
async function writeToLog(msg, tag) {
    const logFile = './output/log.txt';
    const time = new Date(Date.now()).toTimeString().substring(0, 8);
    const runtime = process.uptime().toFixed(3);

    // This is done so that an undefined type does not get thrown into the written string
    let tagStr = '';

    if (tag) {
        tagStr = ` (${tag})`;
    }

    try {

        await fs.writeFile(logFile, `[${time}] [${runtime}]${tagStr}: ${msg}\n`, {flag: 'a'});

    } catch (err) {

        console.error(err);

    }
    
}

// Adds FORMAT and TYPE lines to the ./output/log.txt file
async function initializeFiles() {
    const logFile = './output/log.txt';
    await fs.writeFile(logFile, `FORMAT >> [Real World Time] [Runtime] (tags): msg\nTYPES >> !!: Err, !: Warning, C: Connection, D: Data\n\n`);
}

// checks if the IP:PORT is avaialble
// a successful connection here indicates it is open and unoccupied
function checkCommPortAvailability(portNumber, IP){
    // Promise that returns if the port is occupied or not
    return new Promise((resolve, reject) => {
        const testServer = net.createServer();

        testServer.once('error', (err) => {
            // This error code indicates that the port is in use by some other application
            if (err.code == 'EADDRINUSE'){
                resolve(false);
            // This error indicates that the port is not available 
            } else if (err.code == 'EADDRNOTAVAIL'){
                resolve(true);
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

// interface for interacting with terminal
const programCommand = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});


// Propmts for a command in the terminal
// Q kills the server
// C displays the current client(s) connected
async function promptForCommand() {

    // https://betterstack.com/community/questions/how-to-change-color-of-console-output-node-js/
    const red = '\x1b[31m';
    const blue = '\x1b[34m';
    const purple = '\x1b[35m';
    const reset = '\x1b[0m';
    const strikethrough = '\x1b[9m';
    const command = await programCommand.question(`\n\n${purple}TYPE 'Q' TO${reset}${red} QUIT ${reset}${purple}OR USE ${reset}${blue}${strikethrough}WEB INTERFACE${reset}\n`);


    interpretCommand(command);
}

// Case-insensitive
async function interpretCommand(cmd) {
    let command = cmd.toLowerCase();

    switch (command) {

        case 'q':

            try {

                const response = await io.timeout(10000).emitWithAck('serverKilled');

                console.log(response);

            } catch (err) {

                console.log(err);

            }

            await writeToLog('SERVER KILLED', '!!');
            process.exit(0);
        
        case 'c':

            const clientStr = clients.join(', ');

            if (clientStr.length <= 1) {
                console.log('No active clients.');
                break;
            }

            console.log('Activate clients: ', clients.join(', '), '.\n\n');
            break;

    }

    // This makes sure that the user is repeatedly asked for a command
    promptForCommand();
}

promptForCommand();

// Checks the IP:PORT for availibility periodically
setInterval( () => {
    
    let startTime = performance.now();

    checkCommPortAvailability(serverPort, nanoIP)
    .then((isAvailable) => {

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