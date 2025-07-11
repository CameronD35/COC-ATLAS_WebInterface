import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import createHTMLChildElement from "./createElement.js";

// Random dataset of x and y values --TESTING--
let randomData = [];
// Current x value --TESTING--

// Transistion instance used for animation

// Function for updating the graph
export default class Graph {

    constructor(width, height, marginObj, container, dataset, [xAxisLabel, yAxisLabel], [graphColorBottom, graphColorTop], id, [xAxisTicks, yAxisTicks]) {
        
        this.id = id;
        this.graphNum = id.slice(-1);
        //console.log(this.graphNum);
        this.timeElapsed = 0;  
        this.currentVal = 0;
        this.startTime = Date.now();

        this.xTicks = xAxisTicks;
        this.yTicks = yAxisTicks;

        this.formatter = d3.formatPrefix(',.0', 1e-3);

        // initializes the dataset for this graph
        this.dataset = dataset? dataset : [];

        this.maxY = d3.max(this.dataset, (d) => { return d.y});

        //console.log(this.dataset)

        // Set the high bound for the domain, based off the highest x value in the dataset
        this.higherDomainBound = d3.max(this.dataset, (d) => { return d.x});

        this.lowerDomainBound = 0;

        this.domainLength = Infinity;

        this.filteredData = this.dataset.filter((d) => { if (d.x >= this.lowerDomainBound) { return d.x}})

        // Defines the margin, width, height, and container for the object
        this.margin = marginObj;
        this.width = width;
        this.height = height;
        this.container = document.querySelector(container);
        this.container.setAttribute('data-currset', 'select');

        // Defines the initial x-scale for the object
        this.xScale = d3.scaleLinear(d3.extent(this.dataset, (d) => { return d.x}), [this.margin.left, width - this.margin.right]);

        // Defines the initial y-scale for the object
        this.yScale = d3.scaleLinear(d3.extent(this.dataset, (d) => { return d.y}), [height - this.margin.bottom, this.margin.top]);

        // Definies the svg for this object
        this.svg = d3.create('svg')
        .attr("width", width)
        .attr("height", height)
        .attr("color", "var(--mainColor)")
        .attr("class", "svg");

        this.gradient = this.createGradient([graphColorBottom, graphColorTop]);

        //console.log(this.gradient)

        // Definies and creaates the axes for this object
        this.xAxis = this.createXAxis("xAxis");
        this.yAxis = this.createYAxis("yAxis");

        // Defines the axis labels for the object
        this.xAxisLabel = this.createAxisLabel("x", "axisLabel", xAxisLabel);
        this.yAxisLabel = this.createAxisLabel("y", "axisLabel", yAxisLabel);


        // Defines the line path for this object
        this.linePath = this.createLine();

        // Defines the area path for this object
        this.areaPath = this.createArea();

        // datapoint circles
        this.circles = this.createCircles("var(--mainColor)");

    }

    create() {
        // Append the chart to the container
        this.container.append(this.svg.node());


        // Interval that updates the graph every 1 second --USED FOR TESTING--
        // setInterval(() => {
        //     this.update(Math.round(Math.random()*10));
        // }, 1000);
    }

    update(newY) {

        if (newY != null){
            let currentTime = Date.now();

            this.timeElapsed = (currentTime - this.startTime)/1000;

            this.currentVal = newY;

            //console.log(this.currentVal);

            // Pushes the global values to the dataset
            this.dataset.push({x: this.timeElapsed, y: this.currentVal});
        }

        this.maxY = d3.max(this.dataset, (d) => { return d.y});
        

        // Set the high bound for the domain, based off the highest x value in the dataset
        this.higherDomainBound = d3.max(this.dataset, (d) => { return d.x});

        const minX = d3.min(this.dataset, (d) => { return d.x});
        const datasetLength = this.higherDomainBound - minX;

        const length = datasetLength - this.domainLength;

        //console.log(`${datasetLength} - ${this.domainLength} = ${length}`)

        // Sets the low bound for the domain, based off (higherDomainBound - domainLength)
        // If the domain Length results in a zero or negative lowerDomainBound, then it will go to the full domain;
        // If the difference in higherDomainBound - domainLength is < 10, then the lowerDomainBound will = 10;
        this.lowerDomainBound = (() => {
            if ((length) <= 0) {
                
                return minX;

            } else {

                return this.higherDomainBound - this.domainLength;

            }
        })()

        this.filteredData = this.dataset.filter((d) => { if (d.x >= this.lowerDomainBound) {return d.x}});


        //console.log(`(${this.lowerDomainBound}, ${this.higherDomainBound})`);

        // Re-definies the x and y scales for this object
        this.xScale = d3.scaleLinear([this.lowerDomainBound, this.higherDomainBound], [this.margin.left, this.width - this.margin.right]);
        this.yScale = d3.scaleLinear(d3.extent(this.filteredData, (d) => { return d.y}), [this.height - this.margin.bottom, this.margin.top]);


        // Creates a new line generator
        let lineGen = d3.line()
        .defined((d) => d.y !== null)
        .x((d) => this.xScale(d.x))
        .y((d) => this.yScale(d.y));

        // Creates a new area generator
        let areaGen = d3.area()
        .defined((d) => d.y !== null)
        .x((d) => this.xScale(d.x))
        .y0(this.yScale(d3.min(this.filteredData, (e) => {return e.y})))
        .y1((d) => this.yScale(d.y));

        // Calls this objects axes using the objects new scales
        // Ticks: 10 if the highest # is <= 100; else, the tick count = 5
        this.xAxis.transition()
        .duration(250)
        .call(d3.axisBottom(this.xScale)
        .ticks((() => {

            if(this.higherDomainBound >= 1000){
                return 3;
            } else if (this.xTicks > 1) {
                return this.xTicks;
            }

        })()).tickFormat(d3.format('~s')));

        this.yAxis
        .transition()
        .duration(250)
        .call(d3.axisLeft(this.yScale)
        .ticks(5)
        .tickFormat((d) => {return d + '%'}));

        // Resets the datum used for this object's line path and redraws the line
        // Adds transition to the line
        this.linePath.datum(this.filteredData)
        this.linePath.transition().duration(250).attr("d", lineGen);

        // Resets the datum used for this object's area path and redraws the area
        // Adds transition to the area
        this.areaPath.datum(this.filteredData)
        this.areaPath.transition().duration(250).attr("d", areaGen);


        // Adds circles to all the new data points
        this.circles = this.createCircles("var(--mainColor)");
        this.circles.transition().duration(250);

        d3.selectAll('text').raise();
    }

    // function for changing the data points that are displayed on the graph
    // Starts from the highest x value
    changeDomain(domainLength) {
        this.domainLength = domainLength;

        this.filteredData = this.dataset.filter((d) => { if (d.x >= this.lowerDomainBound) { return d.x}})
    }

    // Creates a label for one axis of the graph
    // axis = "x" or "y"
    createAxisLabel(axis, className, label){
        let axisLabel = this.svg.append("text")
        .attr("class", className)
        .attr("text-anchor", "middle")
        .attr("y", (axis == 'x') ? (this.height - (this.margin.bottom + 8)) : this.margin.left + this.height/6)
        .attr("x", (axis == 'x') ? ((this.width)/2) : (this.height - this.margin.bottom - this.margin.top)/2)
        .text(label);

        if (axis !== 'x'){
            axisLabel
                .attr("transform-origin", "center")
                .attr("transform", "rotate(-90)");
        }

        return axisLabel;
    }

    // creates a line of specified color using this graph's data
    createLine(){
            
        //line generator
        let lineGen = d3.line()
        .defined((d) => d.y !== null)
        .x((d) => this.xScale(d.x))
        .y((d) => this.yScale(d.y));

        // line path generator
        let lineSVG = this.svg.append("path")
        .datum(this.dataset)
        .attr("d", lineGen)
        .style("stroke", `url(#${this.id}-lineGradient)`)
        .attr('stroke-width', '2px')
        .attr("fill", "none")
        .attr("class", "line");

        return lineSVG;

    }

    // creates an area of specified color using this graph's data
    createArea(){
        let areaGen = d3.area()
        .defined((d) => d.y !== null)
        .x((d) => this.xScale(d.x))
        .y0(this.yScale(d3.min(this.dataset, (e) => {return e.y})))
        .y1((d) => this.yScale(d.y));

        // area path generator
        let areaSVG = this.svg.append("path")
            .datum(this.dataset)
            .attr("d", areaGen)
            .attr("stroke", "none")
            .attr('fill', `url(#${this.id}-lineGradient)`)
            .attr("fill-opacity", "0.3")
            .attr("class", "area");

        return areaSVG;
    }

    // creates circles at each of the data points using this graph's data
    createCircles(color){

        // let group = this.svg.selectAll('g')
        // .attr('class', 'point')

        let circle = this.svg.selectAll("circle")
        .data(this.filteredData)
        .join("circle")
        .attr("r", 2.5)
        .attr("cx", (d) => {return this.xScale(d.x)})
        .attr("cy", (d) => {return this.yScale(d.y)})
        .attr("fill", color)
        .attr('fill-opacity', '0.8')
        .attr('data-x', (d) => {return d.x})
        .attr('data-y', (d) => {return d.y});

        let allCircles = circle._groups[0];

        // this grabs the x and y values for the circle and assigns a tooltip to
        allCircles.forEach((cir, i) => {

            //console.log(cir)
            const x = cir.getAttribute('data-x');
            const y = cir.getAttribute('data-y');

            if (y == null) {
                cir.parentNode.removeChild(cir);
            }

            // //console.log(`(${x}, ${y})`);
            // this.addTooltip = this.addTooltip.bind(this);
            // this.addTooltip(this.svg._groups[0][0], cir, `(${x}, ${y})`);
        })

        //console.log(circle)

        return circle;
    }

    addTooltip(elem, cir, tooltip) { 
        
        const children = cir.children;

        const cx = cir.getAttribute('cx');
        const cy = cir.getAttribute('cy');

        //console.log(elem);

        // since there is no other point we add children to the circle
        // we can simply see if their are children or not and return if so
        // this prevents us from adding duplicate tooltips
        if (children.length >= 1) {

            return;
        }

        // const tooltipElem = document.createElement('g');
        // tooltipElem.setAttribute('width', '50');
        // tooltipElem.setAttribute('height', '50');
        // tooltipElem.style.opacity = 1;
        // tooltipElem.classList.add('tooltipSVG');

        

        //elem.appendChild(tooltipElem);


        const tooltipText = document.createElement('text');
        tooltipText.textContent = tooltip;

        tooltipText.setAttribute('x', cx);
        tooltipText.setAttribute('y', cy);

        tooltipText.classList.add('tooltipTextSVG');

        elem.appendChild(tooltipText);


        elem.addEventListener('mouseover', () => {
            //tooltipElem.style.opacity = 1;
        });

        elem.addEventListener('mouseleave', () => {
            //tooltipElem.style.opacity = 1;
        });

        return;// tooltipElem;
    }

    // creates the x-axis using this.xScale
    createXAxis(className){
        let xAxis = this.svg.append("g")
        .attr("transform", `translate(0, ${this.height - this.margin.bottom})`)
        .attr("class", className)
        .call(d3.axisBottom(this.xScale));

        return xAxis;
    }

    // creates the y-axis using this.yScale
    createYAxis(className){
        let yAxis = this.svg.append("g")
        .attr("transform", `translate(${this.margin.left}, 0)`)
        .attr("class", className)
        .call(d3.axisLeft(this.yScale));

        return yAxis;
    }

    // Creates gradient tag to be applied to line and area paths
    createGradient([bottomColor, topColor]){
        let gradient = this.svg.append('defs').append(`linearGradient`)
        .attr('id', `${this.id}-lineGradient`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
        
        gradient.append('stop')
        .attr('offset', '0%')
        .style('stop-color', topColor)
        .style('stop-opacity', 1);
        
        gradient.append('stop')
        .attr('offset', '100%')
        .style('stop-color', bottomColor)
        .style('stop-opacity', 1);

        return gradient;
    }

    resize(width, height){
        this.svg
        .attr('width', width)
        .attr('height', height);


        this.width = width;
        this.height = height;



        //console.log(this.width/2);
        this.xAxisLabel.attr("x", this.width/2);
        this.xAxisLabel.attr("y", (this.height - (this.margin.bottom + 8)))
        
        //console.log(this.width/2);
        this.yAxisLabel.attr("x", (this.height - this.margin.bottom - this.margin.top)/2);
        this.yAxisLabel.attr("y", this.margin.left + this.height/6)


        this.xAxis.attr("transform", `translate(0, ${this.height - this.margin.bottom})`);

        
        this.yAxis.attr("transform", `translate(${this.margin.left}, 0)`);

        this.update();

        
        
    }

    // getSetTitle() {
    //     const container = this.container
    //     console.log(container);
    //     return currset;
    // }

    setTitle(newTitle) {
        d3.select('svg').attr('data-currset', newTitle);
        //console.log('555')
    }
}