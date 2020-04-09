// Store our API endpoint inside queryUrl
var queryUrl =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log('data.features:', data.features)
});

function createFeatures(earthquakeData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place, time and mag of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            '<h3>' +
            feature.properties.place +
            '</h3><hr><p>' +
            new Date(feature.properties.time) +
            '</p><hr><p>' + feature.properties.mag + 'mag </p>'
        );
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
    });
    console.log('earthquakes:', earthquakes);

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}


function createMap(earthquakes) {


    var greymap =
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
            {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.light',
                accessToken: API_KEY,
            })


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        'Map': greymap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
    };

    // Create our map, giving it the greymap and earthquakes layers to display on load
    var myMap = L.map('map', {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [greymap, earthquakes],
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control
        .layers(baseMaps, overlayMaps, {
            collapsed: false,
        })
        .addTo(myMap);
}



