
var SDG_Data;
var SDG = "poor";
var District = "RWANDA"

var Demographics = ["TOTAL", "MALE", "FEMALE", "NON-POOR", "POOR", "SEVERELY-POOR", "RURAL", "URBAN", "POOREST", "POORER", "MIDDLE", "RICHER", "RICHEST"]
var myColor = d3.scaleOrdinal().domain(Demographics)
  .range(["maroon", "blue", "blue", "grey", "grey", "grey", "green", "green", "grey", "grey", "grey", "grey", "grey"])

// Dimensions
var margin = {top: 40, right: 150, bottom: 50, left: 50},
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    

// This is reading in the data and setting up the global function to trigger the visualization

 
// Setting Global Variables that I woudl like to be able to access

var graph_dataset;
var subset = [];
    
function DrawLineGraphRwanda(input_data, input_sdg, input_district) {
District = input_district ;
SDG = input_sdg;
    
subset = input_data.filter(function(el) {
    return el.District === input_district && el.SDG === input_sdg;});
 
 var    minyear =   d3.min(subset, function(d) {return d.Year;});
 var    maxyear =   d3.max(subset, function(d) {return d.Year;});
 var    ticknumber = +maxyear - +minyear ;
    
 var maxestimate = d3.max(subset, function(d) {return d.Estimate;});
 var minestimate = d3.min(subset, function(d) {return d.Estimate - 5;});

    
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
    
d3.selectAll(".RwandaChart").remove() 
    
var AxesRwanda = d3.selectAll("#RwandaChart")
    .append("svg")
    .attr('class', 'RwandaChart')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
//    .attr("x", 0)
//    .attr("y", 0)
 //   .attr("transform", "translate(" + margin.left + "," - margin.top + ")")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
// 3. Call the x axis in a group tag
AxesRwanda
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
AxesRwanda.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(yScale))
        .style( 'font-size', '1vw')

    
// ------- Add the actual lines
graph_dataset = d3.nest()
        .key(function(d) {return d.Demographic})
        .entries(subset).map(
            function(d){
                return {
                    category : d.key,
                    datapoints: d.values
                };
            });

var Lines_Rwanda = 
    AxesRwanda.selectAll(".AxesRwandaLines")
                    .data(graph_dataset)
        .enter().append("g").attr("id", function(d) {
      return d.category }).attr("class", "AxesRwandaLines");
       
    
Lines_Rwanda
   .append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return line(d.datapoints);
    })
    .style("stroke", function(d) {
      return myColor(d.category);
    })
    .style('opacity', .4)
    .style('stroke-width', 10)

    .attr("id", function(d) {
      return d.category })
    .on("mouseover", onmouseover)
    .on("mouseleave", onmouseleave)
    .on("click", onclickdemographic);   
    
AxesRwanda.selectAll("#DotsRwandaLines")
                    .data(subset) 
    .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("id", function(d) {
      return "dots" + d.Demographic })    
    .attr("cx", function(d) { return xScale(d.Year) })
    .attr("cy", function(d) { return yScale(d.Estimate) })
    .attr("fill", function(d) { return myColor(d.Demographic) })
    .attr("r", 7)
    .style('opacity', .4);
    
    
AxesRwanda.selectAll(".TextRwandaLines")
    .data(subset.filter(function(el) {
    return el.Year === maxyear;})) 
    .enter().append("text")
    .text(function(d) {
      return d.Demographic }
         )
    .attr("x", function(d) { return xScale(+d["Year"] + .2) })
    .attr("y", function(d) { return yScale(d["Estimate"])})
    .style('opacity', .1)
    .attr("id", function(d) {
      return  d.Demographic })
       .attr("class", function(d) {
      return "text" + d.Demographic })
        .on("mouseover", onmouseover)
    .on("mouseleave", onmouseleave)
    .on("click", onclickdemographic);
    
d3.selectAll("#TOTAL").style("opacity", 1);
d3.selectAll("#dotsTOTAL").style("opacity", 1);

d3.selectAll(".textTOTAL").style("opacity", .1);

};

    
function onmouseover(d,i) {
    
 var id =  d3.select(this).attr('id');
 var dotsid = "#dots" + id;
 var textid = '.text' + id;
    
 d3.selectAll("#" + id).style("opacity", 1);
 d3.selectAll(dotsid).style("opacity", 1);
 d3.selectAll(textid).style("opacity",1);
    
    console.log(id);
};
    
function onmouseleave(d,i) {
    
 var id =  d3.select(this).attr('id');
 var dotsid = "#dots" + id;
 var textid = '.text' + id;
    
 d3.selectAll("#" + id).style("opacity", .4);
 d3.selectAll(dotsid).style("opacity", .4);
 d3.selectAll(textid).style("opacity",.1);
 d3.selectAll("#TOTAL").style("opacity", 1);
d3.selectAll("#dotsTOTAL").style("opacity", 1);

d3.selectAll(".textTOTAL").style("opacity", .1);

    
};



    
    



