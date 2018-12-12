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

# Export to TopoJSON
mapshaper -i input/pa-bg.geojson -simplify 0.4 -o _output/geounit/geounit-lines.topojson format=topojson
mapshaper -i input/us-counties.geojson -simplify 0.4 -filter 'statefp==="42"' -o _output/county/county-lines.topojson format=topojson

# Generate vector tiles
tippecanoe -f -o _output/mbtiles/geounit.mbtiles --detect-shared-borders --maximum-zoom=12 --minimum-zoom=1 --simplify-only-low-zooms _output/geounit/geounit-lines.geojson
tippecanoe -f -o _output/mbtiles/county.mbtiles --detect-shared-borders --maximum-zoom=12 --minimum-zoom=1 --simplify-only-low-zooms _output/county/county-lines.geojson

tippecanoe -f -o _output/mbtiles/geounit-labels.mbtiles --maximum-zoom=12 --minimum-zoom=8 -r1 _output/geounit/geounit-labels.geojson
tippecanoe -f -o _output/mbtiles/county-labels.mbtiles --maximum-zoom=12 --minimum-zoom=8 -r1 _output/county/county-labels.geojson

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
