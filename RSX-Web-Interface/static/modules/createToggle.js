import createHTMLChildElement from "./createElement.js";

class SwitchToggle {

    constructor() {
        'hi';
    }

    create() {
        
        console.log("youve made me");

        const switchBackground = createHTMLChildElement(container, 'div', 'switch', null, `switch${name}`);
        const switchToggle = createHTMLChildElement(switchBackground, 'div', 'switchToggle', null, `switchToggle${name.substring(0, 4)}`);

        // sets original state to initialState
        switchToggle.active = initialState;

        // Adds click event listener
        switchToggle.addEventListener('click', () => {

            // If the object is not active
            if (switchToggle.active) {

                switchToggle.style.transform = `translateX(1%)`;
                switchBackground.style.backgroundPositionX = '100%';
                switchBackground.style.boxShadow = '0px 0px 15px rgba(230,0,0,0.5)';

            } else {

                const containerWidth = document.querySelector('.switch').getBoundingClientRect().width;
                console.log(containerWidth, switchToggle.style.margin);
                switchToggle.style.transform = `translateX(calc(${containerWidth}px - ${switchToggle.style.margin} - ${switchToggle.style.margin} - ${switchToggle.style.width}))`;
                switchBackground.style.boxShadow = '0px 0px 15px rgba(0,230,0,0.5)';
                switchBackground.style.backgroundPositionX = '0%';
                // object.func();

            }

            // switch toggle state
            switchToggle.active = !switchToggle.active;

        });

        console.log(switchToggle);

        return switchBackground;

    }

    handleToggle() {

    }

}

export default function createSwitchToggle(name, container, initialState = false){

    console.log("youve made me")

    const switchBackground = createHTMLChildElement(container, 'div', 'switch', null, `switch${name}`);
    const switchToggle = createHTMLChildElement(switchBackground, 'div', 'switchToggle', null, `switchToggle${name.substring(0, 4)}`);

    // sets original state to initialState
    switchToggle.active = initialState;

    // Adds click event listener
    switchToggle.addEventListener('click', () => {

        // If the object is not active
        if (switchToggle.active) {

            switchToggle.style.transform = `translateX(5px)`;
            switchBackground.style.backgroundPositionX = '100%';
            switchBackground.style.boxShadow = '0px 0px 15px rgba(230,0,0,0.5)';

        } else {

            const containerWidth = document.querySelector('.switch').getBoundingClientRect().width;
            const toggleWidth = switchToggle.getBoundingClientRect().width;

            console.log(containerWidth, switchToggle.style.margin);
            switchToggle.style.transform = `translateX(${containerWidth - toggleWidth - 5}px)`;
            switchBackground.style.boxShadow = '0px 0px 15px rgba(0,230,0,0.5)';
            switchBackground.style.backgroundPositionX = '0%';
            // object.func();

        }

        // switch toggle state
        switchToggle.active = !switchToggle.active;

    });

    console.log(switchToggle);

    return switchBackground;
    
}