var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));

fs.readFile(args['c'], 'utf-8', function(err, countyGeojson) {
	countyGeojson = JSON.parse(countyGeojson);
	var countyFeatures = countyGeojson.features;
	var countyIndex = {};
	fs.readFile(args['g'], 'utf-8', function(err, geounitGeojson) {
		geounitGeojson = JSON.parse(geounitGeojson);
		var geounitFeatures = geounitGeojson.features;
		countyFeatures.forEach(function(countyFeature, index) {
			countyIndex[countyFeature.properties.countyfp] = {};
			countyIndex[countyFeature.properties.countyfp].name = countyFeature.properties.name;
			countyIndex[countyFeature.properties.countyfp].geounits = [];
		});
		geounitFeatures.forEach(function(geounitFeature) {
			countyIndex[geounitFeature.properties.countyfp].geounits.push(geounitFeature.properties.id);
		});
		fs.writeFile(args['o'], JSON.stringify(countyIndex), err => {
			if (err) console.log(err);
			console.log('Generate county index file.');
		});
	});
});
