rm -rf _output

mkdir _output _output/county _output/bg _output/precinct _output/location _output/mbtiles _output/upload

# Export to GeoJSON
mapshaper -i input/geojson/bg/UT.geojson -o _output/bg/bg-lines.geojson format=geojson
mapshaper -i input/geojson/c/UT.geojson -o _output/county/county-lines.geojson format=geojson

node generateDataFeaturesJson.js -i _output/bg/bg-lines.geojson -o _output/upload/bg-features.json
node generateCountyIndex.js -c _output/county/county-lines.geojson -g _output/bg/bg-lines.geojson -o _output/upload/county-index.json
node generateAssignedDistricts.js -i _output/bg/bg-lines.geojson -o _output/upload/assigned-districts.json
node abbreviatePopulationValues.js -i _output/bg/bg-lines.geojson -o _output/bg/bg-lines.geojson
node abbreviatePopulationValues.js -i _output/county/county-lines.geojson -o _output/county/county-lines.geojson
node calculateChoropleth.js -i _output/bg/bg-lines.geojson -o _output/bg/bg-lines.geojson
node calculateChoropleth.js -i _output/county/county-lines.geojson -o _output/county/county-lines.geojson

# Filter location labels to county
mapshaper -i input/city-l.geojson -filter 'statefp==="49"' -o _output/location/city-l.geojson format=geojson
mapshaper -i input/city-m.geojson -filter 'statefp==="49"' -o _output/location/city-m.geojson format=geojson
mapshaper -i input/city-s.geojson -filter 'statefp==="49"' -o _output/location/city-s.geojson format=geojson
mapshaper -i input/town-l.geojson -filter 'statefp==="49"' -o _output/location/town-l.geojson format=geojson
mapshaper -i input/town-m.geojson -filter 'statefp==="49"' -o _output/location/town-m.geojson format=geojson
mapshaper -i input/town-s.geojson -filter 'statefp==="49"' -o _output/location/town-s.geojson format=geojson

# Generate Labels
geojson-polygon-labels _output/bg/bg-lines.geojson > _output/bg/bg-labels.geojson
geojson-polygon-labels _output/county/county-lines.geojson > _output/county/county-labels.geojson

# Export to TopoJSON
mapshaper -i _output/bg/bg-lines.geojson -simplify 0.4 -o _output/bg/bg-lines.topojson format=topojson drop-table

# Generate vector tiles
tippecanoe -f -pk --no-tile-compression -o _output/mbtiles/bg.mbtiles --simplification=15 --generate-ids --detect-shared-borders --maximum-zoom=10 --minimum-zoom=4 --simplify-only-low-zooms --no-tiny-polygon-reduction _output/bg/bg-lines.geojson
tippecanoe -f -pk --no-tile-compression -o _output/mbtiles/county.mbtiles --simplification=15 --generate-ids --detect-shared-borders --maximum-zoom=10 --minimum-zoom=4 --simplify-only-low-zooms --no-tiny-polygon-reduction _output/county/county-lines.geojson

tippecanoe -f -pk --no-tile-compression -o _output/mbtiles/bg-labels.mbtiles --maximum-zoom=10 --minimum-zoom=4 -r1 _output/bg/bg-labels.geojson
tippecanoe -f -pk --no-tile-compression -o _output/mbtiles/county-labels.mbtiles --maximum-zoom=10 --minimum-zoom=4 -r1 _output/county/county-labels.geojson

tippecanoe -f -pk --no-tile-compression -o _output/mbtiles/city-l.mbtiles --maximum-zoom=10 --minimum-zoom=4  _output/location/city-l.geojson
tippecanoe -f -pk --no-tile-compression -o _output/mbtiles/city-m.mbtiles --maximum-zoom=10 --minimum-zoom=4  _output/location/city-m.geojson
tippecanoe -f -pk --no-tile-compression -o _output/mbtiles/city-s.mbtiles --maximum-zoom=10 --minimum-zoom=4  _output/location/city-s.geojson
tippecanoe -f -pk --no-tile-compression -o _output/mbtiles/town-l.mbtiles --maximum-zoom=10 --minimum-zoom=7 --drop-densest-as-needed  _output/location/town-l.geojson
tippecanoe -f -pk --no-tile-compression -o _output/mbtiles/town-m.mbtiles --maximum-zoom=10 --minimum-zoom=7 --drop-densest-as-needed  _output/location/town-m.geojson
tippecanoe -f -pk --no-tile-compression -o _output/mbtiles/town-s.mbtiles --maximum-zoom=10 --minimum-zoom=8 --drop-densest-as-needed  _output/location/town-s.geojson

tile-join -pk --no-tile-compression -o _output/mbtiles/combined.mbtiles _output/mbtiles/bg.mbtiles _output/mbtiles/county.mbtiles _output/mbtiles/city-l.mbtiles _output/mbtiles/city-m.mbtiles _output/mbtiles/city-s.mbtiles _output/mbtiles/town-l.mbtiles _output/mbtiles/town-m.mbtiles _output/mbtiles/town-s.mbtiles _output/mbtiles/bg-labels.mbtiles _output/mbtiles/county-labels.mbtiles

mb-util --image_format=pbf _output/mbtiles/combined.mbtiles _output/upload/tiles

cp _output/bg/bg-lines.topojson _output/upload/bg-lines.topojson
