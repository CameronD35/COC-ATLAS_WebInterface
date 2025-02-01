import createHTMLChildElement from "./createElement.js";

export default class Dropdown {
    constructor(container, num, items) {
        
        this.container = container;
        this.num = num;
        this.items = items;
        this.curentSelection = 'Select';
        this.externalTitle;

        this.dropdownContainer = this.createDropdown(this.container, this.num);

        this.dropdownContent = this.createDropdownContent(this.contentContainer, this.items, this.num);

        window.addEventListener('click', (evt) => {

            const dropdownStatus = this.menu.getAttribute('data-open');

            if (!this.dropdownContainer.contains(evt.target) && dropdownStatus == 'true') {

                console.log(evt.target);

                this.dropdownHandler = this.dropdownHandler.bind(this);

                this.dropdownHandler(evt);

            }

        });

    }

    createDropdown(container, num) {
        const dropdownContainer = createHTMLChildElement(container, 'div', 'dropdown', null, `dropdown${num}`);
    
        const button = createHTMLChildElement(dropdownContainer, 'button', 'dropdownButton', null, `dropdownButton${num}`);

        this.dropdownHandler = this.dropdownHandler.bind(this);
        button.addEventListener('click', this.dropdownHandler);

        this.title = createHTMLChildElement(button, 'span', 'dropdownTitle', 'Select', `dropdownTitle${num}`);
        this.arrow = createHTMLChildElement(button, 'span', 'dropdownArrow', '▼', `dropdownArrow${num}`);
    
        this.menu = createHTMLChildElement(dropdownContainer, 'div', 'dropdownMenu', null, `dropdownMenu${num}`);
        this.menu.setAttribute('data-open', 'false');
    
        this.contentContainer = createHTMLChildElement(this.menu, 'div', 'dropdownContent', null, `dropdownContent${num}`);

        return dropdownContainer;
    }
    
    createDropdownContent(container, items, num, type="std") {
        
        let i = 0;
        for (const item in items){
    
    
            const elem = createHTMLChildElement(container, 'div', 'dropdownOption', item, `dropdownOption${this.num}-${i}`);
    
            // the key of the 'items' object is the title while the value is the type of option
            // def: default
            if (items[item] == 'def') {
                elem.classList.add('defaultDropdownOption');
            }
    
    
            elem.addEventListener('click', (evt) => {
                let title = evt.target.textContent;
    
                this.title.textContent = title;
    
                this.dropdownHandler(evt);

                this.currentSelection = title;

                if (this.externalTitle) {
                    this.externalTitle.textContent = title;
                }
    
            });
    
            if (i++ == Object.keys(items).length - 1) {
                continue;
            }
    
            const border = createHTMLChildElement(container, 'div', 'dropdownBorder', null, `border${num}-${i}`);
        }

        return 
    }
    
    dropdownHandler(evt){
    
        const isOpen = this.menu.getAttribute('data-open');
    
    
        if (isOpen == 'false'){
            this.menu.style.pointerEvents = 'all';
            this.menu.style.animation = "showDropdown 0.4s ease-in-out 0s 1 normal forwards";
            this.menu.setAttribute('data-open', 'true');
    
            this.arrow.style.transform = 'rotate(180deg)';
    
            this.contentContainer.childNodes.forEach((child, i) => {
    
                const titlesMatch = (child.textContent == this.title.textContent)
                const classes = child.classList
    
                if (titlesMatch && classes.contains('dropdownOption')) {
    
                    child.classList.add('dropdownCurrentOption');
    
                } else if (!titlesMatch && classes.contains('dropdownCurrentOption')) {
    
                    child.classList.remove('dropdownCurrentOption');
    
                }
            });
    
        } else {
    
            this.arrow.style.transform = 'rotate(0deg)';
    
            this.menu.style.pointerEvents = 'none';
            this.menu.style.animation = "hideDropdown 0.4s ease-in-out 0s 1 normal forwards";
            this.menu.setAttribute('data-open', 'false');
    
        }
    }

    attachToExternalTitle(elem){
        this.externalTitle = elem;
    }
}