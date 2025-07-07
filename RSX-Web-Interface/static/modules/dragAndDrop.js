import createHTMLChildElement from "./createElement.js";

export default class DragAndDrop {

    constructor(container) {
        this.container = container;
    }

    create() {
        const dragAndDropContainer = createHTMLChildElement(this.container, 'div', 'dragAndDropContainer', 'test', 'dragAndDropContainer', null, 'Upload files here.');
        
        return dragAndDropContainer;
    }

}