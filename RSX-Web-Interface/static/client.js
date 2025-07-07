// THIS FILE MANAGES ANY DYNAMIC ELEMENTS ON THE PAGE (BESIDES THE GRAPHS)
// MORE IMPORTANLY, IT MANAGES COMMUNICATIONS WITH THE SERVER

// modules from ./modules
import pushChatToLog from "./modules/chatLog.js";
import getTime from "./modules/getTime.js";
import showOverlay, {graphArray} from "./render.js";
import createHTMLChildElement from "./modules/createElement.js";
import elementMap from "./modules/elementMap.js";
import createScene from "./modules/createModel.js";

let time = 15;
// holds 100 data points for the graphs
let dataStorage = {
    'temperature': [],
    'pressure': [],
    'cloud points': [],
    'cpu usage': [],
    'time': []
};

// Global io variable. It's initialization sends message to server that a client has connected.
const socket = io({
    auth: {
        token: 'Laptop'
    }
});

const nanoIP = '192.168.1.20';

export default socket;

let clientsConnected = []

// socket event that creates message on all clients
socket.on('logMessage', (msg, type) => {
    if (type != null){
        pushChatToLog(getTime(), msg, type);
    } else {
        pushChatToLog(getTime(), msg);
    }
});

// measures and displays the time taken to contact the server; updates connection status section
socket.on('commConnection', (isConnected, IP, portNumber) => {

    //console.log(timeElapsed);
    updateElement('ConConnectionStatusData0', `PORT:${portNumber}`, 'var(--mainColor)');

    if (isConnected) {
        //console.log(`Connection established on port number ${portNumber} with ip ${IP}`);
        return;

    } else {
        console.log(`No connection detected on port number ${portNumber} with ip ${IP}`);
        updateElement('ConConnectionStatusData0', `NONE`, 'var(--webInterfaceRed)');
        const overlay = document.getElementById('overlay');

        const errorClosed = overlay.getAttribute('data-portErr');
        const overlayOccupied = overlay.getAttribute('data-occupied');
        

        // Show an overlay identifying a lack of connection (only happens once)
        // if (errorClosed == 'false' && overlayOccupied == 'false'){
        //     showOverlay(createPortMessage);
        // }

        // ^^ I REMOVED THE ABOVE FEATURE BECAUSE ITS ANNOYING ^^
    }



});

socket.on('clientID', (clients) => {
    updateClientDisplay(clients);
});

// Used to grab any values (such as os or ip) and display them
socket.on('interpretData', (data) => {
    console.log('eoifewbfgfvefyktew');
    console.log('IM WORKING!!!!!!!');

    const ramString = ``;

    const dataKeys = Object.keys(data);

    // Uses the elementMap in eleementMap.js to match incoming data to a DOM element
    dataKeys.forEach((key, i) => {
        let element = document.getElementById(elementMap[key]);

        // Some datapoints may not have associated DOM elements
        if (element != null) {
            element.textContent = data[key];
        }
    });

    pushToData(data, dataStorage, 100);

});

// TODO: Add a warning on the interface before killing the server
// use promises?
socket.on('serverKilled', (callback) => {
    // await promptForDownloads();
    // window.close();

    console.log('test');
    callback({
        msg: "lets go"
    });
});


document.addEventListener('DOMContentLoaded', () => {

    updateTime();

    // Activate TOF Sensor Checkbox
    document.getElementById('IniFeaturescheckbox0').addEventListener('input', (evt) => {
        if(evt.target.checked){
            pushChatToLog(getTime(), 'Activating TOF sensor.');
            socket.emit('ActivateInit', 'time of flight sensor');
        } else {
            pushChatToLog(getTime(), 'Deactivating TOF sensor.');
            socket.emit('DeactivateInit', 'time of flight sensor');
        }
    });

    // Activate Deployment System Checkbox
    document.getElementById('IniFeaturescheckbox1').addEventListener('input', (evt) => {
        if(evt.target.checked){
            pushChatToLog(getTime(), 'Activating deployment system.');
            socket.emit('ActivateInit', 'deployment system');
        } else {
            pushChatToLog(getTime(), 'Deactivating deployment system.');
            socket.emit('DeactivateInit', 'deployment system');
        }
    });

    // Rotate Motors
    document.getElementById('IniFeaturescheckbox2').addEventListener('input', (evt) => {
        if(evt.target.checked){
            pushChatToLog(getTime(), 'Activating motor rotation.');
            socket.emit('ActivateInit', 'motor rotation');
        } else {
            pushChatToLog(getTime(), 'Deactivating motor rotation.');
            socket.emit('DeactivateInit', 'motor rotation');
        }
    });

    // Rotate Mirrors
    document.getElementById('IniFeaturescheckbox3').addEventListener('input', (evt) => {
        if(evt.target.checked){
            pushChatToLog(getTime(), 'Activating mirror rotation.');
            socket.emit('ActivateInit', 'mirror rotation');
        } else {
            pushChatToLog(getTime(), 'Deactivating mirror rotation.');
            socket.emit('DeactivateInit', 'mirror rotation');
        }
    });

    // Update IP address as shown in the top section
    document.getElementById('IP ComputerDataPoint').textContent = nanoIP;


    // Adds responsive trait to 3D Render
    let scene = createScene(document.getElementById('modelRender'), [document.getElementById('modelRender').getBoundingClientRect().width, document.getElementById('modelRender').getBoundingClientRect().height]);
    scene.create();

    window.addEventListener('lightOn', () => {
        scene.changeBackgroundColor(0xe0e0e0);
    });

    window.addEventListener('lightOff', () => {
        scene.changeBackgroundColor(0x1f1f1f);
    });


    window.addEventListener('resize', scene.resizeScene);

    // Listens for download button click and requests log file from server
    document.getElementById('downloadContainer').addEventListener('click', () => {
    });
    
    // TESTING: Generates random numbers for graph
    // setInterval(() => {
    //     graphArray.forEach((item, i) => {
    //         updateElement(null, Math.round(Math.random()*10), null, item);
    //     });
    // }, 1000);
});

// TODO
async function promptForDownloads() {
    showOverlay();
}

// TODO
function createDownloadPrompt() {
    
}

function updateClientDisplay(clientArray) {

    console.log(clientArray);
    const clientDisplay = document.getElementById('CliConnectionStatusData1');

    clientDisplay.textContent = clientArray.join(', ');

}

// creates box that will display when no connection is found
function createPortMessage(portNumber=3000, container=document.getElementById('overlayContentContainer')){
    let portErrorContainer = createHTMLChildElement(container, 'div', 'portErrorContainer');


    let portErrorText = createHTMLChildElement(portErrorContainer, 'div', 'portErrorText', `No connection found on PORT:${3000}`);

    let overlay = document.getElementById('overlay');

    overlay.setAttribute('data-portErr', 'true');

    return portErrorContainer;
}

// updates an element with a new value
function updateElement(elementID, newValue, color=null, graph=null){
    
    if (graph) {
        graph.update(newValue);
        return;
    }
    
    let elem = document.getElementById(elementID);
    elem.textContent = newValue;

    if (color) {
        elem.style.color = color;
    }
} 


// updates time in log section
function updateTime(){
    let timeText = document.getElementById('timeText');
    let currentTime = getTime();
    timeText.textContent = currentTime;

    setInterval(() => {
        currentTime = getTime();
        timeText.textContent = currentTime;
    }, 1000)
}

// pushes newData (the incoming data) to the dataObj
// limits the amount of entries in dataObj to entryLimit
function pushToData(newData, dataObj, entryLimit) {

    // grabs the name of keys in targetObj
    const keysList = Object.keys(dataObj);

    // the length should be constant across the dataObj
    const dataObjLength = dataObj['time'].length;

    const atOrOverLimit = (dataObjLength >= entryLimit);


    keysList.forEach((key, i) => {



        if (isNaN(newData[key]) && newData[key] != null) {
            newData[key] = parseFloat(newData[key]);
        }

        // corresponding datapoint
        // ex: dataObj = {x: 3, y: 5} and key = y, then dataPoint = 5
        const dataPoint = newData[key];

        //console.log(dataObj[key], atOrOverLimit)
        // removes the first element from the list
        if (atOrOverLimit) {
            //console.log('1738, I say hey wassup hello');
            //console.log(dataObj[key])
            dataObj[key].splice(0, 1);
        }

        dataObj[key].push(dataPoint);
    });

    updateGraphs(dataObj);

    //console.log('end', dataObj);
    //console.log(`INFO\n${keysList}\n${targetLength}\n${firstEntryID}\n${lastEntryID}\n`)
}

function updateGraphs(dataObj) {
    

    graphArray.forEach((elem, i) => { 

        const graphNum = i + 1;

        if (graphNum != 3) {
            //console.log(currSet)
            const elemContainer = elem.container;
            const currSet = elemContainer.getAttribute('data-currset');
            const dropdownSet = document.getElementById(`dropdownMenu${graphNum}`).getAttribute('data-currset');
            
            //console.log(currSet, dropdownSet, graphNum);
            elemContainer.setAttribute('data-currset', dropdownSet);
            //console.log(dataObj[currSet]);
            if (dataObj[dropdownSet] != null) {
                //console.log('th3io7erty3bg2er82')
                elem.dataset = formatDataForGraphs(dataObj, dropdownSet);
                //console.log(elem.dataset);
                changeGraphColor(dropdownSet, graphNum);
            }  

            elem.update();

        }
    });
}

function changeGraphColor(dataset, graphNum) {
    const graphMainColorCSS = `--graphMainColor${graphNum}`
    switch (dataset) {
        case 'temperature':
            document.documentElement.style.setProperty(graphMainColorCSS, 'var(--webInterfaceRed)')
            break;
        case 'pressure':
            document.documentElement.style.setProperty(graphMainColorCSS, 'var(--webInterfaceOrange)')
            break;
        case 'cloud points':
            document.documentElement.style.setProperty(graphMainColorCSS, 'var(--mainColor)')
            break;
        case 'cpu usage':
            document.documentElement.style.setProperty(graphMainColorCSS, 'var(--webInterfaceGreen)')
            break;
    }
}

function formatDataForGraphs(dataObj, target) {

    const targetArr = dataObj[target];

    const timeArr = dataObj['time'];

    let formattedArr = []

    targetArr.forEach((elem, i) => {
        //console.log('ou2y3g823oeyf')
        formattedArr.push({
            x: timeArr[i],
            y: elem
        });
    });

    //console.log(formattedArr);

    return formattedArr;
}

//console.log('start', data);

// setInterval(() => {
//     pushToData({
//         'temperature': 64 + Math.random()* 5,
//         'pressure': 5 + Math.random()* 5,
//         'cloud points': 2036 + Math.random()* 5,
//         'cpu usage': 4.7 + Math.random()* 5,
//         'time': ++time
//     }, dataStorage, 100)
// }, 1000);

// updateGraphs(dataStorage);

updateElement('dataValue1', 34);