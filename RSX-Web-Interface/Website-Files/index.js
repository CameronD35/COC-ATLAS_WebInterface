import createHTMLChildElement from './modules/createElement.js';
//import Graph from '/modules/lineChart.js';

// START SETUP CODE

let referenceOpen = false;
let graphRange;
let clickDetectEventExists = false;


/** The list of settings.
     * Key - The string name of the setting
     * Value - The type of the setting. Currently, only supports 'checkbox' and 'number'.
     */
let settings = { 
    "Test": "checkbox"
};

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

    createSettingsSection(document.getElementById('dashRow1-Column2'), createHTMLChildElement(document.body, 'div', 'testOverlay'));
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

// This creates a row with a cusotmizable amount of columns
// int rowNumber: The associated value of the row. (ex: if the row is the 3rd row on the page, it should be 3)
// int numOfColumns: The number of columns (boxes) that will be inside of this row
// int rowHeight: The desired height of the row in percentage (ex: For 40% you would put 40)
// bool autoColumnSizing: True for equal sizing of the columns, false for programmer-defined sizing
// int array columnWidths: An array containing the widths of all the columns (if autoColumnSizing == false)

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

// This creates a column with a cusotmizable amount of rows
// int columnNumber: The associated value of the column. (ex: if the column is the 3rd column on the page, it should be 3)
// int numOfRows: The number of rows (boxes) that will be inside of this column
// int columnWidth: The desired width of the column in percentage (ex: For 40% you would put 40)
// bool autoaRowSizing: True for equal sizing of the rows, false for programmer-defined sizing
// int array rowHeights: An array containing the heights of all the rows (if autoRowSizing == false)

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

function createOverlay(func){
    let overlayContainer = document.getElementById('overlay');
    func(overlayContainer);
}

function createReference(container){
    let referenceTitle = createHTMLChildElement(container, 'span', 'referenceTitle', 'REFERENCE', 'referenceTitle');
    let referenceContent = createHTMLChildElement(container, 'div', 'referenceContent', null, 'referenceContent');
    let referenceImage = createHTMLChildElement(referenceContent, 'img', 'referenceImage', null, 'referenceImage');
    referenceImage.src = 'Image-Assets/RSX25WebInterfaceConcept.webp';

    let hintContainer = createHTMLChildElement(container, 'div', 'hintContainer', null, 'hintContainer');
    let hintKey = createHTMLChildElement(hintContainer, 'span', 'hintTextKey', 'Shift + R', 'hintTextKey');
    let hintText = createHTMLChildElement(hintContainer, 'div', 'hintText', 'to close', 'hintText');

    return referenceContent;
}

// OPEN THE FUNCTION AND REMOVE SPECIFIED LINES WHEN READY
// This creates the space for you to make your component (The grey area upon first opening up the template.)
function createContentSpace(){
    document.querySelectorAll('.box').forEach((box, i) => {
        let currentContentSpace = createHTMLChildElement(box, 'div', 'contentContainer', null, `contentContainer${i}`);
        createHTMLChildElement();

        // Remove this guide text once you begin working on your component. 
        // After you finish your component remove the background-color from '.boxTitleContainer' and '.box' (CSS).
        let guideText = createHTMLChildElement(currentContentSpace, 'span', 'guideText', 'Place your content here.', `guideText${i}`);
    })
    // This is to remove the unnecassry components from this box. All you need is the settings icon.
    cleanElement(document.getElementById('dashRow1-Column2'));
}



// PUT YOUR CODE HERE. FEEL FREE TO ADD, MODIFY, OR REMOVE FUNCTIONS AS NEEDED.

function createComputerDataSection(){

}

function createSettingsSection(parent, settingsUIContainer){
    
    parent.classList.add('settings')
    let settingsButton = createHTMLChildElement(parent, 'img', 'settingsIcon', null, 'settingsIcon');
    settingsButton.src = './Image-Assets/SettingsIcon.webp';
    

    let dialog = createHTMLChildElement(settingsUIContainer, 'dialog', 'settingsDialog', null, 'settingsDialog');
    let settingsTitleContainer = createHTMLChildElement(dialog, 'div', 'settingsTitleContainer', null, 'settingsTitleContainer');
    let settingsTitle = createHTMLChildElement(settingsTitleContainer, 'span', 'settingsTitle', 'Settings', 'settingsTitle');

    let settingsContentContainer = createHTMLChildElement(dialog, 'span', 'settingsContentContainer', null, 'settingsContentContainer');

    let closeSettingsContainer = createHTMLChildElement(dialog, 'div', 'closeSettingsContainer', null, 'closeSettingsContainer');
    let closeButton = createHTMLChildElement(closeSettingsContainer, 'button', 'closeSettingsButton', 'Close', 'closeSettingsButton');

    constructSettings();

    // Listen for user clicking the button.
    settingsButton.addEventListener("click", settingsButtonClicked);


    /** Open settings when button clicked. */
    function settingsButtonClicked(event)
    {  
        closeButton.addEventListener("click", closeSettingsButtonClicked);
        dialog.showModal();
    }

    /** When the close button on the settings panel is clicked. */
    function closeSettingsButtonClicked(event)
    {
        // Unhook
        closeButton.removeEventListener("click", closeSettingsButtonClicked);
        dialog.close();
    }

    /** A callback for when any setting has changed.
        @param{setting} - The name of the setting that was changed. */
    function settingChanged(setting) 
    {
        alert(setting + " changed");
    }
    

    /** Change the settings panel's HTML */
    function constructSettings() 
    {


        // https://www.geeksforgeeks.org/how-to-iterate-over-a-javascript-object/
        for (let key in settings)
        {
            if (settings.hasOwnProperty(key)) 
            {
                // value is the type of input
                var value = settings[key];
                switch (value) {
                    case "checkbox":
                    case "number":
                        constructInput(key, value);
                        break;
                    default:
                        break;
                } 
            }
        }

        /** Create an input element. 
         * @param{name} - The name of the setting.
         * @param{type} - The type of the input element. 
        */
        function constructInput(name, type)
        {
            let inputContainer = createHTMLChildElement(settingsContentContainer, 'div', 'inputContainer', null, 'inputContainer')
            let closeInput = createHTMLChildElement(inputContainer, 'input', `${name}Input`, null, `${name}Input`);
            closeInput.type = `${type}`

            let closeInputLabel = createHTMLChildElement(inputContainer, 'label', `${name}Label`, `${name}`, `${name}Label`);
            closeInputLabel.for = `${name}`

            //let closeInteract = createHTMLChildElement(inputContainer, 'button', 'closeSettingsButton', 'Close', 'closeSettingsButton');


            // closeButton.insertAdjacentHTML(
            //     "beforebegin",
            //     "      <div>" + 
            //     `\n        <input type=\"${type}\" id=\"${name}\" onchange=\"settingChanged('${name}')\" />` +
            //     `\n        <label for=\"${name}\">${name}</label>` +
            //     "\n    </div>"
            // );
        }

    }
}


function createRealTimeDataSection(){

}

function createFeaturesSection(){

}

function createLogSection(){

}

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

// Checks if this element with a given attribute (such as id or class) exists. If it does, a specified function will ruin.
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

window.addEventListener('keydown', (target) => {

    keysActive[target.key] = true;

    if (keysActive['Shift'] == true && target.key == 'R'){

        let referenceContainer = document.getElementById('overlay');
        let pageContainer = document.querySelector('.hero');
        let referenceImage;


        if(!referenceOpen){
            overlay.style.opacity = 1;
            referenceContainer.style.width = '100vw';
            openReference();
            
            referenceImage = document.querySelector('.referenceContent');

            referenceImage.addEventListener('mouseover', focusPage);

            referenceImage.addEventListener('mouseout', focusReference);
            
            if(!clickDetectEventExists){
                window.addEventListener('click', (target) => {

                    clickDetectEventExists = true;

                    if (target.target.id != 'referenceImage' && referenceOpen){
    
                        console.log('clicked outside.');
                        referenceOpen = !referenceOpen;
                        console.log('reference:', referenceOpen);
                        closeReference();
                        referenceContainer.style.width = 0;
                        //console.log(target);
    
                    } else { 
    
                        console.log('clicked inside');
    
                    }
                });
            }

        } else {       
            closeReference();
            referenceContainer.style.width = 0;
        }
        
        function focusPage(){
            if(referenceOpen){
                overlay.style.opacity = 0.4;
                pageContainer.style.filter = 'blur(0px)';
            }
        }

        function focusReference(){
            if(referenceOpen){
                overlay.style.opacity = 1;
                pageContainer.style.filter = 'blur(2px)';
            }
        }

        function openReference(){
            console.log('opening reference');
            createOverlay(createReference);
            pageContainer.style.filter = 'blur(2px)';
        }

        function closeReference(){
            console.log('closing reference');
            overlay.style.opacity = 0;
            setTimeout(() => {
                cleanElement(overlay);
            }, 500)
            pageContainer.style.filter = 'blur(0px)';
        }
        
        
        referenceOpen = !referenceOpen;
        console.log('reference:', referenceOpen);
    }
    
});

window.addEventListener('keyup', (target) => {
    delete keysActive[target.key];
});
