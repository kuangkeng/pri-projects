function ready(error, us, inputdata) {
  if (error) throw error;

  // console.log(us, inputdata);   

  //Sets breaking point and colors
  //MODIFY: the value in ".domain" is the breaking point between 2 colors. The 2 colors are set inside ".range".
var breakpoint = d3.scale.threshold()
    .domain([0.5])
    .range(["#4188BC","#FF7F00"]);
  
  //MODIFY: For data in each column in the CSV file that you want to use to color the map or show in tooltip, you need to match them with the county id in the SAME CSV FILE (not the map file). In this case, "county_id" is the column head of county FIPS in the CSV file that is used to match with the county FIPS in the MAP file. We want to color the map based on "per_trump" and to show "state" and "county_name" in the tooltip. Hence we need to match each of them with "county_id" which is the key in the CSV file to match with the map file.
  
  //Pair data with county id
  var MatchData = {};
  inputdata.forEach(function(d) { MatchData[d.county_id] = +d.per_trump; });

  //Pair state name with county id
  var MatchState = {};
  inputdata.forEach(function(d) { MatchState[d.county_id] = d.state; });

  //Pair county name with county id
  var MatchCounty = {};
  inputdata.forEach(function(d) { MatchCounty[d.county_id] = d.county_name; });

  //Append states
  //MODIFY: This class name "counties" is determined by the name of the "objects" in your map file.
  map.append("g")
    .attr("class", "counties")
    .selectAll("path")
  //MODIFY: This class name "counties" is determined by the name of the "objects" in your map file.  
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .attr("d", path)
    //Color states
    .attr("fill", function(d) { return breakpoint(MatchData[d.id]); })
    //Tooltip when mouseover
    .on("mouseover", function(d) {
      if (MatchData[d.id] != null){
        var sel = d3.select(this);
          sel.moveToFront();
        d3.select(this).transition().duration(300).style("opacity", 0.6);
        div.transition().duration(300)
        .style("opacity", 0.85)
      //MODIFY: Set tooltip content in html when there's data 
        div.html(MatchCounty[d.id] + ", " + MatchState[d.id] + "<br>" + "Trump: " + (MatchData[d.id]) + "%")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY -30) + "px");
      } else
      {
        var sel = d3.select(this);
          sel.moveToFront();
        d3.select(this).transition().duration(300).style("opacity", 0.6);
        div.transition().duration(300)
        .style("opacity", 0.85)
      //MODIFY: Set tooltip content in html when there's no data
        div.html("Not a sanctuary city")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY -30) + "px");     
      }
    })
    .on("mouseout", function() {
      var sel = d3.select(this);
        sel.moveToBack();
      d3.select(this)
      .transition().duration(300)
      .style("opacity", 1);
      div.transition().duration(300)
      .style("opacity", 0);
    });
  
    //Draw the state border
    map.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }))
      .attr("class", "states")
      .attr("d", path);     

//RESPONSIVENESS
  d3.select(window).on('resize', resize);

  function resize() {

    var w = d3.select("#map-container").node().clientWidth;

    // adjust things when the window size changes
    width = w - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    var newProjection = d3.geo.albersUsa()
      .scale(width)
      .translate([width / 2, height / 2]);

    //Update path
    path = d3.geo.path()
      .projection(newProjection);    

    // resize the map container
    map
        .style('width', width + 'px')
        .style('height', height + 'px');

    // resize the map
    map.selectAll("path").attr('d', path);
  }

resize();

}