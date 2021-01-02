<script type="text/javascript" src="static/js/config.js"></script>
var myMap = L.map("mapid", {
    center: [39.669045, -98.743677],
    zoom: 6
  });


  //add tile layer

  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>just in time!</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


var earth = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function markerSize(mags){
    return mags/10000;
}
function chooseColor(mag){
    if (mag>5){
        return "red"
    } else if (mag > 4){
        return "green"
    }else if (mag > 3){
        return "yellow"
    } else if (mag > 2){
        return "orange"
    } else if (mag> 1){
        return "purple"
    }else{
        return "pink"
    }
;
}


d3.json(earth, function(data){
    for (var i =0; i <data.features.length; i++){
        var places = data.features[i];

        if (places && places.properties && places.properties.mag){
            L.circle([places.geometry.coordinates[1],places.geometry.coordinates[0]],{
                radius:(places.properties.mag*10000),
                color: "blue",
                weight: 1,
                fillColor: chooseColor(places.properties.mag),

            }).bindPopup("<h3>Location: " + places.properties.place +"</h3> <hr> <h3>Mag: "+ places.properties.mag+"</h3> <hr> <h3> Time: "+places.properties.time+"</h3>").addTo(myMap);
        }
    }
    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0,1,2,3,4,5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap)
})

