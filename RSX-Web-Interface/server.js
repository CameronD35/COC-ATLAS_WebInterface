// Configuring dotenv module
// Y'all ain't getting my passwords
require('dotenv').config()

const serverPort = 3000;
//const IP = '192.168.1.10';
const IP = '127.0.0.1';
const nanoIP = process.env.NANOIP;
let clients = [];

// Grabbing necessary modules (express.js and socket.io)
const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');

// Used for checking avialable connections
const net = require('net');

// Used for creating/reading files
const { lstat, writeFile, write, createReadStream } = require('node:fs');

// Used for user input
const readLine = require('node:readline/promises');
const fs = require('node:fs/promises');


// Initializing express.js app and socket.io server
const app = express(serverPort);
const server = createServer(app);
const io = new Server(server);

// const multer = require("multer");
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     }, filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });
// const upload = multer({storage: storage});

// Client instance for postgresql
const { Client, Pool } = require('pg');

// ./databaseManager.js
const pgManager = require('./databaseManager.js');

// https://www.w3resource.com/PostgreSQL/snippets/postgresql-node-setup.php

// Initialize a new pgClient for connecting to the 'rsx25_test' database
// TODO: change 'rsx25_test' to 'rsx25' when deployment-ready
const pgPool = new Pool({
    user: process.env.PGUSERNAME,
    host: 'localhost',
    database: 'rsx25_test',
    // I'm being serious, you ain't getting these passwords
    password: process.env.PGPASSWORD,
    port: 5432
});

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

            io.emit('logMessage', `Error retriving log.txt file: ${err}`, 'error');

        } else {

            io.emit('logMessage', 'Retrieved file successfully!', 'connect');

        }

    });

})

// Sends message to server when a client connects or disconnects

io.on('connection', (socket) => {
    // gets the name of the client
    const clientID = socket.handshake.auth.token;

    // // creates 
    // createTableQuery();

    // this indicates that a new client has connected
    if (!clients.includes(clientID)) {
        clients.push(clientID);
    }

    const connectMsg = `${clientID} connected`;

    // Update list of clients (excluding duplicates)
    io.emit('clientID', clients);


    //console.log(connectMsg);
    writeToLog(connectMsg, 'C');


    io.emit('logMessage', `'${clientID}' connected`, 'connect');

    // request static data such as IP, OS, and Name
    io.emit('reqStaticData');

    // On disconnect, send message
    socket.on('disconnect', () => {
        const msg = `'${clientID}' disconnnected`;
        io.emit('logMessage', msg, 'error');

        writeToLog(msg, '!!');

        //console.log(msg);
    });

    
    
    // Response when any of the initialization processes are toggled on
    socket.on('interfaceCommand', (cmd) => {
        emitCommand(cmd);
    });


    // gets data from JON python script and posts it to all clients with handlers
    // Additionally, it grabs the data and pushes it to the database
    socket.on('data', (data) => {
        let formattedData = JSON.parse(data);
        const runtime = Math.round(process.uptime() * 1000) / 1000;

        // Adds current runtime to data for graphs
        formattedData['time'] = runtime;

        //const msg = `Msg: ${formattedData.msg.join(', ')} Tags: ${formattedData.tags.join(', ')}`;

        console.log(formattedData);
        io.emit('logMessage', data, 'data');
        io.emit('interpretData', formattedData);

        const insertQuery = pgManager.createInsertQuery({
            temp: formattedData.temp,
            pres: formattedData.pres,
            cpu: formattedData.cpupercent,
            sesh_runtime: runtime,
        });

        writeToLog(data, '!');
    });

    // takes data from interface regarding data frequency and sends it over to JON python script
    socket.on('dataFreq', (freq) => {
        const msg = `Changing frequency to ${freq} seconds.`
        io.emit('changeFreq', freq);

        writeToLog(msg);
    });

    // writeToLog has two arguments: 'msg' and 'type'
    // socket.on('writeLog', writeToLog);

});


// Opens server listener on port serverPort (IP:serverPort)
server.listen(serverPort, async () => {
    const green = '\x1b[32m';
    const reset = '\x1b[0m';
    console.log(`server running at ${green}http://${IP}:${serverPort}${reset}\n\n`);
    initializeFiles();

    // https://www.w3resource.com/PostgreSQL/snippets/postgresql-node-setup.php
    // connect to the database
    pgPool.connect()
    .then(() => {console.log('Connected To PostgreSQL')})
    .then(() => {
        const query = pgManager.createTableQuery();

        pgPool.query(query)
        .then(() => {console.log('created query')})
        .catch((err) => {console.error('bruh', err.stack)});
    })
    .catch((err) => {console.error('Connection error', err.stack)});

    const client = await pgPool.connect();

    await client.query('LISTEN virtual')
    .then((res) => {
        console.log('initialized listener');
    });

    client.on('notification', (noti) => {
        //
    });

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
let programCommand = createInput();

function createInput() {
    return readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}


async function beginPrompts(){
    // https://betterstack.com/community/questions/how-to-change-color-of-console-output-node-js/
    const red = '\x1b[31m';
    const blue = '\x1b[34m';
    const purple = '\x1b[35m';
    const reset = '\x1b[0m';
    const strikethrough = '\x1b[9m';

    // Provides info on killing/quitting server
    const prompt = `\n\n${purple}TYPE 'Q' AT ANY POINT TO${reset}${red} KILL SERVER ${reset}${purple}OR USE ${reset}${blue}${strikethrough}WEB INTERFACE${reset}\n${purple}`;

    promptForCommand(prompt);
}

// Propmts for a command in the terminal
// Q kills the server
// C displays the current client(s) connected
async function promptForCommand(prompt) {
    const command = await programCommand.question(prompt)
    interpretCommand(command);

    return command;
}

// Case-insensitive
async function interpretCommand(cmd) {

    //let depthOrder = 1;
    let command = cmd.toLowerCase();

    // quits program if command == 'q'
    checkForQuitOrExit(command);

    switch (command) {

        // provides a guide to all possible commands
        case 'h':

            console.log('no help for you');

            break;

        // returns all active clients
        case 'c':

            const clientStr = clients.join(', ');

            if (clientStr.length <= 1) {
                console.log('No active clients.');
                break;
            }

            console.log('Active clients:', clients.join(', ') + '.\n\n');
            break;
        
        // download the log file
        case 'd':
            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
            // https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
            let url;
            const destination = await programCommand.question('Please enter a valid path to download to: ');

            checkForQuitOrExit(destination);

            const file = await programCommand.question(`Which file would you like ('d' for data, 'l' for log):`);
            `http://${IP}:${serverPort}/downloadLog`;

                const response = fetch(url)
                .then((res) => {
                    console.log('hi')
                })
                .catch((err) => {
                    console.log('bye');
                });
            
            break;
        // used to move a motor -> specifiy motor -> specify degree of rotation
        case 'm':

            //depthOrder++;

            let motorNum = await programCommand.question('Choose motor number: ');
            
            // quits program if command == 'q'
            checkForQuitOrExit(motorNum);

            // TODO: Remove this variable and replace with dynamic alternative
            let numOfMotors = 3;

            // response will be a string first
            motorNum = parseInt(motorNum, 10);
            
            // For you trolls that put letters, you've been caught with the NaN statement >:]
            if (isNaN(motorNum)) {
                console.log("\nNah, that ain't working =):-)");
                break;
            }

            // The standard will be that there are no motors with an id of or less than 0
            // TODO: Make the number of motors dynamic
            if (motorNum == NaN || motorNum <= 0 || motorNum > numOfMotors) {
                console.log('Invalid motor ID. Redo command.');
                break;
            }

            let degOfRotation = await programCommand.question('Specify degree of rotation (p for preset values): ');

            // quits program if command == 'q'
            checkForQuitOrExit(degOfRotation);

            if (degOfRotation.toLowerCase() == 'p') {

                const chainedCommand = `m${motorNum},p`
                emitCommand(chainedCommand);
                break;

            } else if (isNaN(degOfRotation)) {

                console.log("\nNahhh, you really thought that slide? ب_ب");
                break;

            } else {

                // This prevents degree amounts from being too high
                const reducedDegrees = degOfRotation % 180;

                const chainedCommand = `m${motorNum},${reducedDegrees}`
                emitCommand(chainedCommand);
                break;

            }



            degOfRotation = parseInt(degOfRotation);





            //const response = await emitCommand(action);

            break;

    }

    // This makes sure that the user is repeatedly asked for a command
    // Returns to original prompt
    beginPrompts();
}

async function emitCommand(cmd) {
    const msg = `Running command: ${cmd}`;
    writeToLog(msg);

    io.emit('command', cmd);
}

function checkForQuitOrExit(val) {
    if (val == 'q') {

        console.log('\nCleaning up.\n')

        process.exit(0);

    }
}

beginPrompts();

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
    )

    const runtime = process.uptime().toFixed(3);

    const insertQuery = pgManager.createInsertQuery({temp: Math.random()*50, pres: Math.random()*50, sesh_runtime: runtime});

    //const selectQuery = pgManager.createSearchQuery();

    pgPool.query(insertQuery)
    .then((res) => {
        //console.log(`query ${insertQuery} successful`);
        
        //let data = res.rows;

        // let graphDataFormat = [];

        // data.forEach((point, i) => {
        //     graphDataFormat.push({
        //         x: point.sesh_runtime,
        //         y: point.temp
        //     });
        // });

        //console.log(graphDataFormat);
    })
    .catch((err) => {
        console.error(`Query: ${insertQuery} unsuccessful, ${err}`);
    });

}
, 2500);