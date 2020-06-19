var myMap = L.map("map", {
  center:[29.8283, -98.5795],
  zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: APIkey
}).addTo(myMap);
var legend;
function createMap(p){



  createLegend(p);
  colorSelector(p);
  L.geoJson(p, {
    

    style: function(feature) {
      return{

      color: "white",
      fillColor: feature.properties.color,
      fillOpacity: 0.5,
      wieght: .5
    };
    },
    
    onEachFeature: function(feature, layer) {
      
     
      layer.on({
        
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.85,
            wieght: 5
          });
        },
        
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5,
            wieght: .5
          });
        },
        
    
      });
      layer.bindPopup(`<h1> ${feature.properties.NAME} Data</h1> <hr> <h3> Number of Picks: ${feature.properties.baseball.picks} </h3>
      <br> <h3> First Rounders: ${feature.properties.baseball.firstR} </h3> <br> <h3> First Pick: ${feature.properties.baseball.first} </h3>`);
    
    }
  }).addTo(myMap);
  
}
 function createLegend(p){
  
  var maxArray = [];
  p.forEach(p=>{
    maxArray.push(p.properties.baseball.picks);
  }) 
  var min = Math.min(...maxArray);
  var max = Math.max(...maxArray);
  if(legend instanceof L.Control){myMap.removeControl(legend);}
   legend = L.control({ position: "bottomright" });
  
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [min,0, 0, 0, 0, 0, 0, max];
    var colors = ["LimeGreen", "lime", "Chartreuse", "yellow", "orange", "lightsalmon", "orangeRed", "red"];
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Number of Picks</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div><br>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limits, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });
    
    div.innerHTML += "<ol>" + labels.join("") + "</ol>";
    return div;
  };
  legend.addTo(myMap)
}

function colorSelector(d){
  var maxArray = [];
  d.forEach(p=>{
    maxArray.push(p.properties.baseball.picks);
  }) 
  var min = Math.min(...maxArray);
  var max = Math.max(...maxArray);
  var med = max/2;
  var hh = med*1.75;
  var midh= med*1.25;
  var hig = med*1.5;
  var low = med*.5;
  var midl = med*.75;
  var ll = med* .25;
  // console.log(ll);
  d.forEach(p=>{
    var prop = p.properties.baseball.picks
    if(prop > hh){
      p.properties.color = "red";
    }
    else if(prop > hig){
      p.properties.color = "orangered";
    }
    else if(prop > midh){
      p.properties.color = "lightsalmon";
    }
    else if(prop > med){
      p.properties.color = "orange";
    }
    else if(prop > midl){
      p.properties.color = "yellow";
    }
    else if(prop > low){
      p.properties.color = "Chartreuse";
    }
    else if(prop > ll){
      p.properties.color = "lime";
    }
    else{
      p.properties.color = "LimeGreen";
    }
  })
}

function createGeoData(p){
  var link = "static/data/states_geo.json";
  var results = [];

  d3.json(link, function(data){
    results = data.features;
    
    
    // console.log(results[0].properties);
    for(var i = 0; i < results.length; i++){
      var properties = results[i].properties;
      // console.log(properties.NAME);
      Object.entries(p).forEach(([key, value])=>{
        // console.log(key)
        if (properties.NAME == key){
          properties.baseball = value;
        }
        else if(properties.NAME == "District of Columbia"){
          properties.baseball = {"firstR": 0, "picks": 0, "first": 0}
        }
      })
    
    }
    // console.log(results);
    
    createMap(results);
  });
    
  
};


function createYearData(year){

  stateData = [];
  d3.json("/all-data", function (data) {
 
  // console.log(data);
  data.forEach(p => {
    if(year == "all"){
      if(p.st in stateData){
        
        if(p.round == 1){
           if(p.pick == 1){
             if(p.signed == "Signed"){
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first += 1;
            stateData[p.st].signed += 1;
          }
          else{
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first += 1;
            stateData[p.st].signed = stateData[p.st].signed;
          }
           }
           else{
             if (p.signed == "Signed"){
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first = stateData[p.st].first;
            stateData[p.st].signed += 1;
             }
             else {
              stateData[p.st].firstR +=1;
              stateData[p.st].picks += 1;
              stateData[p.st].first = stateData[p.st].first;
              stateData[p.st].signed = stateData[p.st].signed;
            }
           }
        }
        else{
          if(p.signed =="Signed"){
          stateData[p.st].firstR = stateData[p.st].firstR;
          stateData[p.st].first = stateData[p.st].first;
          stateData[p.st].picks += 1;
          stateData[p.st].signed += 1;
          }
          else{
            stateData[p.st].firstR = stateData[p.st].firstR;
          stateData[p.st].first = stateData[p.st].first;
          stateData[p.st].picks += 1;
          stateData[p.st].signed = stateData[p.st].signed;
          }
        }
      }
      else{
        
        if(p.round == 1){
           if(p.pick == 1){ 
            if(p.signed =="Signed"){
            stateData[p.st] = {"firstR" :1, "picks" :1, "first": 1, "signed": 1};
            }
            else{
              stateData[p.st] = {"firstR" :1, "picks" :1, "first": 1, "signed": 0};
            }
           }
           else{
            if(p.signed =="Signed"){
            stateData[p.st] = {"firstR" :1, "picks" :1, "first": 0, "signed": 1};
            }
            else{
              stateData[p.st] = {"firstR" :1, "picks" :1, "first": 0, "signed": 0};
            }
           }
        }
        else{
          if(p.signed=="Signed"){
            stateData[p.st] = {"firstR" :0, "picks" :1, "first": 0, "signed": 1};
          }
          else{
            stateData[p.st] = {"firstR" :0, "picks" :1, "first": 1, "signed": 0};
          }
          
        }
      }
    }
    else if(year == p.year){
      if(p.st in stateData){
        
        if(p.round == 1){
           if(p.pick == 1){
             if(p.signed == "Signed"){
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first += 1;
            stateData[p.st].signed += 1;
          }
          else{
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first += 1;
            stateData[p.st].signed = stateData[p.st].signed;
          }
           }
           else{
             if (p.signed == "Signed"){
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first = stateData[p.st].first;
            stateData[p.st].signed += 1;
             }
             else {
              stateData[p.st].firstR +=1;
              stateData[p.st].picks += 1;
              stateData[p.st].first = stateData[p.st].first;
              stateData[p.st].signed = stateData[p.st].signed;
            }
           }
        }
        else{
          if(p.signed =="Signed"){
          stateData[p.st].firstR = stateData[p.st].firstR;
          stateData[p.st].first = stateData[p.st].first;
          stateData[p.st].picks += 1;
          stateData[p.st].signed += 1;
          }
          else{
            stateData[p.st].firstR = stateData[p.st].firstR;
          stateData[p.st].first = stateData[p.st].first;
          stateData[p.st].picks += 1;
          stateData[p.st].signed = stateData[p.st].signed;
          }
        }
      }
      else{
        
        if(p.round == 1){
           if(p.pick == 1){ 
            if(p.signed =="Signed"){
            stateData[p.st] = {"firstR" :1, "picks" :1, "first": 1, "signed": 1};
            }
            else{
              stateData[p.st] = {"firstR" :1, "picks" :1, "first": 1, "signed": 0};
            }
           }
           else{
            if(p.signed =="Signed"){
            stateData[p.st] = {"firstR" :1, "picks" :1, "first": 0, "signed": 1};
            }
            else{
              stateData[p.st] = {"firstR" :1, "picks" :1, "first": 0, "signed": 0};
            }
           }
        }
        else{
          if(p.signed=="Signed"){
            stateData[p.st] = {"firstR" :0, "picks" :1, "first": 0, "signed": 1};
          }
          else{
            stateData[p.st] = {"firstR" :0, "picks" :1, "first": 1, "signed": 0};
          }
          
        }
      }
    }
    
  });
 
  pieChart(stateData);
  changeStates(stateData);
  });
};

function createTeamData(team){

  stateData = [];
  d3.json("/all-data", function (data) {
 
  // console.log(data);
  data.forEach(p => {
    if(team == "all"){
      if(p.st in stateData){
        
        if(p.round == 1){
           if(p.pick == 1){
             if(p.signed == "Signed"){
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first += 1;
            stateData[p.st].signed += 1;
          }
          else{
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first += 1;
            stateData[p.st].signed = stateData[p.st].signed;
          }
           }
           else{
             if (p.signed == "Signed"){
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first = stateData[p.st].first;
            stateData[p.st].signed += 1;
             }
             else {
              stateData[p.st].firstR +=1;
              stateData[p.st].picks += 1;
              stateData[p.st].first = stateData[p.st].first;
              stateData[p.st].signed = stateData[p.st].signed;
            }
           }
        }
        else{
          if(p.signed =="Signed"){
          stateData[p.st].firstR = stateData[p.st].firstR;
          stateData[p.st].first = stateData[p.st].first;
          stateData[p.st].picks += 1;
          stateData[p.st].signed += 1;
          }
          else{
            stateData[p.st].firstR = stateData[p.st].firstR;
          stateData[p.st].first = stateData[p.st].first;
          stateData[p.st].picks += 1;
          stateData[p.st].signed = stateData[p.st].signed;
          }
        }
      }
      else{
        
        if(p.round == 1){
           if(p.pick == 1){ 
            if(p.signed =="Signed"){
            stateData[p.st] = {"firstR" :1, "picks" :1, "first": 1, "signed": 1};
            }
            else{
              stateData[p.st] = {"firstR" :1, "picks" :1, "first": 1, "signed": 0};
            }
           }
           else{
            if(p.signed =="Signed"){
            stateData[p.st] = {"firstR" :1, "picks" :1, "first": 0, "signed": 1};
            }
            else{
              stateData[p.st] = {"firstR" :1, "picks" :1, "first": 0, "signed": 0};
            }
           }
        }
        else{
          if(p.signed=="Signed"){
            stateData[p.st] = {"firstR" :0, "picks" :1, "first": 0, "signed": 1};
          }
          else{
            stateData[p.st] = {"firstR" :0, "picks" :1, "first": 1, "signed": 0};
          }
          
        }
      }
    }
    else if(team == p.team){
      if(p.st in stateData){
        
        if(p.round == 1){
           if(p.pick == 1){
             if(p.signed == "Signed"){
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first += 1;
            stateData[p.st].signed += 1;
          }
          else{
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first += 1;
            stateData[p.st].signed = stateData[p.st].signed;
          }
           }
           else{
             if (p.signed == "Signed"){
            stateData[p.st].firstR +=1;
            stateData[p.st].picks += 1;
            stateData[p.st].first = stateData[p.st].first;
            stateData[p.st].signed += 1;
             }
             else {
              stateData[p.st].firstR +=1;
              stateData[p.st].picks += 1;
              stateData[p.st].first = stateData[p.st].first;
              stateData[p.st].signed = stateData[p.st].signed;
            }
           }
        }
        else{
          if(p.signed =="Signed"){
          stateData[p.st].firstR = stateData[p.st].firstR;
          stateData[p.st].first = stateData[p.st].first;
          stateData[p.st].picks += 1;
          stateData[p.st].signed += 1;
          }
          else{
            stateData[p.st].firstR = stateData[p.st].firstR;
          stateData[p.st].first = stateData[p.st].first;
          stateData[p.st].picks += 1;
          stateData[p.st].signed = stateData[p.st].signed;
          }
        }
      }
      else{
        
        if(p.round == 1){
           if(p.pick == 1){ 
            if(p.signed =="Signed"){
            stateData[p.st] = {"firstR" :1, "picks" :1, "first": 1, "signed": 1};
            }
            else{
              stateData[p.st] = {"firstR" :1, "picks" :1, "first": 1, "signed": 0};
            }
           }
           else{
            if(p.signed =="Signed"){
            stateData[p.st] = {"firstR" :1, "picks" :1, "first": 0, "signed": 1};
            }
            else{
              stateData[p.st] = {"firstR" :1, "picks" :1, "first": 0, "signed": 0};
            }
           }
        }
        else{
          if(p.signed=="Signed"){
            stateData[p.st] = {"firstR" :0, "picks" :1, "first": 0, "signed": 1};
          }
          else{
            stateData[p.st] = {"firstR" :0, "picks" :1, "first": 1, "signed": 0};
          }
          
        }
      }
    }
  });
  pieChart(stateData);
  changeStates(stateData);
  });

};
function changeStates(p){
  baseballData = [];
  d3.json("/states", function (d){
    d.forEach(d => {
      for (let [key, value] of Object.entries(p)) {
        if (d.abbr == key){
         baseballData[d.state] = value
         break;
        }
        else if (d.addr != key){
          baseballData[d.state] = {"firstR" :0, "picks" :0, "first": 0};
        }
      }
    })
  });
 
  
  createGeoData(baseballData);
};


function pieChart(p){
  signed = 0;
  total = 0;
  Object.entries(p).forEach(([key, value])=>{
    signed += value.signed;
    total += value.picks;
  });
 
  unsigned = total - signed;
  data = {
    datasets:
    [{
      data: [signed, unsigned],
      backgroundColor:[
        "green",
        "red"
      ]
    }],
    labels:[
      "Signed",
      "Un-Signed"
    ]
  }
  var ctx = document.getElementById('pieChart');
  var myPieChart = new Chart(ctx, {
    type: "pie",
    data: data,
    options:{
      rotation: .5,
      animation:{
        animateScale: true
      },
    }
  })

}