# Roadmap

This roadmap outlines the Valhalla features and APIs, categorizing them into implemented and planned features for `valhalla_ui`.

## Implemented Features

* **Turn-by-Turn Route API**: Calculates optimal routes between locations with detailed navigation instructions.
* **Isochrone API**: Computes reachable areas from a location within a specified time or distance.
* **Matrix API**: Calculates a table of travel times and distances between multiple origins and destinations.
* **Map Matching API**: Matches raw GPS traces to the most likely road network path.

## Planned Features

* **Optimized Route API**: Computes the optimal order of waypoints for a route (Traveling Salesperson Problem).
* **Elevation API**: Retrieves elevation data along a path or at specified locations.
* **Expansion API**: Returns a GeoJSON representation of a graph traversal (isochrone expansion) at a given location.
* **Locate API**: Provides detailed metadata about graph nodes and edges at a specific coordinate.
* **Status API**: Returns the health status and version information of the running Valhalla server.
* **Centroid API**: Finds the least-cost convergence point for routes originating from multiple locations.
* **Tile API**: Accesses the raw routing tiles used by the Valhalla engine.
