let earthquake_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(earthquake_URL).then(earthquake_data => {
    process_earthquake_data(earthquake_data.features);
});


function process_earthquake_data(earthquake_features) {

    function individual_earthquake_feature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    function chooseRadius(magnitude) {
        return magnitude * 4;
    }

    function chooseColor(depth) {
        return depth > 90 ? 'FireBrick' :
               depth > 70 ? 'OrangeRed' :
               depth > 50 ? 'Orange' :
               depth > 30 ? 'Gold' :
               depth > 10 ? 'Yellow' :
                            'LightGreen';
    }

    let earthquake_layer = L.geoJSON(earthquake_features, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: chooseRadius(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "black",
                weight: .25,
                opacity: 1,
                fillOpacity: 0.5
            });
        },
        onEachFeature: individual_earthquake_feature
    });

    let map = L.map("map", {
        center: [20, -0],
        zoom: 2.5,
        layers: [L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        }), earthquake_layer]
    });

    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        let depth_intervals = [0, 10, 30, 50, 70, 90];
        let legend_labels = [];

        for (let i = 0; i < depth_intervals.length; i++) {
            legend_labels.push(
                '<i style="background:' + chooseColor(depth_intervals[i] + 1) + '"></i> ' +
                depth_intervals[i] + (depth_intervals[i + 1] ? '&ndash;' + depth_intervals[i + 1] + '<br>' : '+')
            );
        }

        let legend_div = L.DomUtil.create("div", "info legend");
        legend_div.innerHTML = '<strong> Earthquake Depth (km) </strong><br>' + legend_labels.join('<br>');
        return legend_div;
    };

    legend.addTo(map);
}

