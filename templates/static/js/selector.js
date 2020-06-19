

d3.json("all-data", function(data){
    

    var yearArray = [];
    var teamArray =[];
    data.forEach(p => {
        var team = p.team;
        var year = p.year;
        if(team in teamArray){
            teamArray[team] += 1
        }
        else {
            teamArray[team] = 1;
        }
        if(year in yearArray){
            yearArray[year] += 1
        }
        else {
            yearArray[year] = 1;
        }
    })
    var teams =[];
  Object.keys(teamArray).forEach(p=>{
      teams.push(p);
  })
    var years =[];
  Object.keys(yearArray).forEach(p=>{
    years.push(p);
})
    
  var dropDown1 = d3.select("#selYear")
  
 
  var options1 = dropDown1.selectAll("option")
    .data(years)
    .enter()
    .append("option");
  
  options1.text(function(d) {
      return d;
    })
    .attr("value", function(d) {
      return d;
    });
  
    var dropDown2 = d3.select("#selTeam")
  
 
    var options2 = dropDown2.selectAll("option")
      .data(teams)
      .enter()
      .append("option");
    
    options2.text(function(d) {
        return d;
      })
      .attr("value", function(d) {
        return d;
      });               
        
    


function yearChange(event){
    var input = d3.event.target.value
    
    createYearData(input);
}
function teamChange(event){
    var input = d3.event.target.value
    createTeamData(input);
}
createYearData("all");

    dropDown1.on("change", yearChange);
    dropDown2.on("change", teamChange);
})


