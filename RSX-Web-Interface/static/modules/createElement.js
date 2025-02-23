// Function that simplifies the process of adding an id, class, and text to an HTML Element
// The first three parameters ARE required

export default function createHTMLChildElement(parent, tag, classes, text, id, title, tooltip=null) {

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