import createHTMLChildElement from './modules/createElement.js';

// START SETUP CODE

let referenceOpen = false;
let graphRange;
createPage();
addTextToBoxes();
console.log(`%cUse 'Shift + R' to access a reference image for the interface!`, 'background: rgba(44, 212, 27, 0.3); border-radius: 2px; width: 100%;')

// END SETUP CODE


// DO NOT DELETE THIS FUNCTION

function createPage() {
    let parentContainer = document.querySelector('.boxContainer');
    createBoxStructure(parentContainer);
    //setCurrentBoxes(CSSClasses);
}


// DO NOT DELETE THIS FUNCTION

function createBoxStructure(parent){
    let topRow = createRow(parent, 1, 2, 15, false, [95, 5]);
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

        let currentColumn = createHTMLChildElement(row, 'div', [`dashRow${rowNumber}-Column`, 'columnInRow'], null, `dashRow${rowNumber}-Column${i}`);

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

        let currentRow = createHTMLChildElement(column, 'div', [`dashColumn${columnNumber}-Row`, 'rowInColumn'], null, `dashColumn${columnNumber}-Row${i}`);

        if (!autoRowSizing){
            boxHeight = rowHeights[i-1];
        }

        currentRow.style.height = `${boxHeight}%`;
    }

    return column;
}





// PUT YOUR CODE HERE. FEEL FREE TO ADD, MODIFY, OR REMOVE FUNCTIONS AS NEEDED.

function createComputerDataSection(){

}

function createSettingsSection(){

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
function addTextToBoxes(){
    let computerDataSection = document.getElementById('dashRow1-Column1');

    let settingsSection = document.getElementById('dashRow1-Column2');

    let realTimeSection = document.getElementById('dashColumn4-Row1');

    let featuresSection = document.getElementById('dashColumn4-Row2');

    let logSection = document.getElementById('dashRow2-Column2');

    let connectionStatusSection = document.getElementById('dashRow3-Column1');


    createHTMLChildElement(computerDataSection, 'div', 'boxTitle', 'Computer Data', 'cdsText');

    createHTMLChildElement(settingsSection, 'div', 'boxTitle', 'Sett.', 'ssText');

    createHTMLChildElement(realTimeSection, 'div', 'boxTitle', 'Real-Time Data', 'rtText');

    createHTMLChildElement(featuresSection, 'div', 'boxTitle', 'Features', 'edsText');

    createHTMLChildElement(logSection, 'div', 'boxTitle', 'Log', 'lsText');

    createHTMLChildElement(connectionStatusSection, 'div', 'boxTitle', 'Connection Status', 'cssText');

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

let keysActive = {}

// THESE FUNCTIONS HANDLE THE OPENING AND CLOSING OF THE REFERENCE OVERLAY. DON'T CHANGE THESE, BUT THEY MAY BE A HELPFUL REFERENCE FOR THE OTHER COMPONENTS ON THE PAGE. 
// Use 'Shift + F' to open and close the reference. You may also click outside the image to close it

window.addEventListener('keydown', (target) => {

    keysActive[target.key] = true;

    if (keysActive['Shift'] == true && target.key == 'R'){

        let referenceContainer = document.getElementById('reference');
        let referenceImage = document.querySelector('.referenceContent');
        let pageContainer = document.querySelector('.hero');


        if(!referenceOpen){

            openReference();

            referenceImage.addEventListener('mouseover', focusPage);

            referenceImage.addEventListener('mouseout', focusReference);

            window.addEventListener('click', (target) => {

                if (target.target.id != 'referenceImage' && referenceOpen){

                    console.log('clicked outside.');
                    referenceOpen = !referenceOpen;
                    closeReference();
                    //console.log(target);

                } else { 

                    console.log('clicked inside');

                }
            })

        } else {

            closeReference();

            referenceImage.removeEventListener('mouseover', focusPage);

            referenceImage.removeEventListener('mouseout', focusReference);
        }
        
        function focusPage(){
            if(referenceOpen){
                referenceImage.style.opacity = 0.4;
                pageContainer.style.filter = 'blur(0px)';
            }
        }

        function focusReference(){
            if(referenceOpen){
                referenceImage.style.opacity = 1;
                pageContainer.style.filter = 'blur(2px)';
            }
        }

        function openReference(){
            console.log('opening reference');
            referenceContainer.style.opacity = 1;
            pageContainer.style.filter = 'blur(2px)';
        }

        function closeReference(){
            console.log('closing reference');
            referenceContainer.style.opacity = 0;
            pageContainer.style.filter = 'blur(0px)';
        }
        
        
        referenceOpen = !referenceOpen;
        //console.log('reference:', referenceOpen);
    }
    
});

window.addEventListener('keyup', (target) => {
    delete keysActive[target.key];
});