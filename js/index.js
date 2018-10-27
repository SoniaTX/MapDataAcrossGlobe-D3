var meteorsData = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";

var mapData = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

var meteorites = [];

var map = [];

var margin = {top: 20, right: 40, bottom: 20, left: 40};
  
var width = 1080 - margin.left - margin.right;
var height = 900 - margin.top - margin.bottom;
  
var svg = d3.select("body")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")           
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(mapData, function(data){

    map = data.features;
    
d3.json(meteorsData, function(data){
        
     meteorites = data.features;
     
var massMin = d3.min(meteorites, function(d){      
          return parseFloat(d.properties.mass);      
        })
        
var massMax = d3.max(meteorites, function(d){
          return parseFloat(d.properties.mass);         
        })
     
var projection = d3.geo.mercator()
                   .scale(180)
                   .translate([width/2, height/2]);

var path = d3.geo.path()
                 .projection(projection);
     
var radius = d3.scale.sqrt()
               .domain([massMin, massMax])
               .range([3,40]);
     
var colors = d3.scale.category10();
                       
 var tooltip = d3.select("body")
                 .append("div")
                 .attr("id", "tooltip")
                 .attr("opacity", 0); 
  
svg.selectAll("path")
            .data(map)
            .enter()
            .append("path")
            .attr("d", path);

 svg.selectAll(".circle")
           .data(meteorites.sort(function(a,b){ return b.properties.mass - a.properties.mass}))
           .enter()
           .append("circle")
           .attr("cx", function(d){  return projection ([d.properties.reclong, d.properties.reclat])[0];})
           .attr("cy", function(d){  return projection ([d.properties.reclong, d.properties.reclat])[1];})
           .attr("r", function(d){  return radius (d.properties.mass)})
           .attr("class", "meteorites")
           .attr("fill", function(d) {return colors (d.properties.mass)})
           .on("mouseover", function(d){
          d3.select(this).style('fill', 'steelblue');
          d3.select('#tooltip')
            .style("opacity", 0.8)
              tooltip.html(
         "<span><b>" +  "Name" + ": " + d.properties.name + "<br/>" + 
            "Mass: " + d.properties.mass + 
              "<br/>" + 
            "Year:  " + (new Date(d.properties.year)).getFullYear() + "</b></span>"
          )
            .style('left', (d3.event.pageX + 20) + 'px')
            .style('top', (d3.event.pageY - 80) + 'px')
           })
           .on("mouseout", function(d){
              d3.select('#tooltip')
               .style("opacity", 0);          
        }); 
   })  
})