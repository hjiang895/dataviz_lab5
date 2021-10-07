// CHART INIT ------------------------------

let ascending = true;
let category = "revenue";
let label = "Revenue"

// create svg with margin convention
const margin = ({top: 50, right: 50, bottom: 50, left: 90})
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create scales without domains
 const xScale = d3.scaleBand()
             .range([0, width])
             .paddingInner(0.1);

 const yScale = d3.scaleLinear()
             .rangeRound([height, 0]);

// create axes and axis title containers

svg.append("g").attr("class", "axis x-axis");
svg.append("g").attr("class", "axis y-axis");

let yLabel = svg.append("text")
    .attr("x", -1 * height / 2 - 40)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text(`${label}`);

// CHART UPDATE FUNCTION -------------------
function update(data, category){
    console.log(data);
    category = document.querySelector("#category").value;
    data = data.sort(function(a, b) {
        if (ascending) {
            return a[category] - b[category];
        } else {
            return b[category] - a[category];
        }
    })

	// update domains
    xScale.domain(data.map(d => d.company));
    yScale.domain([0, d3.max(data, d => d[category])]);

	// update axes and axis title

    const xAxis = d3.axisBottom().scale(xScale).ticks(5, "s")
	const yAxis = d3.axisLeft().scale(yScale).ticks(5, "s")

    category == "revenue"? label = "Revenue" : label = "Number of Stores";
    yLabel.text(label);
    // update bars
    svg.selectAll("rect")
		.transition() 
		.duration(700)
		.attr("x", d => xScale(d.company))
		.attr("y", d => yScale(d[category]))
		.attr("height", d => height - yScale(d[category]))
		.attr("width", 30)

    svg.select(".axis x-axis")
        .transition()
        .duration(700)
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)

    svg.select(".axis y-axis")
        .transition()
        .duration(700)
        .call(yAxis)
}

// CHART UPDATES ---------------------------

let data = d3.csv("coffee-house-chains.csv", d3.autoType).then(data => {
    
    data = data.sort(function(a, b) {
        if (ascending) {
            return a[category] - b[category];
        } else {
            return b[category] - a[category];
        }
    })

xScale.domain(data.map(d => d.company))
yScale.domain(d3.extent(data, d => d[category]))

svg.select(".axis x-axis")
    .transition()
    .duration(0)
    .attr("transform", `translate(0, ${height})`)

svg.selectAll("rect")
    .remove()
    .exit()
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "rect")
    .attr("fill", "orange")
    .attr("x", d => xScale(d.company))
    .attr("y", d => yScale(d[category]))
    .attr("height", d => height - yScale(d[category]))
    .attr("width", 50)

// create axes and axis title
const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5, "s");
const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5, "s");

svg.append("g")
    .attr("class", "axis x-axis")
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`);

svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

document.querySelector("#category").addEventListener("change", () => {
    update(data, category)
})
document.querySelector("#sort").addEventListener("click", () => {
    ascending = !ascending;
    update(data, category);
})

});
