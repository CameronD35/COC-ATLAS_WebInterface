import pushChatToLog from "./modules/chatLog.js";
import getTime from "./modules/getTime.js";

// Global io variable. It's initialization sends message to server that a client has connected.
const socket = io();

socket.on('chatTest', (msg) => {
    pushChatToLog(getTime(), msg);
});

// Activate TOF Sensor
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('IniFeaturescheckbox0').addEventListener('input', (evt) => {
        if(evt.target.checked){
            pushChatToLog(getTime(), 'Activating TOF Sensor');
        } else {
            pushChatToLog(getTime(), 'Deactivating TOF Sensor');
        }
    });
});
