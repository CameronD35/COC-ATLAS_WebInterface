import createHTMLChildElement from "./createElement.js";
import settings from './settings.js';
import SettingsOption from "./settingsOption.js";
// Pushes the a message to the interfaces's log (not to be confused with the console log)
/**
* @param {string} time - The current time as collected form the getTime() function
* @param {string} msg - Any string that will be pushed into a single chat
* @param {boolean} error - gives the message a certain error color/theme if it is 'true'
* @param {boolean} connection - gives the message a certain connection color/theme if it is 'true'
* @param {object} logContainer - DOM element that the message will be pushed to; default is '.chatContainer'
*/

let maxMessagesSetting = settings[1]

export default function pushChatToLog(time, msg, error, connect, warning, logContainer=document.querySelector('.chatContainer')){

    let singleChatBox = createHTMLChildElement(logContainer, 'div', 'singleChat');

    let timestampBox = createHTMLChildElement(singleChatBox, 'div', 'timestampBox');

    let timeText = createHTMLChildElement(timestampBox, 'span', 'timeText', time);



    let messageBox = createHTMLChildElement(singleChatBox, 'div', 'messageBox');

    //let messageBorder = createHTMLChildElement(messageBox, 'div', 'messageBorder');

    let message = createHTMLChildElement(messageBox, 'span', 'message', msg);


    let topShadow = document.getElementById('topLogShadowContainer');
    let bottomShadow = document.getElementById('bottomLogShadowContainer');

    checkContainerPosition();

    // These are options for different message types
    if (error){

        singleChatBox.classList.add('errorMsg');

    } else if (connect){

        singleChatBox.classList.add('connectMsg');

    } else if (warning){
        singleChatBox.classList.add('warningMsg');
    }

    // Remove old messages if needed.
    removeMessagesWhenBeyondMax();
}

/** Remove the message elements when the count goes beyond the max. */
function removeMessagesWhenBeyondMax()
{
    let logContainer = document.getElementById("chatContainer");
    let messages = logContainer.children;

    //console.log(messages.length);

    if (messages.length <= maxMessagesSetting.value)
    {
        // Don't remove if within the limit.
        return;
    }


    let amountToRemove = messages.length - maxMessagesSetting.value;
    for (var i = 0; i < amountToRemove; i++)
    {
        messages.item(0).remove();
    }
}

export function checkContainerPosition(){
    let logAutoScroll = document.getElementById('AutSettingInput').checked;

    // If the user has auto-scroll on, it will bring the user to the most recent message when added, otherwise it will do nothing.
    if(logAutoScroll){
        chatOverheadContainer.scrollTop = chatOverheadContainer.scrollHeight;
    }

    // This sequence of if/else statements shows a shadow on the top if the enterity of the first message added is not located within the message container
    // It also shows a shadow on the bottom if the enterity of the last message added is not located in the message container

    if(chatOverheadContainer.scrollHeight > chatOverheadContainer.clientHeight && chatOverheadContainer.scrollTop != 0){

        topLogShadowContainer.style.opacity = 1;

    } else {

        topLogShadowContainer.style.opacity = 0;

    }

    if ((chatOverheadContainer.scrollHeight > chatOverheadContainer.clientHeight) && (chatOverheadContainer.scrollTop != (chatOverheadContainer.scrollHeight - chatOverheadContainer.clientHeight))){

        if(!logAutoScroll){
            bottomLogShadowContainer.style.opacity = 1;
        }

    } else {

        bottomLogShadowContainer.style.opacity = 0;

    }
}