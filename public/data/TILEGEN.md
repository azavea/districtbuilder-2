# Generating Tiles

```bash
tippecanoe -o bg.mbtiles --detect-shared-borders --maximum-zoom=12 --minimum-zoom=4 --simplify-only-low-zooms --include=id bg.geojson
mb-util --image_format=pbf temp.mbtiles tiles
cd tiles
gzip -d -r -S .pbf *
find . -type f -exec mv '{}' '{}'.pbf \;
```

```bash
tippecanoe -f -o mbtiles/bg.mbtiles --detect-shared-borders --maximum-zoom=12 --minimum-zoom=1 --simplify-only-low-zooms --include countyfp --include=id pa-bg.geojson
tippecanoe -f -o mbtiles/counties.mbtiles --detect-shared-borders --maximum-zoom=12 --minimum-zoom=1 --simplify-only-low-zooms --feature-filter='{ "*": [ "==", "statefp", "42" ] }' us-counties.geojson
tippecanoe -f -o mbtiles/city-l.mbtiles -zg --feature-filter='{ "*": [ "==", "statefp", "42" ] }' city-l.geojson
tippecanoe -f -o mbtiles/city-m.mbtiles -zg --feature-filter='{ "*": [ "==", "statefp", "42" ] }' city-m.geojson
tippecanoe -f -o mbtiles/city-s.mbtiles -zg --feature-filter='{ "*": [ "==", "statefp", "42" ] }' city-s.geojson
tippecanoe -f -o mbtiles/town-l.mbtiles -zg --drop-densest-as-needed --feature-filter='{ "*": [ "==", "statefp", "42" ] }' town-l.geojson
tippecanoe -f -o mbtiles/town-m.mbtiles -zg --drop-densest-as-needed --feature-filter='{ "*": [ "==", "statefp", "42" ] }' town-m.geojson
tippecanoe -f -o mbtiles/town-s.mbtiles -zg --drop-densest-as-needed --feature-filter='{ "*": [ "==", "statefp", 42 ] }' town-s.geojson

tile-join -o mbtiles/combined.mbtiles mbtiles/bg.mbtiles mbtiles/counties.mbtiles mbtiles/city-l.mbtiles mbtiles/city-m.mbtiles mbtiles/city-s.mbtiles mbtiles/town-l.mbtiles mbtiles/town-m.mbtiles mbtiles/town-s.mbtiles

mb-util --image_format=pbf mbtiles/combined.mbtiles tiles
cd tiles
gzip -d -r -S .pbf *
find . -type f -exec mv '{}' '{}'.pbf \;
```

tippecanoe -o town-s.mbtiles --minimum-zoom=11 --drop-densest-as-needed --feature-filter='{ "\*": ["all", [ "==", "statefp", "42" ]] }' town-s.geojson -f
