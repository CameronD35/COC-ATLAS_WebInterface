// THIS FILE MANAGES ANY DYNAMIC ELEMENTS ON THE PAGE (BESIDES THE GRAPHS)
// MORE IMPORTANLY, IT MANAGES COMMUNICATIONS WITH THE SERVER

import pushChatToLog from "./modules/chatLog.js";
import getTime from "./modules/getTime.js";
import showOverlay, {graphArray} from "./render.js";
import createHTMLChildElement from "./modules/createElement.js";
import elementMap from "./modules/elementMap.js";
import createScene from "./modules/createModel.js"

// Global io variable. It's initialization sends message to server that a client has connected.
const socket = io();
const nanoIP = '192.168.1.20';

export default socket;


let errorClosed = false;

// socket event that creates message on all clients
socket.on('logMessage', (msg, isError, isConnect) => {
    if (isError != null && isConnect != null){
        pushChatToLog(getTime(), msg, isError, isConnect);
    } else {
        pushChatToLog(getTime(), msg);
    }
});

// measures and displays the time taken to contact the server; updates connection status section
socket.on('commConnection', (isConnected, IP, portNumber, timeElapsed) => {

    //console.log(timeElapsed);
    updateConnectionQuality(isConnected, timeElapsed);
    updateElement('ConConnectionStatusData0', `PORT:${portNumber}`, 'var(--mainColor)');

    if (isConnected) {
        //console.log(`Connection established on port number ${portNumber} with ip ${IP}`);

    } else {
        console.log(`No connection detected on port number ${portNumber} with ip ${IP}`);
        updateElement('ConConnectionStatusData0', `NONE`, 'var(--webInterfaceRed)');
        updateElement('ConConnectionStatusData1', 'N/A', 'var(--mainColor)');
        updateElement('AvgConnectionStatusData2', 'N/A');
        // Show an overlay identifying a lack of connection (only happens once)
        if (!errorClosed){
            showOverlay(createPortMessage);
        }
    }



});

// Used to grab any values (such as os or ip) and display them
socket.on('interpretData', (data) => {
    console.log('eoifewbfgfvefyktew');
    console.log('IM WORKING!!!!!!!')
    if (typeof data.msg === 'string'){
        let element = document.getElementById(elementMap[data.tags]);

        element.textContent = data.msg;

        return;
    }

    data.tags.forEach((tag, i) => {
        let element = document.getElementById(elementMap[tag]);

        element.textContent = data.msg[i];
    });
})


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

    document.getElementById('IP ComputerDataPoint').textContent = nanoIP;

    let scene = createScene(document.getElementById('modelRender'), [document.getElementById('modelRender').getBoundingClientRect().width, document.getElementById('modelRender').getBoundingClientRect().height]);
    scene.create();
    //window.addEventListener('resize', scene.resizeScene);

    setInterval(() => {
        graphArray.forEach((item, i) => {
            updateElement(null, Math.round(Math.random()*10), null, item);
        });
    }, 1000);
});

// creates box that will display when no connection is found
function createPortMessage(portNumber=3000, container=document.getElementById('overlayContentContainer')){
    let portErrorContainer = createHTMLChildElement(container, 'div', 'portErrorContainer');

    let portErrorText = createHTMLChildElement(portErrorContainer, 'div', 'portErrorText', `No connection found on PORT:${3000}`);

    errorClosed = true;

    return portErrorContainer;
}

// updates connection quality in connection status section
function updateConnectionQuality(isConnected, timeToTransmit){

    if(!isConnected){
        updateElement('ConConnectionStatusData0', 'NONE', 'var(--webInterfaceRed)');
        updateElement('ConConnectionStatusData1', 'N/A', 'var(--mainColor)');
        updateElement('AvgConnectionStatusData2', 'N/A');

        return;
    }

    let quality = gaugeConnectionQuality(timeToTransmit);

    updateElement('ConConnectionStatusData1', quality, (() => {
            if (quality == 'Good'){
                return 'var(--webInterfaceGreen)'
            } else if (quality == 'Ok'){
                return 'var(--webInterfaceOrange)'
            } else if (quality == 'Bad'){
                return 'var(--webInterfaceRed)'
            }
        })()
    );

    updateElement('AvgConnectionStatusData2', `${timeToTransmit.toFixed(2)}ms`);
}

function gaugeConnectionQuality(timeToTransmit){

    if (timeToTransmit <= 1){
        return 'Good'
    } else if (timeToTransmit <= 3){
        return 'Ok'
    } else {
        return 'Bad'
    }
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

function interpretIncomingJSON(){
    
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

updateElement('dataValue1', 34);