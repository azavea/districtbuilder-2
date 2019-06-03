var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));

fs.readFile(args['i'], 'utf-8', function(err, geojson) {
	geojson = JSON.parse(geojson);
	var features = geojson.features;
	var assignedDistricts = features.map(function(feature) {
		return 0;
	});
	fs.writeFile(args['o'], JSON.stringify(assignedDistricts), err => {
		if (err) console.log(err);
		console.log('Generate assigned districts file.');
	});
});
