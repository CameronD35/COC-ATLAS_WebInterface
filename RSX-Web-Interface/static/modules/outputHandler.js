import elementMap from "./elementMap.js";

function formatOutput(data, isStart) {

    if (isStart) {
        generateFileHeader(elementMap);
    }


    
}

function generateFileHeader(elementHash){
    const headerString = 'time,'
    for (element in elementMap) {
        headerString.concat(`${element},`)
    }

    return headerString;
}