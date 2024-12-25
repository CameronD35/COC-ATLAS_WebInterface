import pushChatToLog from "./modules/chatLog.js";
import getTime from "./modules/getTime.js";

// Global io variable. It's initialization sends message to server that a client has connected.
const socket = io();

socket.on('logMessage', (msg) => {
    pushChatToLog(getTime(), msg, false, true);
    console.log('hello');
});

document.addEventListener('DOMContentLoaded', () => {

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
