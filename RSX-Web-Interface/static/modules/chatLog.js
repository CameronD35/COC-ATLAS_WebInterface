import socket from "../client.js";
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

    checkContainerPosition(null);

    if (error){

        singleChatBox.classList.add('errorMsg');

    } else if (connect){

        singleChatBox.classList.add('connectMsg');

    } else if (warning){

        singleChatBox.classList.add('warningMsg');

    }

    // Remove old messages if needed.
    removeMessagesWhenBeyondMax();
    //writeMessageToLogFile(msg, type);
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

export function checkContainerPosition(evt){

    let isWheelEvent = null;
    if (evt) {
        console.log(evt.type);
        isWheelEvent = evt.type === 'wheel';
    }


    const logAutoScroll = document.getElementById('AutSetting').getAttribute('data-autoscroll') == 'true';
    //console.log(logAutoScroll);
    const chatOverheadContainer = document.getElementById('chatOverheadContainer');

    // height of the element, including that which is cut off and invisible
    const scrollHeight = chatOverheadContainer.scrollHeight;

    // height of the element that is visible plus it's padding
    const clientHeight = chatOverheadContainer.clientHeight;
     
    // distance the message box is scrolled downwards (0 if auto-scroll enabled)
    const scrollTop = chatOverheadContainer.scrollTop;

    // Since there is no scrollBottom property we take:
    // (distance scrolled downwards) - (complete height of element) + (height of visible element) 
    const scrollBottom = scrollTop - scrollHeight + clientHeight;

    // If the user has auto-scroll on, it will bring the user to the most recent message when added, otherwise it will do nothing.
    // The reason we don't want auto-scroll when the 'wheel' event is calling this is because doing so would prevent scolling completely
    if(logAutoScroll && !isWheelEvent){
        chatOverheadContainer.scrollTop = chatOverheadContainer.scrollHeight;
    }

    const topShadowStyle = topLogShadowContainer.style;

    // This sequence of if/else statements shows a shadow on the top if the enterity of the first message added is not located within the message container
    // It also shows a shadow on the bottom if the enterity of the last message added is not located in the message container

    if(scrollHeight > clientHeight && scrollTop != 0){

        topShadowStyle.opacity = 1;

    } else {

        topShadowStyle.opacity = 0;

    }

    const bottomShadowStyle = bottomLogShadowContainer.style;

    // This is super messy third condition does the following:
    // Since the only ways we won't be at the bottom of the message log is when scrolling manually or off of auto-scroll
    // we say one of those things has to happen for this shadow to appear

    // And yes, this is all for a simple shadow lol
    if ((scrollHeight > clientHeight) && (scrollBottom < -5) && (isWheelEvent || !logAutoScroll)){

        console.log(scrollBottom);

        bottomShadowStyle.opacity = 1;

    } else {

        bottomShadowStyle.opacity = 0;

    }
}

function writeMessageToLogFile(msg, type) {
    socket.emit('writeLog', msg);
}