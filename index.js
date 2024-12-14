import createHTMLChildElement from "./modules/createElement.js";
import Graph from "./modules/lineChart.js";

let grayMsg = false;

// Build your component here. Feel free to change whatever you want on these documents.
function graph() {
  let graph = new Graph(
    200,
    100,
    { top: 20, bottom: 20, right: 20, left: 20 },
    "#lineChart",
    null,
    ["Time", null],
    ["red", "green"],
    "graph"
  );
  graph.create();
}
graph();
const myFeatureItem = document.getElementsByClassName("featuresItem");
myFeatureItem.addEventListener("mouseover", (event) => {
  event.target.style.textDecoration = "line-through";
});

// Checks if this element with a given attribute (such as id or class) exists. If it does, a specified function will ruin.
function ifElementExists(element, func) {
  if (element) {
    //console.log('work');
    func();
  } else {
    //console.log('no work');
  }
}

// This functions deletes all the child DOM elements of the specified 'element'
function cleanElement(element) {
  if (element && element.hasChildNodes()) {
    element.replaceChildren();

    return element;
  }
}

// Returns any desired value based on some criteria
function returnValueBasedOnCriteria(criteria, trueVal, falseVal) {
  if (criteria) {
    return trueVal;
  } else {
    return falseVal;
  }
}
