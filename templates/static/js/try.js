
// Import data from an external CSV file
d3.json("/all-data", function (draftData) {
  //d3.csv("draft_data.csv").then(function(draftData) {
    // Format the data
    draftData.forEach(function(data) {
      data.year = Date.parse(data.year);
      data.pos = data.pos;
      {
        if (data.bonus == null)
             {return data.bonus = 0}
        else {
             data.bonus = data.bonus.replace('$', ' ');
             data.bonus = data.bonus.replace(',', '');
             data.bonus = data.bonus.replace(',', '');
             data.bonus = data.bonus.replace('.00', '');
             data.bonus = data.bonus.replace(/\s{2,}/g, '').trim();
             data.bonus = parseInt(data.bonus);
            }; }
    });
    //  console.log([draftData]);
  // filter to team and bonus columns
  var TeamBonus = draftData.map(({team,bonus}) => ({team,bonus}));
  TeamBonus.map(function(reduce) {
    return {
      team: reduce.team,
      bonus: TeamBonus.filter(function(o) {
        return o.team === reduce.team;
      }).reduce(function(sum, o) {
        return sum + o.bonus;
      }, 0)
    };
  })
  //console.log(TeamBonus);
  // add team's total bonuses paid
  var totals = TeamBonus.reduce(function(totals, bonus) {
    var name = bonus.team
    var price = +bonus.bonus
    totals[name] = (totals[name] || 0) + price
    return totals
  }, {})
  //console.log([totals]);
  function createBonusCombine(totalBonus){
  Bonus = [];
      for (let [key, value] of Object.entries(totalBonus)) {
        Bonus.push({
          "team":key, "bonus":value
        })
        };
          //Bonus[d.bonus] = value
      };
  createBonusCombine(totals)
  // console.log(Bonus);
  //function visual(v){
  // set the dimensions and margins of the graph
  var width = 1000
  var height = 600
  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
  // Read data
  //d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/11_SevCatOneNumNestedOneObsPerGroup.csv", function(data) {
  data = Bonus
  //console.log(data);
    // Filter a bit the data -> more than 1 million inhabitants
    //data = data.filter(function(d){ return d.bonus>10000000 })
    // Color palette for continents?
    var color = d3.scaleOrdinal()
      .range(d3.schemeSet1);
    // Size scale for countries
    var size = d3.scaleLinear()
      .domain([0, 140000000])
      .range([10,65])  // circle will be between 7 and 55 px wide
    // create a tooltip
    var Tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "gray")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip.style("display", "block")
        .style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
        .html('<u>' + d.team + '</u>' + "<br>" + "$" +d.bonus + " total bonuses paid")
        .style("left", (d3.mouse(this)) + "px")
        .style("top", (d3.mouse(this)) + "px")
        
    }
    var mouseleave = function(d) {
      Tooltip
        .style("opacity", 0)
    }
    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "node")
        .attr("r", function(d){ return size(d.bonus)})
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", function(d){ return color(d.team)})
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .call(d3.drag() // call specific function when circle is dragged
             .on("start", dragstarted)
             .on("drag", dragged)
             .on("end", dragended));
    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.bonus)+3) }).iterations(1)) // Force that avoids circle overlapping
    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
          node
              .attr("cx", function(d){ return d.x; })
              .attr("cy", function(d){ return d.y; })
        });
    // What happens when a circle is dragged?
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
    }
  });