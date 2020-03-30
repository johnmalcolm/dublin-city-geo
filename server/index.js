const topojson =require("topojson-server");
var geojsonMerge = require('@mapbox/geojson-merge');
const path = require('path');
const fs = require('fs');

// File path and array for storing council GeoJSON
const directoryPath = path.join(__dirname, 'output');
let councilArray = [];

// Read all GeoJSON files in /output
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    // Remove .DS_Store from arrary
    if(files[0] == '.DS_Store'){
        files.splice(0,1);
    }

    // Push GeoJSON for each council to councilArray
    files.forEach(function (file) {
        let geoJson = fs.readFileSync(path.join(directoryPath + '/' + file));
        let council = JSON.parse(geoJson);

        // Add COUNCIL as property of each feature
        council.features.forEach(function(feature){
            feature.properties.LEA = file.substring(0, file.length - 5); 
            console.log(feature);
        })
        councilArray.push(council);
    });
    
    var dublinCity = geojsonMerge.merge(councilArray);

    fs.writeFile("dublin-city-lea.json", JSON.stringify(dublinCity), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
     
        console.log("JSON file has been saved.");
    });

});

