var sdg_label = "Poverty";

var sdg_labels_look;

var this_sdg_labels_data = [];


function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	


function wrap2(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.2, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}


function drawDropdown(sdg_labels_data, disticts_labels_data) {

sdg_labels_look = sdg_labels_data;
    
var resetDemographic = "TOTAL"
var dropdowntext = d3.select(".dropdownbox")
 .append("text")
.attr("id", "SDGSelectorLabel")
 .text("Choose an SDG Metric:")
    
    
var dropdown = d3.select(".dropdownbox")
.append("g")
.append("select")
.attr("class", "sdgselector")
.on("change", function(){
    DrawLineGraphRwanda(SDG_Data, this.value, District);
    DrawLineGraphDistricts(SDG_Data, this.value, resetDemographic);
    colorizeMap(this.value, SDG_Data );
    d3.selectAll("#BetweenDistrictLabel").text("Comparison Between Districts");
    
    this_sdg_labels_data = sdg_labels_look.filter(function(el) {
        return el.SDG === SDG;             
    });
    
sdg_label = this_sdg_labels_data[[0]]["Label"];

     d3.select("#DistrictLabel")
            .text(sdg_label + " in " + District )
            //  .text("SDG Attainment in " + d.District )
                		.attr("dy", "0.05em")

    		  .call(wrap, 60);
    
    
});
 

dropdown.selectAll("option")
                    .data(sdg_labels_data)
                  .enter().append("option")
                    .attr("value", function (d) { return d.SDG; })
                  .text(function (d) {
                        return d.Label; // capitalize 1st letter
                    });
    

    
 // <-------------- Adding the Legends for the Radar Chart ------------------>
  var color_legend = d3.scaleOrdinal()
                .domain(["Rwanda", "District", "Urban", "Rural", "Male", "Female"])
				.range(["#03ee00","#0000FF", "#EDC951","#CC333F", "#0bd5ff","#ffc0cb" ])   
    
  
 var  legendRectSize = 6;
 var legendSpacing = 2;
     
   var legend = d3.select('#radarchartlabels')
    .append("g")
    .selectAll("g")
    .data(color_legend.domain())
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize;
        var x = 65;
        var y = i * (height) + 51;
        return 'translate(' + x + ',' + y  + ')';
    }); 
    
    
    legend.append('rect')
    .attr('width', 5)
    .attr('height', 5)
    .style('fill', color_legend)
    .style('stroke', color_legend)
    .style("opacity", .8);

legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; })
    .attr("id", "legendtext");
    
    
    
var radarcharttitles =  d3.select('#radarchartlabels')
        .append("text")
        .attr("id", "radarchartitles")
        .attr("x", 4) 
        .attr("y", 4)   
        .attr("dy", 0)
        .text("Percent Achievement of SDGs in Rwanda")
	   .call(wrap2, 90)
        
var radarchartdetails =  d3.select('#radarchartlabels')
        .append("text")
        .attr("id", "radarchartexplanations")
        .attr("x", 4) 
        .attr("y", 27)   
        .attr("dy", 0)
        .text("Each radar chart shows the percent acheivement of specific demographics across all SDGs. Closer to the edge of the circle means greater achievement")
	   .call(wrap2, 80)
    

var radarchartdetailsmore =  d3.select('#radarchartlabels')
        .append("text")
        .attr("id", "radarchartexplanations")
        .attr("x", 4) 
        .attr("y", 50)   
        .attr("dy", 0)
        .text("Hover over the labels to view larger text. Hover over points to view exact numbers. Click on the map to change districts.")
	   .call(wrap2, 50)


var aboutdatatitles =  d3.select('#aboutdata')
        .append("text")
        .attr("id", "aboutdatatitles")
        .attr("x", 4) 
        .attr("y", 4)   
        .attr("dy", 0)
        .text("About the Data")
	   .call(wrap2, 90)

var aboutdatadetails =  d3.select('#aboutdata')
        .append("text")
        .attr("id", "radarchartexplanations")
        .attr("x", 4) 
        .attr("y", 16)   
        .attr("dy", 0)
        .text("The data for this project comes from the Rwanda DHS and Integrated Household Living Conditions Surveys. Information about the data can be found through the Rwanda National Institute of Statistics (NISR). Details regarding estimation methodology can be found on Github here. Users are advised that some disaggregated estimates have high variance due to weighting procedures and will be updated. Please check Standard Deviations listed in github dataset before citing estimates more granular than the district level")
	   .call(wrap2, 80)




    
    
    
    
    
//var dropdown2 = d3.select(".dropdownbox2")
//.append("g")
//.append("select")
//.attr("class", "districtselector")
//.attr('id', 'selectButton')
//.on("change", function(){
//    DrawLineGraphDistricts(SDG_Data, SDG, this.value)
    
//});
 

 //var DemographicsArray  = "TOTAL", "MALE", "FEMALE", "NON-POOR", "POOR", "SEVERELY POOR", "RURAL", "URBAN", "POOREST", "POORER", "MIDDLE", "RICHER", "RICHEST"]
   
    
//dropdown2.selectAll("option")
//                   .data(DemographicsArray)
//                  .enter()
//                    .append("option")
//                   .attr("value", function (d) { return d; })
//                    .attr("class", "demographicselector")
//                    .text(function (d) {
//                       return d; // capitalize 1st letter
//                   });


};


function dimpaths(){
          d3.selectAll('.mappiece').style("stroke", "white").style("stroke-width", 0);          
    }


function onmapclick(d,i) {
dimpaths();

    d3.select(this).style("stroke","#7DF9FF").style("stroke-width", 3);

    
   var district_selector  = "." + d.District
    
   
  d3.select("#DistrictLabel")
            .text(sdg_label + " in " + d.District )
            //  .text("SDG Attainment in " + d.District )
                		.attr("dy", "0.01em")

    		  .call(wrap, 60);
    
  d3.selectAll("#line").style("opacity", .1);
  d3.selectAll("#TextDistrictsLines").style("opacity", .1);

  d3.selectAll(".RWANDA").style("opacity", 1).style("stroke", "maroon" );
  d3.selectAll(".dotsRWANDa").style("opacity", 1);

  d3.selectAll("#textRWANDA").style("opacity", 1);
  d3.selectAll(district_selector).style("opacity", 1);
    
  d3.selectAll("#radarchartitles").text("Percent Achievement of SDGs in " + d.District) .call(wrap2, 97)


    
    
DrawLineGraphRwanda(SDG_Data, SDG, d.District);

radarChartDrawTotal(SDG_Data, d.District)
radarChartDrawUR(SDG_Data, d.District)
radarChartDrawMF(SDG_Data, d.District)



};

// <------------------ adding the filtering though the line chart ---------------------->
function onclickdemographic(d,i) {
    
 var id =  d3.select(this).attr('id');
    
    console.log(id)
    
    DrawLineGraphDistricts(SDG_Data, SDG, id)
    
    d3.selectAll("#BetweenDistrictLabel")
            .text(sdg_label + " Among " + id )
            //  .text("SDG Attainment in " + d.District )
                		.attr("dy", "0.01em")

    		  .call(wrap, 60);
    
    
    
    
}

function reset(){
    
        DrawLineGraphDistricts(SDG_Data, SDG, "TOTAL");
        radarChartDrawTotal(SDG_Data, "RWANDA")
        radarChartDrawUR(SDG_Data, "RWANDA")
        radarChartDrawMF(SDG_Data, "RWANDA")
        DrawLineGraphRwanda(SDG_Data, SDG, "RWANDA");

    
      d3.selectAll("#radarchartitles").text("Percent Achievement of SDGs in Rwanda") .call(wrap2, 97)
        d3.selectAll("#BetweenDistrictLabel")
            .text("Comparison Between Districts" )
            //  .text("SDG Attainment in " + d.District )
                		.attr("dy", "0.05em")
    d3.select("#DistrictLabel")
            .text(sdg_label + " in Rwanda" )
            //  .text("SDG Attainment in " + d.District )
                		.attr("dy", "0.05em")

    dimpaths();
    
    
};