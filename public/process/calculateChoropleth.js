var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));

var demographicsNames = ['population', 'white', 'black', 'asian', 'hispanic', 'other'];

var calculateWeight = function(propertyValue, totalValue) {
	return Math.floor(10 * (propertyValue / totalValue));
};

fs.readFile(args['i'], 'utf-8', function(err, geojson) {
	geojson = JSON.parse(geojson);
	var features = geojson.features;
	features.forEach(function(feature) {
		demographicsNames.forEach(function(demographicName) {
			feature.properties[demographicName + 'w'] = calculateWeight(
				feature.properties[demographicName],
				feature.properties['population']
			);
		});
	});
	fs.writeFile(args['o'], JSON.stringify(geojson), err => {
		if (err) console.log(err);
		console.log('Calculate choropleth weighted values for population values.');
	});
});
