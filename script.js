document.addEventListener("DOMContentLoaded", function(e) {
    console.log("Council Mapper");

    d3.json("server/output/artane-whitehall.json", function(error, electoral) {
        if (error) return console.error("Error: " + error)
        
        // Passed error handling
        console.log("In d3.json()");

        // GeoJson Object (See bash script & https://libguides.ucd.ie/gisguide/FindSpatialData)
        console.log(electoral);
        
        // Define Dimensions of Dublin City Council SVG
        var width = 850,
        height = 700;

        var topology = topojson.topology({electoral});
        console.log(topology);
        
        var topoMerged = topojson.merge(topology, topology.objects.electoral.geometries);

        // Create SVG variable & append to DOM
        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);
        
        // SAVE projection from tutorial
        var projection = d3.geoAlbers()
            .center([0, 53.349])
            .rotate([6.257, 0])
            .parallels([50, 60])
            .scale(280000)
            .translate([width / 2, height / 2]);
        
        var path = d3.geoPath()
            .projection(projection);

        svg.selectAll("path")
            .data(electoral.features)
            .enter().append("path")
              .attr("class", function(d) { return "electoral-area "
                    + d.properties.COUNCIL + 
                    " " + d.properties.EDNAME.replace(/\W+/g, '-').toLowerCase() })
              .attr("d", path);

        svg.append("path")
            .datum(topoMerged)
            .attr("class", "state selected")
            .attr("d", path);

    });
});

