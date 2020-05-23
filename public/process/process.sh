#!/bin/bash

set -e

error_exit()
{
	echo "$1" 1>&2
	exit 1
}

usage()
{
    echo "usage: process.sh [[-s state ] | [-h]]"
}

lookup=./state-lookup.conf

if [[ ! -f "$lookup" ]]; then
    error_exit "Missing state lookup config file. Exiting."
fi

. "$lookup"

while getopts s:d:h flag
do
    case "${flag}" in
        s) state=${OPTARG};;
        h) usage; exit;;
    esac
done

if [[ ! "$state" ]]; then
    error_exit "State and input directory must be specified. Use -h to see usage."
fi

if [[ ${!state} == "" ]]; then
    error_exit "Error: State not found. Check state-lookup.conf for available states."
fi

in_dir=./input/

if [[ ! "$in_dir"/geojson/bg/"$state" ]]; then
    error_exit "Error: Blockgroup data for state not found."
fi

if [[ ! "$in_dir"/geojson/c/"$state" ]]; then
    error_exit "Error: County data for state not found."
fi

out_dir=./_output/"$state"

if [[ -d "$out_dir" ]]; then
    echo "Data for state already exists. Overwrite? (y/n)"
        while : ; do
            read reply
            if [[ $reply == "y" ]]; then
                echo "Removing existing state data."
                rm -rf "$out_dir"
                break
            elif [[ $reply == "n" ]]; then
                error_exit "Existing state data was not overwritten. Exiting."
            else
                echo "Unexpected input. Overwrite? (y/n)"
            fi
        done
fi
echo "Creating output directory."

county_dir="$out_dir"/county
bg_dir="$out_dir"/bg
precinct_dir="$out_dir"/precinct
location_dir="$out_dir"/location
mbtiles_dir="$out_dir"/mbtiles
upload_dir="$out_dir"/upload


mkdir -p "$out_dir" "$county_dir" "$bg_dir" "$precinct_dir" "$location_dir" "$mbtiles_dir" "$upload_dir"

# Export to GeoJSON
echo "Exporting source files to geojson."
mapshaper -i "$in_dir"/geojson/bg/$state.geojson -o "$bg_dir"/bg-lines.geojson format=geojson
mapshaper -i "$in_dir"/geojson/c/$state.geojson -o "$county_dir"/county-lines.geojson format=geojson

node generateDataFeaturesJson.js -i "$bg_dir"/bg-lines.geojson -o "$out_dir"/upload/bg-features.json
node generateCountyIndex.js -c "$county_dir"/county-lines.geojson -g "$bg_dir"/bg-lines.geojson -o "$out_dir"/upload/county-index.json
node generateAssignedDistricts.js -i "$bg_dir"/bg-lines.geojson -o "$out_dir"/upload/assigned-districts.json
node abbreviatePopulationValues.js -i "$bg_dir"/bg-lines.geojson -o "$bg_dir"/bg-lines.geojson
node abbreviatePopulationValues.js -i "$county_dir"/county-lines.geojson -o "$county_dir"/county-lines.geojson

# Filter location labels to state
echo "Filtering location labels to state."
for f in "$in_dir"/*.geojson; do
    mapshaper -i "$f" -filter \'statefp===\"${!state}\"\' -o "$location_dir"/"$(basename "$f")" format=geojson
done

# Generate Labels
echo "Generating labels for polygons."
geojson-polygon-labels "$bg_dir"/bg-lines.geojson > "$bg_dir"/bg-labels.geojson
geojson-polygon-labels "$county_dir"/county-lines.geojson > "$county_dir"/county-labels.geojson

# Export to TopoJSON
echo "Exporting geojson to topojson."
mapshaper -i "$bg_dir"/bg-lines.geojson -simplify 0.4 -o "$bg_dir"/bg-lines.topojson format=topojson drop-table

# Generate vector tiles
echo "Generating vector tiles."
tippecanoe -f -pk --no-tile-compression -o "$mbtiles_dir"/bg.mbtiles --simplification=15 --generate-ids --detect-shared-borders --maximum-zoom=10 --minimum-zoom=4 --simplify-only-low-zooms --no-tiny-polygon-reduction "$bg_dir"/bg-lines.geojson
tippecanoe -f -pk --no-tile-compression -o "$mbtiles_dir"/county.mbtiles --simplification=15 --generate-ids --detect-shared-borders --maximum-zoom=10 --minimum-zoom=4 --simplify-only-low-zooms --no-tiny-polygon-reduction "$county_dir"/county-lines.geojson

tippecanoe -f -pk --no-tile-compression -o "$mbtiles_dir"/bg-labels.mbtiles --maximum-zoom=10 --minimum-zoom=4 -r1 "$bg_dir"/bg-labels.geojson
tippecanoe -f -pk --no-tile-compression -o "$mbtiles_dir"/county-labels.mbtiles --maximum-zoom=10 --minimum-zoom=4 -r1 "$county_dir"/county-labels.geojson

tippecanoe -f -pk --no-tile-compression -o "$mbtiles_dir"/city-l.mbtiles --maximum-zoom=10 --minimum-zoom=4  "$location_dir"/city-l.geojson
tippecanoe -f -pk --no-tile-compression -o "$mbtiles_dir"/city-m.mbtiles --maximum-zoom=10 --minimum-zoom=4  "$location_dir"/city-m.geojson
tippecanoe -f -pk --no-tile-compression -o "$mbtiles_dir"/city-s.mbtiles --maximum-zoom=10 --minimum-zoom=4  "$location_dir"/city-s.geojson
tippecanoe -f -pk --no-tile-compression -o "$mbtiles_dir"/town-l.mbtiles --maximum-zoom=10 --minimum-zoom=7 --drop-densest-as-needed  "$location_dir"/town-l.geojson
tippecanoe -f -pk --no-tile-compression -o "$mbtiles_dir"/town-m.mbtiles --maximum-zoom=10 --minimum-zoom=7 --drop-densest-as-needed  "$location_dir"/town-m.geojson
tippecanoe -f -pk --no-tile-compression -o "$mbtiles_dir"/town-s.mbtiles --maximum-zoom=10 --minimum-zoom=8 --drop-densest-as-needed  "$location_dir"/town-s.geojson

tile-join -pk --no-tile-compression -o "$mbtiles_dir"/combined.mbtiles "$mbtiles_dir"/bg.mbtiles "$mbtiles_dir"/county.mbtiles "$mbtiles_dir"/city-l.mbtiles "$mbtiles_dir"/city-m.mbtiles "$mbtiles_dir"/city-s.mbtiles "$mbtiles_dir"/town-l.mbtiles "$mbtiles_dir"/town-m.mbtiles "$mbtiles_dir"/town-s.mbtiles "$mbtiles_dir"/bg-labels.mbtiles "$mbtiles_dir"/county-labels.mbtiles

mb-util --image_format=pbf "$mbtiles_dir"/combined.mbtiles "$upload_dir"/tiles

cp "$bg_dir"/bg-lines.topojson "$upload_dir"/bg-lines.topojson