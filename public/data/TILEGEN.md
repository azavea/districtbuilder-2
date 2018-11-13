# Generating Tiles

```bash
tippecanoe -o temp.mbtiles -b 0 --maximum-zoom=12 --minimum-zoom=4 --simplify-only-low-zooms --include=id [geojsonfilename]
mb-util --image_format=pbf temp.mbtiles tiles
cd tiles
gzip -d -r -S .pbf *
find . -type f -exec mv '{}' '{}'.pbf \;
```
