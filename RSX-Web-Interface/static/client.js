// THIS FILE MANAGES ANY DYNAMIC ELEMENTS ON THE PAGE (BESIDES THE GRAPHS)
// MORE IMPORTANLY, IT MANAGES COMMUNICATIONS WITH THE SERVER

import pushChatToLog from "./modules/chatLog.js";
import getTime from "./modules/getTime.js";
import showOverlay from "./render.js";
import createHTMLChildElement from "./modules/createElement.js";

// Global io variable. It's initialization sends message to server that a client has connected.
const socket = io();

let errorClosed = false;

socket.on('logMessage', (msg) => {
    pushChatToLog(getTime(), msg, false, true);
});

socket.on('commConnection', (isConnected, portNumber, timeElapsed) => {

    console.log(timeElapsed);
    updateConnectionQuality(isConnected, timeElapsed);
    updateElement('ConConnectionStatusData0', `PORT:${portNumber}`, 'var(--mainColor)');

    if (isConnected) {
        console.log(`Connection established on port number ${portNumber}`);

    } else {
        console.log(`No connection detected on port number ${portNumber}`);
        updateElement('ConConnectionStatusData0', `NONE`, 'var(--webInterfaceRed)');
        // Show an overlay identifying a lack of connection (only happens once)
        if (!errorClosed){
            showOverlay(createPortMessage);
        }
    }



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
});

function createPortMessage(portNumber=42069, container=document.getElementById('overlayContentContainer')){
    let portErrorContainer = createHTMLChildElement(container, 'div', 'portErrorContainer');

    let portErrorText = createHTMLChildElement(portErrorContainer, 'div', 'portErrorText', `No connection found on PORT:42069`);

    errorClosed = true;

    return portErrorContainer;
}

function updateConnectionQuality(isConnected, timeToTransmit){

    // if(!isConnected){
    //     updateElement('ConConnectionStatusData0', 'NONE', 'var(--webInterfaceRed)');
    //     updateElement('ConConnectionStatusData1', 'N/A', 'var(--mainColor)');
    //     updateElement('AvgConnectionStatusData2', 'N/A');

    //     return;
    // }

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
    return types[Math.floor(Math.random() * 3)];
}

function updateAllElements(){
}

function updateElement(elementID, newValue, color=null){
    let elem = document.getElementById(elementID);
    elem.textContent = newValue;

    if (color){
        elem.style.color = color;
    }
} 

function interpretIncomingJSON(){
    
}

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