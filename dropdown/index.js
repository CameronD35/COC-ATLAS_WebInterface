
const items = {
    "Select": "def",
    "Temperature": "std",
    "Pressure": "std",
    "Cloud Points": "std"
}

window.addEventListener('click', (evt) => {
    const dropdown = document.querySelector('.dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdownStatus = dropdownMenu.getAttribute('data-open');
    console.log(dropdown, evt.target);
    if (!dropdown.contains(evt.target) && dropdownStatus == 'true') {
        console.log(evt.target);
        dropdownHandler(evt);
    }
});

function createDropdown(container, items, type="std") {
    let contentContainer = document.createElement('div');
    contentContainer.classList.add('dropdown-content');

    container.appendChild(contentContainer);
    
    let i = 0;
    for (let item in items){
        console.log(item);

        let elem = document.createElement('div');
        elem.classList.add('option');
        elem.textContent = item;
        contentContainer.appendChild(elem);

        if (items[item] == 'def') {
            elem.classList.add('defaultOption');
        }


        elem.addEventListener('click', (evt) => {
            let title = evt.target.textContent;
            // index 0 is the title, index 1 is the arrow
            let dropdownTitle = container.previousElementSibling.children[0];

            dropdownTitle.textContent = title;

            dropdownHandler(evt);

        });

        if (i++ == Object.keys(items).length - 1) {
            continue;
        }

        let border = document.createElement('div');
        border.classList.add('border');
        contentContainer.appendChild(border);
    }
}

document.querySelectorAll('.link').forEach((button) => {
    button.addEventListener('click', dropdownHandler);
})

function dropdownHandler(evt){
    let menu = document.querySelector('.dropdown-menu');

    let arrow = document.querySelector('.linkArrow');

    let content = document.querySelector('.dropdown-content');
    // index 0 is the title, index 1 is the arrow
    let dropdownTitle = menu.previousElementSibling.children[0];

    let isOpen = menu.getAttribute('data-open');


    if (isOpen == 'false'){
        menu.style.pointerEvents = 'all';
        menu.style.animation = "showDropdown 0.4s ease-in-out 0s 1 normal forwards";
        menu.setAttribute('data-open', 'true');

        arrow.style.transform = 'rotate(180deg)';

        content.childNodes.forEach((child, i) => {

            const titlesMatch = (child.textContent == dropdownTitle.textContent)
            const classes = child.classList

            if (titlesMatch && classes.contains('option')) {

                child.classList.add('currentOption');

            } else if (!titlesMatch && classes.contains('currentOption')) {

                child.classList.remove('currentOption');

            }
        });

    } else {

        arrow.style.transform = 'rotate(0deg)';

        menu.style.pointerEvents = 'none';
        menu.style.animation = "hideDropdown 0.4s ease-in-out 0s 1 normal forwards";
        menu.setAttribute('data-open', 'false');

    }
}

createDropdown(document.querySelector('.dropdown-menu'), items);

