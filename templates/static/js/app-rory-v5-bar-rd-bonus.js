// SVG container
var svgHeight = 550;
var svgWidth = 1100;

// margins
var margin = {
  top: 50,
  right: 50,
  bottom: 25,
  left: 75
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3
  .select("#RoryChart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .style('background', '#f4f4f4');

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.json("/all-data", function(draftData) 
  {    
// Format the data
    draftData.forEach(function(data) {
      
      if(data.round == '1 Comp' ){
      data.round = data.round.replace('1 Comp', '1');
      }
      else if(data.round == '2 Comp'){
      data.round = data.round.replace('2 Comp', '2');
      }
      else if(data.round =='3 Comp'){
      data.round = data.round.replace('3 Comp', '3');
      }
      else{
      data.round = +data.round;
      // console.log(data.round);
      }
      
          if (data.bonus == null)
               {return 0}
          else {
               data.bonus = data.bonus.replace('$', '');
               data.bonus = data.bonus.replace(',', '');
               data.bonus = data.bonus.replace(',', '');
               data.bonus = data.bonus.replace('.00', '');
               data.bonus = data.bonus.replace(/\s{2,}/g, '').trim();  
               data.bonus = parseInt(data.bonus); }; 
      });

// scale y to chart height
var yScale = d3.scaleLinear()
  .domain([0, d3.max(draftData, d => d.bonus)])
  .range([chartHeight, 0]).clamp(true);

// scale x to chart width
var xScale = d3.scaleBand()
  .domain(draftData.map(d => d.round))
  .range([0, chartWidth]);

// create axes
var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);

// set x to the bottom of the chart
chartGroup.append("g")
   .classed("xAxis", true)
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(xAxis);

// set y to the y axis
// This syntax allows us to call the axis function
// and pass in the selector without breaking the chaining
chartGroup.append("g")
  .classed("yAxis", true)
  .call(yAxis);

// Append Data to chartGroup
chartGroup.selectAll(".bar")
  .data(draftData)
  .enter()
  .append("rect")
  .classed("bar", true)
  .attr("x", d => xScale(d.round))
  .attr("y", d => yScale(d.bonus))
  .attr("width", 25)
  .attr("height", d => chartHeight - yScale(d.bonus)); 
});