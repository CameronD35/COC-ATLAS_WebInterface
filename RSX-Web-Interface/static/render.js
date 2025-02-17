
// THIS FILE IS USED FOR RENDERING THE PAGE AND MANAGING THE SETTINGS

import createHTMLChildElement from './modules/createElement.js';
import SettingsOption from './modules/settingsOption.js';
import Graph from './modules/lineChart.js';
import settings from './modules/settings.js';
import pushChatToLog from './modules/chatLog.js';
import getTime from './modules/getTime.js';
import { checkContainerPosition } from './modules/chatLog.js';
import Dropdown from './modules/dropdown.js';

import socket from './client.js';

// START SETUP CODE

let referenceOpen = false;
export let graphArray = [];

let clickDetectEventExists = false;
let messageCount = 0;

// light mode toggle variable
let lightMode = false;

/** The max messages setting option. */
let maxMessagesSetting = settings[1];
let dataFrequency = 2.5;
let graphRange = 30;

// Variables for the log section
//let logAutoScroll = true;

createPage();
resizeElements();

// END SETUP CODE


// DO NOT DELETE THIS FUNCTION
// Highest level function that calls other functions to organize and arrange the interface.
function createPage() {
    let parentContainer = document.querySelector('.boxContainer');
    createBoxStructure(parentContainer);

    const titles = ['Real-Time Data', 'Features', 'Log'];
    const tooltipMessages = [null, null, null]

    addTextToBoxes(['dashColumn4-Row1', 'dashColumn4-Row2', 'dashRow2-Column2'], titles, tooltipMessages);

    document.getElementById('dashRow2-Column1').classList.remove('box');
    createContentSpace();

    console.log(`%cUse 'Shift + R' to access a reference image for the interface!`, 'background: rgba(44, 212, 27, 0.3); border-radius: 2px; width: 100%; padding: 2px;');

    createSettingsBox(document.getElementById('dashRow1-Column2'));
    
    createComputerDataSection(document.getElementById('contentContainer0'), [
        {
            title: 'RAM',
            data: '16GB'
        },
        {
            title: 'OS',
            data: 'UBUNTU'
        },
        {
            title: 'IP Address',
            data: '0000x6F'
        },
        {
            title: 'Currently Running',
            data: 'cv.py'
        }
    ], 'Hal-3000')

    createRealTimeDataSection(document.getElementById('contentContainer2'), 2, 
    ['Temperature', 'Pressure', 'Cloud Points', 'CPU Usage'], 2);

    createFeaturesSection([
        {
            title: 'Initialization',
            options: [
                'Activate TOF Sensor',
                'Activate Deployment System',
                'Rotate Motors',
                'Rotate Mirrors'
            ],
            type: 'checkbox'
        },
    
        {
            title: 'Controls',
            options: [
                'Test Motor',
            ],
            type: 'number'
        },
        {
            title: '3D Render',
            type: 'model'
        }
    ]);

    createRealTimeGraphs();
    createLogSection();
    createConnectionStatusSection(['Connected to ', 'Clients: ']);

    changeGraphRange(graphRange);

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

export default function showOverlay(functionToCreateContent) {
    let pageContainer = document.querySelector('.hero');
    let overlay = document.getElementById('overlay');
    let overlayContentContainer = document.getElementById('overlayContentContainer');
    pageContainer.style.filter = 'blur(2px)';
    overlay.style.width = '100vw';
    setTimeout(() => {
        overlay.style.opacity = 1;
    }, 50)
   
    overlay.setAttribute('data-occupied', 'true');

    console.log('showing overlay');
    functionToCreateContent(overlayContentContainer);
    setTimeout(() => {
        window.addEventListener('click', readForClick);
    }, 500)

}

/** 
* This function detects if the user clicks inside of the content within the overlay (i.e. settings or reference)
* If the user did click inside, nothing happens
* If the user clicked outside it will delete the overlay content by utilizing the hideOverlay function
* @param {object} event - Pulled from the .addEventListener function. The element of which the user clicked
*/

function readForClick(event) {
    //console.log(event);
    let target = event.target;
    let didClickInside = document.getElementById('overlayContentContainer').contains(target);

    const overlayOccupied = overlay.getAttribute('data-occupied');

    if (!didClickInside && overlayOccupied == 'true'){

        console.log('clicked outside.', target.id);
        overlay.setAttribute('data-occupied', 'false');
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
    overlay.setAttribute('data-occupied', 'false');
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

function createComputerDataSection(container, dataTitleAndPoints, computerName){
    let computerDataContainer = createHTMLChildElement(container, 'div', 'computerDataContainer');
    let computerNameSection = createHTMLChildElement(computerDataContainer, 'div', 'computerNameSection', computerName);
    
    let border = createHTMLChildElement(computerDataContainer, 'div', 'border', null, `computerDataBorder`)

    for(let i = 0; i < dataTitleAndPoints.length; i++){

        let currentDatumSection = createHTMLChildElement(computerDataContainer, 'div', 'computerDatumSection', null, `${dataTitleAndPoints[i].title.substring(0,3)}ComputerDatumSection`);

        let currentDatumTitle = createHTMLChildElement(currentDatumSection, 'div', `computerDataTitle`, `${dataTitleAndPoints[i].title}:`, `${dataTitleAndPoints[i].title.substring(0,3)}ComputerDataTitle`);
        let currentDatumPoint = createHTMLChildElement(currentDatumSection, 'span', `computerDataPoint`, dataTitleAndPoints[i].data, `${dataTitleAndPoints[i].title.substring(0,3)}ComputerDataPoint`);
        
        if(i == dataTitleAndPoints.length - 1){

            continue;

        }

        let miniBorder = createHTMLChildElement(computerDataContainer, 'div', 'miniBorder');

    }
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

        switch (setting.name)
        {
            case "Light Mode On":

                // The main and secondary css vars.
                const mainColorCssVar = '--mainColor'; 
                const secondaryColorCssVar = '--secondaryColor'; 
                const tertiaryColorCssVar = '--tertiaryColor'; 
                const quadraryColorCssVar = '--quadraryColor'; 

                const mainColorTransparentCssVar = '--mainColor-transparent'; 
                const secondaryColorTransparentCssVar = '--secondaryColor-transparent'; 
                const tertiaryColorTransparentCssVar = '--tertiaryColor-transparent'; 
                const quadraryColorTransparentCssVar = '--quadraryColor-transparent'; 

                setting.value = !setting.value;

                // https://davidwalsh.name/css-variables-javascript
                // Get the current values
                const currentMain = getComputedStyle(document.documentElement).getPropertyValue(mainColorCssVar);
                const currentSecondary = getComputedStyle(document.documentElement).getPropertyValue(secondaryColorCssVar);
                const currentTertiary = getComputedStyle(document.documentElement).getPropertyValue(tertiaryColorCssVar);
                const currentQuadrary = getComputedStyle(document.documentElement).getPropertyValue(quadraryColorCssVar);

                const currentMainTransparent = getComputedStyle(document.documentElement).getPropertyValue(mainColorTransparentCssVar);
                const currentSecondaryTransparent = getComputedStyle(document.documentElement).getPropertyValue(secondaryColorTransparentCssVar);
                const currentTertiaryTransparent = getComputedStyle(document.documentElement).getPropertyValue(tertiaryColorTransparentCssVar);
                const currentQuadraryTransparent = getComputedStyle(document.documentElement).getPropertyValue(quadraryColorTransparentCssVar);

                // swap the values
                document.documentElement.style.setProperty(mainColorCssVar, currentQuadrary);
                document.documentElement.style.setProperty(quadraryColorCssVar, currentMain);


                // set values and invert settings icon color
                if(setting.value){
                    // opaque
                    document.documentElement.style.setProperty(secondaryColorCssVar, 'rgb(224, 224, 224)');
                    document.documentElement.style.setProperty(tertiaryColorCssVar, 'rgb(231, 231, 231)');

                    // transparent
                    document.documentElement.style.setProperty(secondaryColorTransparentCssVar, 'rgba(224, 224, 224, 0.4)');
                    document.documentElement.style.setProperty(tertiaryColorTransparentCssVar, 'rgba(231, 231, 231, 0.4)');

                    document.getElementById('settingsIcon').style.filter = 'invert()';
                } else {
                    // opaque
                    document.documentElement.style.setProperty(secondaryColorCssVar, 'rgb(31, 31, 31)');
                    document.documentElement.style.setProperty(tertiaryColorCssVar, 'rgb(24, 24, 24)');

                    // transparent
                    document.documentElement.style.setProperty(secondaryColorTransparentCssVar, 'rgba(31, 31, 31, 0.4)');
                    document.documentElement.style.setProperty(tertiaryColorTransparentCssVar, 'rgba(24, 24, 24, 0.4)');

                    document.getElementById('settingsIcon').style.filter = '';
                }

                break;

            case "Max Log Messages":
                let numberInput = document.getElementById("Max Log MessagesInput");
                let newValue = numberInput.value;
                setting.value = newValue;

                removeMessagesWhenBeyondMax();
                break;

            case "Data Transmission Frequency (seconds)":
                let freqInput = document.getElementById('Data Transmission Frequency (seconds)Input');
                let newFreq = freqInput.value;

                setting.value = newFreq;
                
                if (newFreq < 1) {
                    pushChatToLog(getTime(), 'Setting frequency to 1 second. Any less will drastically reduce performance and accuracy.', false, false, true);
                    socket.emit('dataFreq', 1);
                    break;

                } else {
                    let msgString = `Setting data frequency to ${newFreq} ${(newFreq < 2)? 'second' : 'seconds'}.`;
                    pushChatToLog(getTime(), msgString);
                }
                socket.emit('dataFreq', newFreq);
                break;
            
            case "Graph Range (seconds)":
                let rangeInput = document.getElementById('Graph Range (seconds)Input');
                let newRange = rangeInput.value;
                setting.value = newRange;


                changeGraphRange(newRange);

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

function changeGraphRange(newRange) {
    if (newRange < 10) {
        pushChatToLog(getTime(), 'Setting graph range to 10 seconds. Any less will make graphs futile.', false, false, true);

        newRange = 10;
    }

    // Grabs each graph and sets it's domain (x-axis) to a length of 30
    // The x-axis represents seconds
    graphArray.forEach((graph, i) => {
        graph.changeDomain(newRange);
    });
}

/* Remove the message elements when the count goes beyond the max. */
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

function createRealTimeDataSection(container, numOfGraphs, dataPoints, numOfRows){
    let realTimeContainer = createHTMLChildElement(container, 'div', 'realTimeContainer');

    let graphicalDataSection = createHTMLChildElement(realTimeContainer, 'div', 'graphicalDataSection');


    
    for(let i = 1; i <= numOfGraphs; i++){
        let currentGraphSection = createHTMLChildElement(graphicalDataSection, 'div', 'graphSection', null, `graphSection${i}`);
        let currentDataInfo = createHTMLChildElement(currentGraphSection, 'div', 'dataInfo', null, `dataInfo${i}`);
        //let dataTitle = createHTMLChildElement(currentDataInfo, 'div', 'dataTitle', `Data Point ${i}`, `dataTitle${i}`);

        let pointsFormattedForDropdown = {
            "Select": "def"
        }

        dataPoints.forEach((point, i) => {
            pointsFormattedForDropdown[point] = 'std';
        });

        console.log(pointsFormattedForDropdown);

        let dataDropdown = new Dropdown(currentDataInfo, i, pointsFormattedForDropdown, currentDataInfo);

        //dataDropdown.attachToExternalTitle(dataTitle);
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


function createRealTimeGraphs(){
    let graph1 = new Graph(350, 200, {top: 10, bottom: 20, left: 30, right: 20}, '#graphSection1', null, ['time (s)', null], ['var(--quadraryColor)', 'var(--mainColor)'], 'graph1', [5,4]);
    let graph2 = new Graph(350, 200, {top: 10, bottom: 20, left: 30, right: 20}, '#graphSection2', null, ['time (s)', null], ['var(--quadraryColor)', 'var(--mainColor)'], 'graph2', [5,4]);
    graph1.create();
    graph2.create();

    graphArray.push(graph1, graph2);

}

window.addEventListener('resize', () => {resizeElements();});

function resizeElements(){

    let graphSectionDimensions = document.querySelector('.graphicalDataSection').getBoundingClientRect();
    const graphSectionWidth = graphSectionDimensions.width;
    const graphSectionHeight = graphSectionDimensions.height;

    //console.log(graphSectionWidth);

    graphArray.forEach((elem, i) => {
        // the if statement prevents the conenction status graph from being resized
        // this is quite janky, but works for now
        if (i == 2) {return;}
        elem.resize(Math.round(graphSectionWidth) * 0.4, Math.round(graphSectionHeight) * 0.75);
    })


}


function createFeaturesSection(sectionTitlesAndOptions, container=document.getElementById('contentContainer3')){
    let featuresContainer = createHTMLChildElement(container, 'div', 'featuresContainer');

    for(let i = 0; i < sectionTitlesAndOptions.length; i++){
        let titleAbbreviation = sectionTitlesAndOptions[i].title.substring(0,3);
        let featureSubsection = createHTMLChildElement(featuresContainer, 'div', 'featureSubsection', null, `${titleAbbreviation}FeatureSubsection`);
        let subsectionTitle = createHTMLChildElement(featureSubsection, 'span', 'subsectionTitle', sectionTitlesAndOptions[i].title, `${titleAbbreviation}SubsectionTitle`);

        let optionsSection = createHTMLChildElement(featureSubsection, 'div', 'optionsSection', null, `optionsSection${i}`);

        if(sectionTitlesAndOptions[i].options != null){
            for(let j = 0; j < sectionTitlesAndOptions[i].options.length; j++){
                let inputID = `featuresCheackbox${j}`;
                let inputType = sectionTitlesAndOptions[i].type;
                let inputIsCheckbox = (inputType == 'checkbox');
    
                let inputSection = createHTMLChildElement(optionsSection, 'div', 'inputSection', null, `${titleAbbreviation}InputSection${j}`);
    
                // Makes sure that label is BEFORE input if it is not a checkbox
                if(!inputIsCheckbox){
                    let inputLabel = createHTMLChildElement(inputSection, 'label', `features${inputType}Label`, sectionTitlesAndOptions[i].options[j], `features${inputType}Label${j}`);
                    inputLabel.for = inputID
                }
    
                let input = createHTMLChildElement(inputSection, 'input', `features${inputType}`, null, `${titleAbbreviation}Features${inputType}${j}`);
                input.type = inputType;
                
                // Adds button if the input is NOT a checkbox
                if(!inputIsCheckbox){
                    let miniBorder = createHTMLChildElement(inputSection, 'div', 'miniBorder');
                    let testButton = createHTMLChildElement(inputSection, 'button', `featuresButton`, 'TEST');
                }
    
                // Makes sure that label is AFTER in put if it is a checkbox
                if(inputIsCheckbox){
                    let inputLabel = createHTMLChildElement(inputSection, 'label', `features${inputType}Label`, sectionTitlesAndOptions[i].options[j], `features${inputType}Label${j}`);
                    inputLabel.for = inputID
                }
            }
    
        }

        if(sectionTitlesAndOptions[i].type === 'model'){
            let modelContainer = createHTMLChildElement(optionsSection, 'div', 'modelRender');
            //let scene = new SceneManager(modelContainer, [300, 300]);
        }

        if(i == sectionTitlesAndOptions.length - 1){
            continue;
        }

        let border = createHTMLChildElement(featuresContainer, 'div', 'featuresBorder', null, `featuresBorder${i}`);
    }


}

function createLogSection(parent=document.getElementById('contentContainer4')){

    let titleContainer = document.getElementById('LogTextContainer');

    let titleText = document.getElementById('LogText');

    let downloadButtonForm = createHTMLChildElement(titleText, 'form', 'downloadContainer', null, null, null, `Download a copy of this session's log.`);

    downloadButtonForm.action = '/downloadLog';
    downloadButtonForm.method = 'get';
    downloadButtonForm.target = '_blank';

    let downloadButton = createHTMLChildElement(downloadButtonForm, 'button', 'downloadButton');

    downloadButton.type = 'submit';

    let downloadImg = createHTMLChildElement(downloadButton, 'img', 'downloadImg');

    downloadImg.src = './Image-Assets/download.webp';

    let timeContainer = createHTMLChildElement(titleContainer, 'div', 'timeContainer');
    let timeText = createHTMLChildElement(timeContainer, 'div', 'timeText');


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

    let autoScroll = createMessageSetting('Auto-Scroll', true, 'data-autoscroll');
    let connectionMsgs = createMessageSetting('Connection Messages', true, 'data-connectmsg');

    detectClickOnMessageSettings(messageSettingsButtonContainer);

    chatContainer.addEventListener('scroll', checkContainerPosition);


    chatContainer.addEventListener('wheel', checkContainerPosition);

}

function detectClickOnMessageSettings(container){

    const messageSettings = document.getElementById('messageSettings');
    const messageSettingsArrow = document.getElementById('messageSettingsArrow');

    console.log(messageSettings);

    container.addEventListener('click', (evt) => {
    
        // Spins the arrow and opens the message settings section
        if(messageSettings.style.transform != 'scaleY(1)'){
    
            container.style.transform = 'translateY(0)';
            messageSettings.style.transform = 'scaleY(1)';
            messageSettingsArrow.style.transform = 'rotate(180deg)';
        
        // Spins the arrow back and closes the message settings section
        } else {
    
            container.style.transform = 'translateY(70%)';
            messageSettings.style.transform = 'scaleY(0)';
            messageSettingsArrow.style.transform = 'rotate(0deg)';
    
        }

    });
}

function createMessageSetting(settingTitle, setDefaultToTrue, dataAttribute){

    const messageSettings = document.getElementById('messageSettings');

    const singleMessageSetting = createHTMLChildElement(messageSettings, 'div', 'singleMessageSetting', null, `${settingTitle.substring(0,3)}Setting`);

    const settingInput = createHTMLChildElement(singleMessageSetting, 'input', 'singleMessageSettingInput', null, `${settingTitle.substring(0,3)}SettingInput`);
    settingInput.type = 'checkbox';
    const settingLabel = createHTMLChildElement(singleMessageSetting, 'label', 'singleMessageSettingLabel', settingTitle, `${settingTitle.substring(0,3)}SettingLabel`);

    // sets a "data-" attribute to the setting itself rather than using global variables
    singleMessageSetting.setAttribute(dataAttribute, `${setDefaultToTrue}`);
    
    if (setDefaultToTrue){
        settingInput.checked = true; 
    } else {
        settingInput.checked = false; 
    }

    setupMessageSetting(singleMessageSetting, dataAttribute);
}

function setupMessageSetting(element, dataAttribute){

    let input;

    for(const child of element.children) {
        // since we pass in the setting container for the element variable, to access the checkbox (a child element) we have to loop through the container
        // to access it

        console.log(child.tagName.toLowerCase());

        if (child.tagName.toLowerCase() == 'input') {
            input = child;
            break;
        }

    }

    console.log(input);

    element.addEventListener('input', () => {

        const isActiviated = element.getAttribute(dataAttribute) === 'true';

        //console.log(input);

        if (isActiviated) {
            input.checked = false;
            element.setAttribute(dataAttribute, 'false');
        } else {
            input.checked = true;
            element.setAttribute(dataAttribute, 'true');
        }



    });
}


function createConnectionStatusSection(dataTitles, container=document.getElementById('contentContainer5')){
    let connectionStatusContainer = createHTMLChildElement(container, 'div', 'connectionStatusContainer');

    for(let i = 0; i < dataTitles.length; i++){
        let abbreviatedName = dataTitles[i].substring(0, 3);

        let currentConnectionStatusSection = createHTMLChildElement(connectionStatusContainer, 'div', 'connectionStatusSection', null, `${abbreviatedName}ConnectionStatusSection${i}`);

        let currentTitle = createHTMLChildElement(currentConnectionStatusSection, 'div', 'connectionStatusTitle', `${dataTitles[i]}`, `${abbreviatedName}ConnectionStatusTitle${i}`);
        let currentDatum = createHTMLChildElement(currentTitle, 'span', 'connectionStatusData', 23, `${abbreviatedName}ConnectionStatusData${i}`);
        
        let currentBorder = createHTMLChildElement(connectionStatusContainer, 'div', 'connectionStatusBorder', null, `connectionStatusBorder${i}`);
    }

    let currentGraphSection = createHTMLChildElement(connectionStatusContainer, 'div', 'connectionStatusGraphSection');
    let conStatGraph = new Graph(300, 100,{ top: 20, bottom: 20, right: 20, left: 40 }, '#connectionStatusGraphSection', null,
    ['Time', null], ['red', 'green'], 'connectionStatusGraph', [4, 3]);

    conStatGraph.create();

    graphArray.push(conStatGraph);
}

// Adds all the titles to their respective boxes, reference their input for which box you will be working on.
function addTextToBoxes(boxesArray, titlesArray, tooltipMessageArray){

    for(let i = 0; i <= titlesArray.length; i++){
        
        let currentSection = document.getElementById(boxesArray[i]);
        let currentTitle = titlesArray[i]

        if(currentSection && currentTitle){
            let titleContainer = createHTMLChildElement(currentSection, 'div', 'boxTitleContainer', null , `${currentTitle.substring(0, 3)}TextContainer`);
            let titleElem = createHTMLChildElement(titleContainer, 'div', 'boxTitle', currentTitle, `${currentTitle.substring(0, 3)}Text`, null, tooltipMessageArray[i]);
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

        const overlayOccupied = overlay.getAttribute('data-occupied');

        if(overlayOccupied == 'false'){
            showOverlay(createReference);
        }
            
        else if (overlayOccupied == 'true'){
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