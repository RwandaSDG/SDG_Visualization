var SDG = "poor";
var Demographic = "TOTAL";
var mapsvg;
    
function drawBaseMap(districtshapes) {
    
 mapsvg = d3.select(".thirdbox")
     .append("svg")
     .attr("preserveAspectRatio", "xMinYMin meet")
     .attr("viewBox", "0 0 820 820")
    .attr('id', 'map')

var district_shapes;
     
       mapsvg.append("g")
             .attr("preserveAspectRatio", "xMinYMin meet")
            .selectAll("path")
             .data(districtshapes)
             .enter()
             .append("path")
        .attr("d", function (d) {return d.Path} )
        .style("color", "black")
     .style("fill", "grey")
        .attr("id", function(d) { return d.District })
        .attr("class", "mappiece")
         .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .on("click", onmapclick);
        };
    

var subset_map = [];
var colorScale;
var colors1;
var colors2;


function colorizeMap(sdg_input, input_data ){

  var  subset_map_1 = input_data.filter(function(el) {
        return el.District != "RWANDA" && el.SDG === sdg_input && el.Demographic === "TOTAL";});
     
  var  year_input = d3.max(subset_map_1, function(d) {return d.Year;});

subset_map = subset_map_1.filter(function(el) {
        return el.Year  === year_input;});
     
 var    subset_map_color = d3.max(subset_map, function(d) {return d.Direction;});
     
    
     colorMax = d3.max(subset_map, function(d) {return d.Estimate;});
     colorMin = d3.min(subset_map, function(d) {return d.Estimate;});
     colorMid = (colorMax - colorMin)*.5 + colorMin;
     colorQuarterThree = (colorMax - colorMin)*.75 + colorMin;
     colorQuarter = (colorMax - colorMin) *.25 + colorMin;

   var colorScale1 = d3.scaleLinear()
        .domain([colorMin, colorQuarter, colorMid,  colorQuarterThree, colorMax]) 
        .range([ "rgb(42,166,137)", "rgb(253,213,61)",  "rgb(226,148,33)", "rgb(238,94,50)", "rgb(218,75,49)"]);
      
   var colorScale2 = d3.scaleLinear()
        .domain([colorMin, colorQuarter, colorMid,  colorQuarterThree, colorMax]) 
        .range([ "rgb(218,75,49)", "rgb(238,94,50)", "rgb(226,148,33)", "rgb(253,213,61)", "rgb(42,166,137)"     ]);
     
  function  colorScale(input, estimate){ if (input >1 ) {  
        return colorScale2(estimate);
            } else {
        return colorScale1(estimate);
                } 
  };
    
  
    
    
    
    
    colors1 = [
       {offset: "0%", color: "rgb(42,166,137)"},
       {offset: "25%", color: "rgb(253,213,61)"},
       {offset: "50%", color: "rgb(226,148,33)"},
       {offset: "75%", color: "rgb(238,94,50)"},
       {offset: "100%", color: "rgb(218,75,49)"}
    ];
    
     colors2 =  [
       {offset: "0%", color: "rgb(218,75,49)" },
       {offset: "25%", color: "rgb(238,94,50)" },
       {offset: "50%", color: "rgb(226,148,33)"},
       {offset: "75%", color:  "rgb(42,166,137)" },
       {offset: "100%", color:  "rgb(42,166,137)"}
    ];
    
    
    function colors(input) {if 
        (input > 1) {
        return colors2;     
    } else {
        return colors1; 
    };  
    };

   var color_scheme = colors(subset_map_color)
     
        
     subset_map.forEach(function(d) {
                
         var district = d.District;
    
         d3.selectAll("#" + district).transition().duration(1000)
                        .style("fill", colorScale(d.Direction, d.Estimate));             
                               });
    
d3.selectAll("#legend").remove();
    
var svgLegend = mapsvg.append('g').attr("id","legend").attr("transform", "translate(" + 400 + ","+ 690 + ")");
var defs = svgLegend.append('defs');
var linearGradient = defs.append('linearGradient')
		.attr('id', 'linear-gradient');

// horizontal gradient
linearGradient
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");
    
// append multiple color stops by using D3's data/enter step
linearGradient.selectAll("stop")
  .data(color_scheme)
  .enter().append("stop")
  .attr("offset", function(d) { 
    return d.offset; 
  })
  .attr("stop-color", function(d) { 
    return d.color; 
  });
    
    
    // append title
svgLegend.append("text")
  .attr("class", "legendTitle")
  .attr("x", 10)
  .attr("y", 20)
  .style("text-anchor", "left")
    .style("font-size", "16px")
  .text("Proportion of District Currently Achieving Indicator" );
    
    
    // draw the rectangle and fill with gradient
svgLegend.append("rect").attr("id", "heatlegend")
  .attr("x", 10)
  .attr("y", 30)
  .attr("width", 400)
  .attr("height", 15)
  .style("fill", "url(#linear-gradient)");
    
    
    //create tick marks
var xLeg = d3.scaleLinear()
    .domain([colorMin, colorQuarter, colorMid,  colorQuarterThree, colorMax]) 
    .range([0, 100, 200, 300, 400]);
    
    
    var axisLeg = d3.axisBottom(xLeg)
  .tickValues(xLeg.domain());
    
    
    svgLegend
  .attr("class", "axis")
  .append("g").attr("id","heat")
  .attr("transform", "translate(10, 50)")
  .call(axisLeg);
       };
    
var return_estimate = []; 

function mouseover(d, i){
   d3.select(this)
      .style("opacity", .5);
    
  console.log(d.District);
   console.log(return_estimate.Estimate);


  var  Selected_District = d.District;
    
    
return_estimate = subset_map.filter(function(el) {
        return el.District == Selected_District });
    
d3.select("#districtname").text(Selected_District);
    d3.select("#valuename").text(":  " + return_estimate[0]["Estimate"] + "%"
 );  
    
            
  d3.select("#tooltip")
                .style("top", d3.event.pageY - 20 + "px")
                .style("left", d3.event.pageX + 20 + "px")
                .style("visibility","visible");
    
  };


function mouseleave(d) {
    d3.select(this).style("opacity", 1);
  d3.select("#tooltip")
                .style("visibility","hidden");
  }; 
    
    
    