import createHTMLChildElement from './modules/createElement.js';
import SettingsOption from './modules/settingsOption.js';
import Graph from './modules/lineChart.js';

// START SETUP CODE

let referenceOpen = false;
let graphRange;
let graphArray = [];

let clickDetectEventExists = false;
let overlayOccupied = false;
let messageCount = 0;

/** The list of all settings. */
let settings = [
    new SettingsOption("Light Mode On", "checkbox", false),
    new SettingsOption("Max Log Messages", "number", 50),
];

/** The max messages setting option. */
let maxMessagesSetting = settings[1];

// Variables for the log section
let grayMsg = false;
let logAutoScroll = true;

let lightMode = false;

createPage();


// END SETUP CODE


// DO NOT DELETE THIS FUNCTION
// Highest level function that calls other functions to organize and arrange the interface.
function createPage() {
    let parentContainer = document.querySelector('.boxContainer');
    createBoxStructure(parentContainer);

    addTextToBoxes(['dashColumn4-Row1', 'dashColumn4-Row2', 'dashRow2-Column2'], ['Real-Time Data', 'Features', 'Log']);

    document.getElementById('dashRow2-Column1').classList.remove('box');
    createContentSpace();

    console.log(`%cUse 'Shift + R' to access a reference image for the interface!`, 'background: rgba(44, 212, 27, 0.3); border-radius: 2px; width: 100%;');

    createSettingsBox(document.getElementById('dashRow1-Column2'));
    //setCurrentBoxes(CSSClasses);
}


// DO NOT DELETE THIS FUNCTION
// Creates the row and column organization

function createBoxStructure(parent){
    let topRow = createRow(parent, 1, 2, 15, false, [90, 10]);
    let secondRow = createRow(parent, 2, 2, 70, false, [75, 25]);
    let secondRowFirstColumn = createColumn(document.querySelector('#dashRow2-Column1'), 4,  2, 100, true, null);
    let thirdRow = createRow(parent, 3, 1, 15, true, null);

    //console.log(topRow, secondRow);
}

/** This creates a row with a cusotmizable amount of columns
* @param {number} rowNumber: The associated value of the row. (ex: if the row is the 3rd row on the page, it should be 3)
* @param {number} numOfColumns: The number of columns (boxes) that will be inside of this row
* @param {number} rowHeight: The desired height of the row in percentage (ex: For 40% you would put 40)
* @param {boolean} autoColumnSizing: True for equal sizing of the columns, false for programmer-defined sizing
* @param {number} array columnWidths: An array containing the widths of all the columns (if autoColumnSizing == false)
*/
// DO NOT DELETE THIS FUNCTION

function createRow(parent, rowNumber, numOfColumns, rowHeight, autoColumnSizing, columnWidths, name) {
    
    let boxWidth;

    if (autoColumnSizing){
        //console.log('test')
        boxWidth = (100/numOfColumns);
        //console.log(boxWidth)
    }

    let row = createHTMLChildElement(parent, 'div', `dashRow`, null, `dashRow${rowNumber}`);
    row.style.height = `${rowHeight}%`;

    for(let i = 1; i <= numOfColumns; i++){

        let currentColumn = createHTMLChildElement(row, 'div', [`dashRow${rowNumber}-Column`, 'columnInRow', 'box'], null, `dashRow${rowNumber}-Column${i}`);

        if (!autoColumnSizing){
            boxWidth = columnWidths[i-1];
        }

        currentColumn.style.width = `${boxWidth}%`;
    }

    return row;
}

/** 
* This creates a column with a cusotmizable amount of rows
* @param {number} columnNumber: The associated value of the column. (ex: if the column is the 3rd column on the page, it should be 3)
* @param {number} numOfRows: The number of rows (boxes) that will be inside of this column
* @param {number} columnWidth: The desired width of the column in percentage (ex: For 40% you would put 40)
* @param {boolean} autoaRowSizing: True for equal sizing of the rows, false for programmer-defined sizing
* @param {number} array rowHeights: An array containing the heights of all the rows (if autoRowSizing == false)
*/

// DO NOT DELETE THIS FUNCTION

function createColumn(parent, columnNumber, numOfRows, columnWidth, autoRowSizing, rowHeights, name) {
    
    parent.style.flexDirection = 'row';

    let boxHeight;

    if (autoRowSizing){
        //console.log('test')
        boxHeight = (100/numOfRows);
    }

    let column = createHTMLChildElement(parent, 'div', `dashColumn`, null, `dashColumn${columnNumber}`);
    column.style.width = `${columnWidth}%`;

    for(let i = 1; i <= numOfRows; i++){

        let currentRow = createHTMLChildElement(column, 'div', [`dashColumn${columnNumber}-Row`, 'rowInColumn', 'box'], null, `dashColumn${columnNumber}-Row${i}`);

        if (!autoRowSizing){
            boxHeight = rowHeights[i-1];
        }

        currentRow.style.height = `${boxHeight}%`;
    }

    return column;
}

function showOverlay(functionToCreateContent) {
    let pageContainer = document.querySelector('.hero');
    let overlay = document.getElementById('overlay');
    let overlayContentContainer = document.getElementById('overlayContentContainer');
    pageContainer.style.filter = 'blur(2px)';
    overlay.style.width = '100vw';
    setTimeout(() => {
        overlay.style.opacity = 1;
    }, 50)
    overlayOccupied = true;

    console.log('showing overlay');
    functionToCreateContent(overlayContentContainer);
    setTimeout(() => {
        window.addEventListener('click', readForClick);
    }, 5)

}

/** 
* This function detects if the user clicks inside of the content within the overlay (i.e. settings or reference)
* If the user did click inside, nothing happens
* If the user clicked outside it will delete the overlay content by utilizing the hideOverlay function
* @param {object} event - Pulled from the .addEventListener function. The element of which the user clicked
*/

function readForClick(event) {
    console.log(event)
    let target = event.target;
    let didClickInside = document.getElementById('overlayContentContainer').contains(target);

    if (!didClickInside && overlayOccupied){

        console.log('clicked outside.', target.id);
        overlayOccupied = false;
        referenceOpen = false;
        console.log('reference:', referenceOpen);
        hideOverlay();
        //console.log(target);

    } else { 

        console.log('clicked inside');

    }
}

/* 
* Hides the overlay by cleaning--or deleting--the 'overlay' element
* It also sets the overlay opacity and width to 0
* The delay is added for a smoother animation
*/

function hideOverlay(){
    let pageContainer = document.querySelector('.hero');
    let overlay = document.getElementById('overlay');
    let overlayContentContainer = document.getElementById('overlayContentContainer');
    window.removeEventListener('click', readForClick);

    overlay.style.opacity = 0;
    overlay.style.width = 0;

    console.log('hiding overlay');

    setTimeout(() => {
        cleanElement(overlayContentContainer);
    }, 450);
    overlayOccupied = false;
    pageContainer.style.filter = '';
}

// Function that creates the reference accessible by holding down 'Shift' and 'F' simultaneously

function createReference(container){

    let pageContainer = document.querySelector('.hero');

    let referenceTitle = createHTMLChildElement(container, 'span', 'referenceTitle', 'REFERENCE', 'referenceTitle');
    let referenceContent = createHTMLChildElement(container, 'div', 'referenceContent', null, 'referenceContent');
    let referenceImage = createHTMLChildElement(referenceContent, 'img', 'referenceImage', null, 'referenceImage');
    referenceImage.src = 'Image-Assets/RSX25WebInterfaceConcept.webp';

    let hintContainer = createHTMLChildElement(container, 'div', 'hintContainer', null, 'hintContainer');
    let hintKey = createHTMLChildElement(hintContainer, 'span', 'hintTextKey', 'Shift + R', 'hintTextKey');
    let hintText = createHTMLChildElement(hintContainer, 'div', 'hintText', 'to close', 'hintText');

    referenceContent.addEventListener('mouseover', focusPage);

    referenceContent.addEventListener('mouseout', focusReference);


    // Removes the blur applied to the main page and reduces the opacity of the reference & its container

    function focusPage(){
        if(referenceOpen){
            container.style.opacity = 0.4;
            pageContainer.style.filter = 'blur(0px)';
        }
    }

    // Adds a blur to be applied to the main page and increases the opacity of the reference & its container

    function focusReference(){
        if(referenceOpen){
            container.style.opacity = 1;
            pageContainer.style.filter = 'blur(2px)';
        }
    }

    return referenceContent;
}

// OPEN THE FUNCTION AND REMOVE SPECIFIED LINES WHEN READY
// This creates the space for you to make your component (The grey area upon first opening up the template.)

function createContentSpace(){
    document.querySelectorAll('.box').forEach((box, i) => {
        if(i === 1){
            return;
        }
        let currentContentSpace = createHTMLChildElement(box, 'div', 'contentContainer', null, `contentContainer${i}`);
    })
    // This is to remove the unnecassry components from this box. All you need is the settings icon.
}



// PUT YOUR CODE HERE. FEEL FREE TO ADD, MODIFY, OR REMOVE FUNCTIONS AS NEEDED.

function createComputerDataSection(){

}

// Creates the button/icon to open the settings
function createSettingsBox(parent){
    parent.classList.add('settings');
    let settingsButton = createHTMLChildElement(parent, 'img', 'settingsIcon', null, 'settingsIcon');
    settingsButton.src = './Image-Assets/SettingsIcon.webp';

    settingsButton.addEventListener("click", settingsButtonClicked);


    /** Open settings when button clicked. */
    function settingsButtonClicked()
    {  
        showOverlay(createSettingsSection);
        //closeButton.addEventListener("click", closeSettingsButtonClicked);
        document.getElementById('settingsDialog').show();
    }
}

// Creates the content when the settings icon is clicked
function createSettingsSection(settingsUIContainer=document.getElementById('overlayContentContainer')){
    
    

    let dialog = createHTMLChildElement(settingsUIContainer, 'dialog', 'settingsDialog', null, 'settingsDialog');
    let settingsControlContainer = createHTMLChildElement(dialog, 'div', 'settingsControlContainer', null, 'settingsControlContainer');
    let settingsTitle = createHTMLChildElement(settingsControlContainer, 'span', 'settingsTitle', 'Settings', 'settingsTitle');
    let closeSettingsContainer = createHTMLChildElement(settingsControlContainer, 'div', 'closeSettingsContainer', null, 'closeSettingsContainer');
    let closeButton = createHTMLChildElement(closeSettingsContainer, 'span', 'closeSettingsButton', 'Close', 'closeSettingsButton');

    let settingsContentContainer = createHTMLChildElement(dialog, 'div', 'settingsContentContainer', null, 'settingsContentContainer');

    let inputContainer = createHTMLChildElement(settingsContentContainer, 'div', 'inputContainer', null, 'inputContainer');


    constructSettings();

    // Listen for user clicking the button.
    closeButton.addEventListener('click', closeSettingsButtonClicked)


    /* When the close button on the settings panel is clicked. */
    function closeSettingsButtonClicked(event)
    {
        // Unhook
        closeButton.removeEventListener("click", closeSettingsButtonClicked);
        hideOverlay();
    }

    /** A callback for when any setting has changed.
        @param {SettingsOption} setting - The name of the setting that was changed. */
    function settingChanged(setting) 
    {
        // The main and secondary css vars.
        let mainColorCssVar = '--mainColor'; 
        let secondaryColorCssVar = '--secondaryColor'; 

        switch (setting.name)
        {
            case "Light Mode On":
                setting.value = !setting.value;

                // https://davidwalsh.name/css-variables-javascript
                // Get the current values
                let currentMain = getComputedStyle(document.documentElement).getPropertyValue(mainColorCssVar);
                let currentSecondary = getComputedStyle(document.documentElement).getPropertyValue(secondaryColorCssVar);

                // swap the values
                document.documentElement.style.setProperty(mainColorCssVar, currentSecondary);
                document.documentElement.style.setProperty(secondaryColorCssVar, currentMain);

                break;
            case "Max Log Messages":
                let numberInput = document.getElementById("Max Log MessagesInput");
                let newValue = numberInput.value;
                setting.value = newValue;

                removeMessagesWhenBeyondMax();
                break;
        }
    }

    /** Change the settings panel's HTML */
    function constructSettings() 
    {

        // https://www.geeksforgeeks.org/how-to-iterate-over-a-javascript-object/
        for (const setting of settings) 
        {
            constructInput(setting)
        }

        /** Create an input element. 
         * @param {string} name - The name of the setting.
         * @param {string} type - The type of the input element. 
        */
        function constructInput(setting)
        {
            let name = setting.name;
            let type = setting.type;
            let value = setting.value;

            let settingDiv = createHTMLChildElement(inputContainer, 'div', 'individualSettingDiv', null, null, null);
            let closeInput = createHTMLChildElement(settingDiv, 'input', `${type}Input`, null, `${name}Input`);
            closeInput.type = `${type}`

            closeInput.addEventListener("change", (e) => {
                settingChanged(setting);
            });

            switch (type)
            {
                case "checkbox":
                    closeInput.checked = value;
                    break;
                case "number":
                    closeInput.value = value;
                    break;
            }

            let closeInputLabel = createHTMLChildElement(settingDiv, 'label', `${type}Label`, `${name}`, `${name}Label`);
            closeInputLabel.for = `${name}`

        }

    }

}


/** Remove the message elements when the count goes beyond the max. */
function removeMessagesWhenBeyondMax()
{
    let logContainer = document.getElementById("chatContainer");
    let messages = logContainer.children;

    console.log(messages.length);

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

function createRealTimeDataSection(container, numOfGraphs, dataPoints, numOfRows){
    let realTimeContainer = createHTMLChildElement(container, 'div', 'realTimeContainer');

    let graphicalDataSection = createHTMLChildElement(realTimeContainer, 'div', 'graphicalDataSection');


    
    for(let i = 1; i <= numOfGraphs; i++){
        let currentGraphSection = createHTMLChildElement(graphicalDataSection, 'div', 'graphSection', null, `graphSection${i}`);
        let currentDataInfo = createHTMLChildElement(currentGraphSection, 'div', 'dataInfo', null, `dataInfo${i}`);
        let dataTitle = createHTMLChildElement(currentDataInfo, 'div', 'dataTitle', `Data Point ${i}`, `dataTitle${i}`);
    }

    let lengthOfData = dataPoints.length;

    // Based on how many rows are in each column, it will use the length of the array of data points
    // It will round off to the highest number to account for integers that is not a multiple of the number of rows
    let numOfColumns = Math.ceil(lengthOfData / numOfRows);

    let numericalDataSection = createHTMLChildElement(realTimeContainer, 'div', 'numericalDataSection');

    let dataTable = createHTMLChildElement(numericalDataSection, 'table', 'dataTable');

    let equalParityOfDataAndRows = ((numOfRows % 2) == (lengthOfData % 2));
    

    console.log(equalParityOfDataAndRows)

    // The reason we want to update the row number is to account for the case 
    // where there are less data points then desired rows
    let updatedRowNumber;

    if(lengthOfData <= numOfRows){
        updatedRowNumber = lengthOfData;
    } else {
        updatedRowNumber = numOfRows;
    }  

    for (let i = 1; i <= updatedRowNumber; i++){
        let currentTableRow = createHTMLChildElement(dataTable, 'tr', 'dataRow', null, `dataRow${i}`);
    }

    for(let i = 1; i <= lengthOfData; i++){
        let rowPlacement = i % updatedRowNumber;

        let rowElement = document.getElementById(`dataRow${rowPlacement}`);

        if (rowPlacement == 0){
            rowElement = document.getElementById(`dataRow${updatedRowNumber}`);
        }
        // if(i/updatedRowNumber > 1){
        //     console.log('sikrduhgskuhbfgvzsd');
        //     continue;
        // }

        let currentTableHeader = createHTMLChildElement(rowElement, 'th', 'dataTitle', `${dataPoints[i-1]}:`, `dataTable${i}`);
        let currentTableData = createHTMLChildElement(rowElement, 'td', 'dataValue', 23, `dataValue${i}`);

    }
}


createRealTimeDataSection(document.getElementById('contentContainer2'), 2, 
['Temperature', 'Pressure', 'SO2 Concentration', 'Cloud Points', 'CPU Usage', 'Epic Info'], 3);

function createRealTimeGraphs(){
    let graph1 = new Graph(350, 200, {top: 10, bottom: 20, left: 30, right: 20}, '#graphSection1', null, ['time (s)', null], ['var(--quadraryColor)', 'var(--mainColor)'], 'graph1', [5,4]);
    let graph2 = new Graph(350, 200, {top: 10, bottom: 20, left: 30, right: 20}, '#graphSection2', null, ['time (s)', null], ['var(--quadraryColor)', 'var(--mainColor)'], 'graph2', [5,4]);
    graph1.create();
    graph2.create();

    graphArray.push(graph1, graph2)
}

window.addEventListener('resize', () => {resizeElements();});

function resizeElements(){
    let graphSectionDimensions = document.querySelector('.graphicalDataSection').getBoundingClientRect();
    const graphSectionWidth = graphSectionDimensions.width;
    const graphSectionHeight = graphSectionDimensions.height;

    console.log(graphSectionWidth);

    graphArray.forEach((elem, i) => {
        elem.resize(Math.round(graphSectionWidth) * 0.4, Math.round(graphSectionHeight) * 0.75);
    })


}

createRealTimeGraphs();

function createFeaturesSection(){

}

function getTime(){
    let time = new Date(Date.now()).toTimeString().substring(0, 8);
    return(time);
}

function createLogSection(parent=document.getElementById('contentContainer4')){

    let titleContainer = document.getElementById('LogTextContainer');
    let timeContainer = createHTMLChildElement(titleContainer, 'div', 'timeContainer');
    let timeText = createHTMLChildElement(timeContainer, 'div', 'timeText', 'hello');


    let topLogShadowContainer = createHTMLChildElement(parent, 'div', 'topLogShadowContainer');
    let bottomLogShadowContainer = createHTMLChildElement(parent, 'div', 'bottomLogShadowContainer');


    let chatOverheadContainer = createHTMLChildElement(parent, 'div', 'chatOverheadContainer');
    let chatContainer = createHTMLChildElement(chatOverheadContainer, 'div', 'chatContainer');


    let messageSettingsContainer = createHTMLChildElement(parent, 'div', 'messageSettingsContainer');

    let messageSettingsButtonContainer = createHTMLChildElement(messageSettingsContainer, 'div', 'messageSettingsButtonContainer');

    let messageSettingsArrow = createHTMLChildElement(messageSettingsButtonContainer, 'span', 'messageSettingsArrow', "\u25B2");
    let messageSettingsButton = createHTMLChildElement(messageSettingsButtonContainer, 'div', 'messageSettingsButton');

    let messageSettingsButtonText = createHTMLChildElement(messageSettingsButton, 'span', 'messageSettingsButtonText', 'Message Settings');

    let messageSettings = createHTMLChildElement(messageSettingsContainer, 'div', 'messageSettings');

    createMessageSetting('Auto-Scroll', true);
    detectClickOnMessageSettings();

    setInterval(() => {
        let currentTime = getTime();
        timeText.textContent = currentTime;
        pushChatToLog(getTime(), 'the most amazing message you have ever seen.');
    }, 250)

    function detectClickOnMessageSettings(){

        messageSettingsButtonContainer.addEventListener('click', (event) => {
        
            if(messageSettings.style.transform != 'scaleY(1)'){
        
                messageSettingsButtonContainer.style.transform = 'translateY(0)';
                messageSettings.style.transform = 'scaleY(1)';
                messageSettingsArrow.style.transform = 'rotate(180deg)';
        
            } else {
        
                messageSettingsButtonContainer.style.transform = 'translateY(70%)';
                messageSettings.style.transform = 'scaleY(0)';
                messageSettingsArrow.style.transform = 'rotate(0deg)';
        
            }

        });
    }


    // Pushes the a message to the interfaces's log (not to be confused with the console log)
    /**
    * @param {string} time - The current time as collected form the getTime() function
    * @param {string} msg - Any string that will be pushed into a single chat
    * @param {boolean} error - gives the message a certain error color/theme if it is 'true'
    * @param {boolean} connection - gives the message a certain connection color/theme if it is 'true'
    * @param {object} logContainer - DOM element that the message will be pushed to; default is '.chatContainer'
    */

    function pushChatToLog(time, msg, error, connect, logContainer=document.querySelector('.chatContainer')){

        let singleChatBox = createHTMLChildElement(logContainer, 'div', 'singleChat');
    
        let timestampBox = createHTMLChildElement(singleChatBox, 'div', 'timestampBox');
    
        let timeText = createHTMLChildElement(timestampBox, 'span', 'timeText', time);
    
    
    
        let messageBox = createHTMLChildElement(singleChatBox, 'div', 'messageBox');
    
        //let messageBorder = createHTMLChildElement(messageBox, 'div', 'messageBorder');
    
        let message = createHTMLChildElement(messageBox, 'span', 'message', msg);
    

        let topShadow = document.getElementById('topLogShadowContainer');
        let bottomShadow = document.getElementById('bottomLogShadowContainer');


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

        if (chatOverheadContainer.scrollHeight > chatOverheadContainer.clientHeight && chatOverheadContainer.scrollTop != (chatOverheadContainer.scrollHeight - chatOverheadContainer.clientHeight)){

            bottomLogShadowContainer.style.opacity = 1;

        } else {

            bottomLogShadowContainer.style.opacity = 0;

        }
    

        // These are options for different message types
        if(error){
    
            singleChatBox.classList.add('errorMsg');
            return;
    
        } else if(connect){
    
            singleChatBox.classList.add('connectMsg');
            return;
    
        }
    
        if(grayMsg){
    
            singleChatBox.classList.add('grayMsg');
    
        }
    
        grayMsg = !grayMsg;
    
        // Remove old messages if needed.
        removeMessagesWhenBeyondMax();
    }

    function createMessageSetting(settingTitle, setDefaultToTrue){
        let singleMessageSetting = createHTMLChildElement(messageSettings, 'div', 'singleMessageSetting', null, `${settingTitle.substring(0,3)}Setting`);

        let settingInput = createHTMLChildElement(singleMessageSetting, 'input', 'singleMessageSettingInput', null, `${settingTitle.substring(0,3)}SettingInput`);
        settingInput.type = 'checkbox';
        if (setDefaultToTrue){ settingInput.checked= 'true'}
        let settingLabel = createHTMLChildElement(singleMessageSetting, 'label', 'singleMessageSettingLabel', settingTitle, `${settingTitle.substring(0,3)}SettingLabel`);

        setupMessageSetting(singleMessageSetting, true, () => {logAutoScroll = !logAutoScroll; console.log(logAutoScroll)}, () => {logAutoScroll = !logAutoScroll});
    }

    function setupMessageSetting(element, isToggle, settingOnFunction, settingOffFunction){
        element.addEventListener('input', () => {
    
            if(isToggle){
                settingOnFunction();
                return;
            }
    
            if(element.checked){
                settingOnFunction();
            } else {
                settingOffFunction();
            }
        });
    }

}

createLogSection();

function createConenctionStatusSection(){

}

// Adds all the titles to their respective boxes, reference their input for which box you will be working on.
function addTextToBoxes(boxesArray, titlesArray){

    for(let i = 0; i <= titlesArray.length; i++){
        
        let currentSection = document.getElementById(boxesArray[i]);
        let currentTitle = titlesArray[i]

        if(currentSection && currentTitle){
            let titleContainer = createHTMLChildElement(currentSection, 'div', 'boxTitleContainer', null , `${currentTitle.substring(0, 3)}TextContainer`);
            let titleElem = createHTMLChildElement(titleContainer, 'div', 'boxTitle', currentTitle, `${currentTitle.substring(0, 3)}Text`);
        }
    }

}



// DO NOT DELETE THESE FUNCTIONS. USE THESE FUNCTIONS TO HELP BUILD YOUR FUNCTIONS IF NEEDED.

// Checks if this element with a given attribute (such as id or class) exists. If it does, a specified function 'run' will run.
function ifElementExists(element, func) {
    if (element) {
        //console.log('work');
        func();
    }

    else {
        //console.log('no work');
    }
}

// This functions deletes all the child DOM elements of the specified 'element'
function cleanElement(element){
    if(element && element.hasChildNodes()){
        element.replaceChildren();

        return element;
    }
}

// Returns any desired value based on some criteria
/**
* @param {boolean} criteria - Some criteria to determine if the true or false value shall be returned
* @param {any} trueVal - Any value the author would like to return when criteria is met
* @param {any} falseVal - Any value the author would like to return when criteria is not met
*/
function returnValueBasedOnCriteria(criteria, trueVal, falseVal){
    if (criteria) {
        return trueVal;
    } else {
        return falseVal;
    }
}

// THIS FUNCTION WILL COME IN HANDY LATER, DONT WORRY ABOUT THIS FOR NOW

// function adjustPage(){

//     let windowWidth = window.innerWidth;
//     // console.log('adjusting page');
//     if (windowWidth <= 1000) {

//         // code for smallest page size
//         setTimeout(() => {}, 500);

//     } else if (windowWidth <= 1200){

//         // code for medium page size
//         setTimeout(() => {}, 500);

//     } else {

//         // code for largest page size
//         setTimeout(() => {}, 500);

//     }
// }

let keysActive = {};

// THESE FUNCTIONS HANDLE THE OPENING AND CLOSING OF THE REFERENCE OVERLAY. DON'T CHANGE THESE, BUT THEY MAY BE A HELPFUL REFERENCE FOR THE OTHER COMPONENTS ON THE PAGE. 
// Use 'Shift + F' to open and close the reference. You may also click outside the image to close it

/* 

* Whenever any key is clicked while the site is in focus this .addEventListener will run
* This function uses the first parameter uses within the .addEventListener function and sets it to a variable named 'event'
* It checkes to see if both the 'Shift' and 'R' keys are clicked simutaneously
* If they are, it ensures their is nothing occupiying the global overlay (i.e. the settings panel)
* It then shows the overlay by calling the 'showOverlay' function
* Lastly it lets the program know the reference is open by utilizing the 'referenceOpen' variable

*/

window.addEventListener('keydown', (target) => {

    keysActive[target.key] = true;

    if (keysActive['Shift'] == true && target.key == 'R'){
        console.log('clicked!')


        if(!overlayOccupied){
            showOverlay(createReference);
        }
            
        else if (overlayOccupied){
            console.log('make sure to close settings before attempting to open reference');       
            hideOverlay();
        }
        
        
        referenceOpen = !referenceOpen;
        console.log('reference:', referenceOpen);
    }
    
});

window.addEventListener('keyup', (target) => {
    delete keysActive[target.key];
});