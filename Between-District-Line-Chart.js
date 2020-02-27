
var SDG_Data;
var SDG = "poor";
var District = "RWANDA"
var Demographic = "TOTAL";

//var Demographics = ["TOTAL", "MALE", "FEMALE", "NON-POOR", "POOR", "SEVERELY POOR", "RURAL", "URBAN", "POOREST", "POORER", "MIDDLE", "RICHER", "RICHEST"]
// var myColor = d3.scaleOrdinal().domain(Demographics)
//  .range(["maroon", "blue", "blue", "grey", "grey", "grey", "green", "green", "grey", "grey", "grey", "grey", "grey"])

// Dimensions
var margin2 = {top: 70, right: 150, bottom: 50, left: 50},
    width = 700 - margin2.left - margin2.right,
    height = 600 - margin2.top - margin2.bottom;
    

// This is reading in the data and setting up the global function to trigger the visualization

 
// Setting Global Variables that I woudl like to be able to access

var district_graph_dataset;
var districts_subset = [];
    
function DrawLineGraphDistricts(input_data, input_sdg, input_demographic) {
Demographic = input_demographic;
SDG = input_sdg;
    
districts_subset = input_data.filter(function(el) {
    return el.Demographic === input_demographic && el.SDG === input_sdg;});
 
 var    minyear =   d3.min(districts_subset, function(d) {return d.Year;});
 var    maxyear =   d3.max(districts_subset, function(d) {return d.Year;});
 var    ticknumber = +maxyear - +minyear ;
    
 var maxestimate = d3.max(districts_subset, function(d) {return d.Estimate;});
 var minestimate = d3.min(districts_subset, function(d) {return d.Estimate - 5;});

    
 var line = d3.line()
    .x(function(d) { return xScale(d.Year); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.Estimate); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX)  

   var xScale = d3.scaleLinear()
        .domain([+minyear-.1, maxyear]) // input
        .range([0, width]); 
    
   var yScale = d3.scaleLinear()
                .domain([maxestimate + .05, minestimate - .05]) // input 
                .range([0, height]); 
    
d3.selectAll(".DistrictChart").remove() 
    
var AxesDistricts = d3.selectAll("#DistrictChart")
    .append("svg")
    .attr('class', 'DistrictChart')
    .attr("width", width + margin2.left + margin2.right)
    .attr("height", height + margin2.top + margin2.bottom)
//    .attr("x", 0)
//    .attr("y", 0)
 //   .attr("transform", "translate(" + margin.left + "," - margin.top + ")")
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    
// 3. Call the x axis in a group tag
AxesDistricts
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(
    d3.axisBottom(xScale).ticks(ticknumber).tickFormat(d3.format("d"))
)     
    .selectAll('text')
        .attr('font-weight', 'large')
    .style( 'font-size', '1vw')
        .style("text-anchor", "start")
        .attr("dx", ".8em")
        .attr("dy", ".5em")
        .attr("transform", function (d) {
            return "rotate(65)";
        });
    // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
AxesDistricts.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(yScale))
        .style( 'font-size', '1vw')

    
// ------- Add the actual lines
districts_graph_dataset = d3.nest()
        .key(function(d) {return d.District})
        .entries(districts_subset).map(
            function(d){
                return {
                    category : d.key,
                    datapoints: d.values
                };
            });

var Lines_Districts = 
    AxesDistricts.selectAll("#AxesDistrictsLines")
                    .data(districts_graph_dataset)
        .enter().append("g").attr("class", function(d) {
      return d.category }).attr("id", "AxesDistrictsLines");
       
    
Lines_Districts
   .append("path")
    .attr("id", "line")
    .attr("d", function(d) {
      return line(d.datapoints);
    })
//    .style("stroke", function(d) {
//      return myColor(d.category);
//    })
    .style('opacity', .1)
    .style('stroke-width', 10)

    .attr("class", function(d) {
      return d.category })
    .on("mouseover", onmouseover2)
    .on("mouseleave", onmouseleave2);   
    
AxesDistricts.selectAll("#DotsDistrictsLines")
                    .data(districts_subset) 
    .enter().append("circle") // Uses the enter().append() method
    .attr("id", "DotsDistrictsLines") // Assign a class for styling
    .attr("class", function(d) {
      return "dots" + d.District })    
    .attr("cx", function(d) { return xScale(d.Year) })
    .attr("cy", function(d) { return yScale(d.Estimate) })
   // .attr("fill", function(d) { return myColor(d.Demographic) })
    .attr("r", 7)
    .style('opacity', .2);
    
    
AxesDistricts.selectAll("#TextDistrictsLines")
    .data(districts_subset.filter(function(el) {
    return el.Year === maxyear;})) 
    .enter().append("text")
    .text(function(d) {
      return d.District }
         )
    .attr("x", function(d) { return xScale(+d["Year"] + .2) })
    .attr("y", function(d) { return yScale(d["Estimate"])})
    .style('opacity', .1)
    .attr("id", function(d) {
    if 
        (d.District === "RWANDA") {
        return d.District;     
    } else {
        return "TextDistrictsLines"; 

    } })
       .attr("class", function(d) {
      return  d.District })
        .on("mouseover", onmouseover2)
    .on("mouseleave", onmouseleave2);
    
d3.selectAll(".RWANDA").style("opacity", 1).style("stroke", "maroon" );
d3.selectAll(".dotsRWANDa").style("opacity", 1);

d3.selectAll("#textRWANDA").style("opacity", 1);

};

    
function onmouseover2(d,i) {
    
 var clas =  d3.select(this).attr('class');
 var dotsclas = ".dots" + clas;
 var textclas = '#text' + clas;
    
 d3.selectAll("." + clas).style("opacity", 1);
 d3.selectAll(dotsclas).style("opacity", 1);
 //d3.selectAll(textclas).style("opacity",1);
    
    console.log(clas);
};
    
function onmouseleave2(d,i) {
    
 var clas =  d3.select(this).attr('class');
 var dotsclas = ".dots" + clas;
 var textclas = '#text' + clas;
    
 d3.selectAll("." + clas).style("opacity", .1);
 d3.selectAll(dotsclas).style("opacity", .2);
 d3.selectAll(textclas).style("opacity",.1);
 d3.selectAll(".RWANDA").style("opacity", 1);
d3.selectAll(".dotsRWANDA").style("opacity", 1);

d3.selectAll("#textRWANDA").style("opacity", 1);

    
};



    
    



