var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));

fs.readFile(args['i'], 'utf-8', function(err, geojson) {
	geojson = JSON.parse(geojson);
	var features = geojson.features;
	var dataFeatures = features.map(function(feature) {
		return feature.properties;
	});
	fs.writeFile(args['o'], JSON.stringify(dataFeatures), err => {
		if (err) console.log(err);
		console.log('Generated data features file.');
	});
});
