![DistrictBuilder](https://github.com/azavea/DistrictBuilder/raw/master/districtbuilder_full-color_sm.png)

# DistrictBuilder 2.0


[Azavea](http://www.azavea.com) developed the first version of [DistrictBuilder](http://www.districtbuilder.org) software in 2010 in collaboration with the [PublicMapping Project](http://www.publicmapping.org/), under the direction of Dr. Michael McDonald and Dr. Micah Altman.

This is a prototype for the next generation version of DistrictBuilder aimed at the 2020 Census cycle. In this new version, we are aiming to expand use and utility of DistrictBuilder by pursuing several objectives:

-	Improve scalability (the number of simultaneous users that can be supported) 
-	Improve performance (faster, more responsive interface)
-	Reduce cost of configuration and hosting infrastructure
-	Simplify configuration – reduce the amount of effort and complexity of getting started
-	Support a national database of census data that will address most people’s needs 

While pursuing these objectives, we also want to preserve some of the key differentiators of the platform:

-	Maintain permissive open source license
-	Preserve support for competitions
-	Preserve support for custom, local, non-Census redistricting efforts

To support these objectives, we have made several significant changes to the DistrictBuilder architecture in this new version:

-	Calculations in the browser - We are shifting most geometry calculations from the database and web server to the web browser; vector geometry libraries have advanced significantly, and we believe that we can now efficiently perform key geometry and mathematical calculations (compactness, adjacency, contiguity, population) without making additional requests to the server. This will significantly reduce load on the server.
-	Display with vectors – With the district geometry being stored in the browser, we can achieve higher resolution and faster display times by displaying districts using the browser canvas, rather than rendering map on the server and displaying an image of the map.
-	Make a single national scale database with all census geometry and necessary demographic data as a default configuration.
-	Provide all states and chambers to all users.
- Provide an option for custom, local configuration
-	Implement all server-side functionality as an API, enabling custom user interfaces as well as clearer separation of server-side functionality from client-side functionality. 
-	Organize configuration and data as files that are retrieved from the server, rather than in a database. We plan to store state-level configuration as JSON files and district and census geometry as GeoJSON and TopoJSON files. We will continue to store user data, including saved plans in a relational database. Similar to other changes, we believe this will improve scalability and performance of the application for all users.
-	Simplify configuration by reducing the range of features that can be managed using the configuration file.


## Getting Started

Run `npm install` and `npm start`.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs dependencies.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
