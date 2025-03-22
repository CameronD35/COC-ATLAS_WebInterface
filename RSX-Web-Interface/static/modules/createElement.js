// Function that simplifies the process of adding an id, class, and text to an HTML Element
// The first three parameters ARE required

/**
 * Function that simplifies the process of adding an id, class, and text to an HTML Element. The first three parameters ARE required
 * 
 * NOTE: If you do not want text but wish to assign an ID, simply set text equal to 'null' (ex: createHTMLChildElement('a', 'super', 'cool', null, 'element'))
 * @param {HTMLElement} parent - Reference to an element you wish to add the new element to
 * @param {string} tag - HTML tag for the new element (ex: 'div', 'img', 'span', etc.)
 * @param {string|string[]} classes - String or array of strings of classes you wish to add to the new element.
 * @param {string} text - Text you wish to be automatically placed in the new element (ex: you might want a start button to have 'Start' in it)
 * @param {string} id - HTML ID for the new element. If no seperate id is provided, the first class provided will take it's place.
 * @param {string} title - HTML title for the new element. This option is less likely to be used
 * @param {boolean} tooltip - Whether you would like a tooltip or not. As of now, this is quite buggy with images.
 * @returns DOM element if all the necessary values have been provided. Otherwise, returns console.log statement
 */
export default function createHTMLChildElement(parent, tag, classes, text, id, title=null, tooltip=null) {

    let elem = document.createElement(tag);

    // Create element as child of parent argument
    if(parent){
        parent.appendChild(elem);
    }

    // Add class if string or classes if array

    if (typeof classes == 'object') {

        for (let i = 0; i < classes.length; i++){
            elem.classList.add(classes[i]);
        }

    } else if (classes) {

        elem.classList.add(classes);

    }

    // Add text if a text argument is passed

    if (text) {

        elem.textContent = text;

    }

    if (title) {
        elem.title = title;
    }

    if (tooltip) {
        elem.style.position = 'relative';

        const tooltipElem = document.createElement('div');
        tooltipElem.style.opacity = 0;
        tooltipElem.classList.add('tooltip');

        

        elem.appendChild(tooltipElem);


        const tooltipText = document.createElement('span');
        tooltipText.textContent = tooltip;
        tooltipText.classList.add('tooltipText');

        tooltipElem.appendChild(tooltipText);


        elem.addEventListener('mouseover', () => {
            tooltipElem.style.opacity = 1;
        });

        elem.addEventListener('mouseleave', () => {
            tooltipElem.style.opacity = 0;
        });

    }

    // Give the element an id if a class or id argument is passed, otherwise don't create element
    // If you wish to let your class == your id automatically, pass null

    if (id) {

        elem.id = id;
        return elem;

    } else if (classes) {

        elem.id = typeof classes !== 'object' ? classes : classes[0];
        //console.log(document.getElementById(elem.id))
        return elem;

    } else {

        return console.log('You must have an id or class.');

    }
}