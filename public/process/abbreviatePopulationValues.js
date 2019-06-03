var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));

var demographicsNames = ['population', 'white', 'black', 'asian', 'hispanic', 'other'];

var abbreviateNumber = function(value) {
	var newValue = value;
	if (value >= 1000) {
		var suffixes = ['', 'k', 'm', 'b', 't'];
		var suffixNum = Math.floor(('' + value).length / 3);
		var shortValue = '';
		for (var precision = 2; precision >= 1; precision--) {
			shortValue = parseFloat(
				(suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision)
			);
			var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
			if (dotLessShortValue.length <= 2) {
				break;
			}
		}
		newValue = shortValue + suffixes[suffixNum];
	}
	return newValue;
};

fs.readFile(args['i'], 'utf-8', function(err, geojson) {
	geojson = JSON.parse(geojson);
	var features = geojson.features;
	features.forEach(function(feature) {
		demographicsNames.forEach(function(demographicName) {
			feature.properties[demographicName + 'abbr'] = abbreviateNumber(
				feature.properties[demographicName]
			);
		});
	});
	fs.writeFile(args['o'], JSON.stringify(geojson), err => {
		if (err) console.log(err);
		console.log('Added abbreviated format for population values.');
	});
});
