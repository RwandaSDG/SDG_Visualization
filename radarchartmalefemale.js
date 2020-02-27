
var allAxis;
var radar_data_3
 function radarChartDrawMF(sdg_data, district_input) {
                 

     
			////////////////////////////////////////////////////////////// 
			//////////////////////// Set-Up ////////////////////////////// 
			////////////////////////////////////////////////////////////// 
     
     var margin = {top: 50, right: 50, bottom: 50, left: 90},
				width = Math.min(700, window.innerWidth ) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom );
             
     var   subset_radar_2 = sdg_data.filter(function(el) {
                return el.District === district_input && (el.Demographic === "MALE" || el.Demographic === "FEMALE")});
     
     var   EICV_YEAR = d3.max(subset_radar_2.filter(function(el) { return el.Data === "EICV"}), function(d) {return d.Year;});
     
     var   DHS_YEAR = d3.max(subset_radar_2.filter(function(el) { return el.Data === "DHS"}), function(d) {return d.Year;});
     
     
     var    subset_radar_male = subset_radar_2.filter(function(el) {
                return (el.Year  === EICV_YEAR || el.Year === DHS_YEAR) && el.Demographic === "MALE"  ;});
     
    var    subset_radar_female = subset_radar_2.filter(function(el) {
                return (el.Year  === EICV_YEAR || el.Year === DHS_YEAR) && el.Demographic === "FEMALE"  ;});
            
            ////////////////////////////////////////////////////////////// 
			//////////////////// Draw the Chart ////////////////////////// 
			////////////////////////////////////////////////////////////// 

		
            
          //  maxAlternate = d3.max(subset_radar, function(d) {return d.SDGAchievement});
            
      radar_data_3 = [
          subset_radar_male,
          subset_radar_female
      ];
     
     var color = d3.scaleOrdinal()
				.range(["#0bd5ff","#ffc0cb"])
     
			var radarChartOptions = {
			  w: 500,
			  h: 500,
			  margin: margin,
			  maxValue: 100,
              alternateVal: 100,
			  levels: 10,
			  roundStrokes: false,
			  color: color
			};
            
			//Call function to draw the Radar chart
			RadarChart3(".radarchartMF", radar_data_3, radarChartOptions); 
     

 };


        
function RadarChart3(id, data, options) {
	var cfg = {
	 w: 200,				//Width of the circle
	 h: 200,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 1,				//How many levels or inner circles should there be drawn
	 maxValue: 100, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.15, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 90, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.7, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.05, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: "#0000FF"	//Color function
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
   var maxValue = Math.ceil((cfg.alternateVal)/10)*10 ;
		
	 allAxis = (data[1].map(function(i, j){return i.Label}));	//Names of each axis
	var	total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
        Format = d3.format('#'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
     .attr("preserveAspectRatio", "xMinYMin meet")
     .attr("viewBox", "0 0" + cfg.w + cfg.margin.left + cfg.margin.right + " " + cfg.h + cfg.margin.top + cfg.margin.bottom )
//    .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
//			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
	    feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
	    feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper3");
	
	//Draw the background circles
	axisGrid.selectAll(".levels3")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle3")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel3")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel3")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis3")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis3");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line3")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend3")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth)
    .on("mouseover", mouseovertext)
    .on("mouseleave", mouseofftext) ;
    
    
    function mouseovertext() {
        d3.select(this).style("font-size", "26px")
    }
    
        function mouseofftext() {
        d3.select(this).style("font-size", "11px")
    }

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
var radarLine = d3.radialLine()
		.curve(d3.curveLinearClosed)
		.radius(d => rScale(d.SDGAchievement))
		.angle((d,i) => i * angleSlice);
		
if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed)
	}	
    
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper3")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper3");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea3")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea3")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea3")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke3")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i);})
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle3")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle3")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.SDGAchievement) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.SDGAchievement) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "#000" )
		.style("fill-opacity", 0.01);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper3")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper3");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle3")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle3")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.SDGAchievement) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.SDGAchievement) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(d.SDGAchievement))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});
		
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip2")
		.style("opacity", 0)
        .style("font-size", "26px");
	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
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
	
}//RadarChart
    
    