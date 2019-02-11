# Function that returns abbreviated numbers for populations
# You need to list all of the different types of populations in the `demographicsNames` and `demographics` arrays.
abbreviateNumbers='
	var demographicsNames = ["population", "white", "black", "asian", "native", "other"];
	var demographics = [population, white, black, asian, native, other];
	demographics.forEach((demo, key) => {
		var value = demo; var newValue = value;
		if (value >= 1000) {
			var suffixes = ["", "k", "m", "b", "t"];
			var suffixNum = Math.floor(("" + value).length / 3);
			var shortValue = "";
			for (var precision = 2; precision >= 1; precision--) {
				shortValue = parseFloat(
					(suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision)
				);
				var dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
				if (dotLessShortValue.length <= 2) {
					break;
				}
			}
			if (shortValue % 1 != 0) shortNum = shortValue.toFixed(1);
			newValue = shortValue + suffixes[suffixNum];
		}
		this.properties = Object.assign({[demographicsNames[key]+"abbr"]: newValue}, this.properties);
	})
'
abbrRemoveFields=fields=dotLessShortValue,suffixes,value,precision,suffixNum,shortValue,shortNum,newValue,demographics,demo,demographicsNames

rm -rf _output

mkdir _output _output/county _output/geounit _output/location _output/mbtiles

# Export to GeoJSON
mapshaper -i input/pa-bg.geojson -simplify 0.4 -o _output/geounit/geounit-lines.geojson format=geojson
mapshaper -i input/us-counties.geojson -simplify 0.4 -filter 'statefp==="42"' -o _output/county/county-lines.geojson format=geojson

mapshaper -i input/city-l.geojson -filter 'statefp==="42"' -o _output/location/city-l.geojson format=geojson
mapshaper -i input/city-m.geojson -filter 'statefp==="42"' -o _output/location/city-m.geojson format=geojson
mapshaper -i input/city-s.geojson -filter 'statefp==="42"' -o _output/location/city-s.geojson format=geojson
mapshaper -i input/town-l.geojson -filter 'statefp==="42"' -o _output/location/town-l.geojson format=geojson
mapshaper -i input/town-m.geojson -filter 'statefp==="42"' -o _output/location/town-m.geojson format=geojson
mapshaper -i input/town-s.geojson -filter 'statefp==="42"' -o _output/location/town-s.geojson format=geojson

# Generate Labels
geojson-polygon-labels _output/geounit/geounit-lines.geojson > _output/geounit/geounit-labels.geojson
geojson-polygon-labels _output/county/county-lines.geojson > _output/county/county-labels.geojson

# Abbreviate population numbers
mapshaper _output/geounit/geounit-labels.geojson -each "$abbreviateNumbers" -drop $abbrRemoveFields -o force _output/geounit/geounit-labels.geojson
mapshaper _output/county/county-labels.geojson -each "$abbreviateNumbers" -drop $abbrRemoveFields -o force _output/county/county-labels.geojson

# Export to TopoJSON
mapshaper -i input/pa-bg.geojson -simplify 0.4 -o _output/geounit/geounit-lines.topojson format=topojson
mapshaper -i input/us-counties.geojson -simplify 0.4 -filter 'statefp==="42"' -o _output/county/county-lines.topojson format=topojson

# Generate vector tiles
tippecanoe -f -o _output/mbtiles/geounit.mbtiles --detect-shared-borders --maximum-zoom=12 --minimum-zoom=1 --simplify-only-low-zooms --no-tiny-polygon-reduction _output/geounit/geounit-lines.geojson
tippecanoe -f -o _output/mbtiles/county.mbtiles --detect-shared-borders --maximum-zoom=12 --minimum-zoom=1 --simplify-only-low-zooms --no-tiny-polygon-reduction _output/county/county-lines.geojson

tippecanoe -f -o _output/mbtiles/geounit-labels.mbtiles --maximum-zoom=12 --minimum-zoom=1 -r1 _output/geounit/geounit-labels.geojson
tippecanoe -f -o _output/mbtiles/county-labels.mbtiles --maximum-zoom=12 --minimum-zoom=1 -r1 _output/county/county-labels.geojson

tippecanoe -f -o _output/mbtiles/city-l.mbtiles --maximum-zoom=12 --minimum-zoom=1  _output/location/city-l.geojson
tippecanoe -f -o _output/mbtiles/city-m.mbtiles --maximum-zoom=12 --minimum-zoom=2  _output/location/city-m.geojson
tippecanoe -f -o _output/mbtiles/city-s.mbtiles --maximum-zoom=12 --minimum-zoom=4  _output/location/city-s.geojson
tippecanoe -f -o _output/mbtiles/town-l.mbtiles --maximum-zoom=12 --minimum-zoom=7 --drop-densest-as-needed  _output/location/town-l.geojson
tippecanoe -f -o _output/mbtiles/town-m.mbtiles --maximum-zoom=12 --minimum-zoom=7 --drop-densest-as-needed  _output/location/town-m.geojson
tippecanoe -f -o _output/mbtiles/town-s.mbtiles --maximum-zoom=12 --minimum-zoom=8 --drop-densest-as-needed  _output/location/town-s.geojson

tile-join -o _output/mbtiles/combined.mbtiles _output/mbtiles/geounit.mbtiles _output/mbtiles/county.mbtiles _output/mbtiles/city-l.mbtiles _output/mbtiles/city-m.mbtiles _output/mbtiles/city-s.mbtiles _output/mbtiles/town-l.mbtiles _output/mbtiles/town-m.mbtiles _output/mbtiles/town-s.mbtiles _output/mbtiles/geounit-labels.mbtiles _output/mbtiles/county-labels.mbtiles

mb-util --image_format=pbf _output/mbtiles/combined.mbtiles _output/tiles

cd _output/tiles
gzip -d -r -S .pbf *
find . -type f -exec mv '{}' '{}'.pbf \;
cd ../..
