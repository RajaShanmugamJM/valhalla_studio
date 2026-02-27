# Matrix API (Sources to Targets)

## Overview

The Matrix API (also called the **Sources to Targets** API) computes a matrix of travel times and distances between a set of origin points (sources) and a set of destination points (targets). Instead of one route, it computes all pairwise combinations: every source to every target.

This is used by the **Matrix** view in Valhalla Studio and is essential for logistics, optimization, and multi-point accessibility analysis.

---

## Endpoint

```
GET {valhallaUrl}/sources_to_targets?json=<encoded_payload>
```

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/sources_to_targets` |
| Body format | JSON passed as a URL query parameter (`json=`) |
| Response format | `application/json` |

---

## Request Parameters

### Top-Level Fields

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sources` | `Source[]` | Yes | Array of origin locations. Each source is paired with every target. |
| `targets` | `Source[]` | Yes | Array of destination locations. Each target receives routes from every source. |
| `costing` | `string` | Yes | Travel mode / costing model to use when computing routes. |
| `costing_options` | `object` | No | Fine-grained routing options for the selected costing model. |
| `shape_format` | `string` | No | Encoding format for the route shape. Options: `"polyline5"`, `"polyline6"`, `"geojson"`. Default: `"polyline6"`. |
| `units` | `string` | No | Unit system for distances. Options: `"miles"`, `"kilometers"`. Default: `"kilometers"`. |
| `id` | `string` | No | Optional identifier echoed back in the response. |
| `date_time` | `object` | No | Date and time for time-dependent routing (affects travel times). |

---

### Source / Target Object

Sources and targets share the same structure:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lat` | `number` | Yes | Latitude in decimal degrees (WGS84). |
| `lon` | `number` | Yes | Longitude in decimal degrees (WGS84). |
| `type` | `string` | No | Location type — should be `"break"` for matrix use. |
| `heading` | `number` | No | Preferred heading at this location in degrees (0–359). |
| `street` | `string` | No | Street name hint for snapping to the correct road. |
| `minimum_reachability` | `number` | No | Minimum edge reachability threshold for this location. |
| `radius` | `number` | No | Search radius in meters for road-network snapping. |

---

### Costing Models

Same costing models as the Route API:

| Value | Description |
|-------|-------------|
| `auto` | Car/automobile routing. |
| `bicycle` | Bicycle routing. |
| `pedestrian` | Walking routing. |
| `bus` | Bus routing. |
| `truck` | Heavy goods vehicle routing. |
| `motor_scooter` | Motor scooter routing. |
| `motorcycle` | Motorcycle routing. |

---

### Shape Format Options

| Value | Description |
|-------|-------------|
| `polyline5` | Encoded polyline with precision 5 (standard Google encoding). |
| `polyline6` | Encoded polyline with precision 6 (Valhalla's default, higher accuracy). |
| `geojson` | Raw GeoJSON LineString geometry. |

---

### Date/Time Object (Optional)

| Field | Type | Description |
|-------|------|-------------|
| `type` | `number` | `1` = depart at (affects congestion-aware travel times). |
| `value` | `string` | ISO 8601 datetime string (e.g., `"2024-06-15T08:00"`). |

---

## Matrix Dimensions

If you provide **M** sources and **N** targets, the response contains an **M × N** matrix — one row per source, one column per target. The matrix is returned as an array of arrays: `sources_to_targets[source_index][target_index]`.

| Sources | Targets | Matrix cells |
|---------|---------|--------------|
| 3 | 4 | 12 |
| 1 | 10 | 10 |
| 5 | 5 | 25 |

---

## Example Request

```json
{
  "sources": [
    { "lat": 40.7484, "lon": -73.9967 },
    { "lat": 40.7549, "lon": -73.9840 }
  ],
  "targets": [
    { "lat": 40.7614, "lon": -73.9776 },
    { "lat": 40.7282, "lon": -74.0776 },
    { "lat": 40.6892, "lon": -74.0445 }
  ],
  "costing": "auto",
  "shape_format": "polyline6"
}
```

This computes 6 routes (2 sources × 3 targets):
- Source 0 → Target 0, 1, 2
- Source 1 → Target 0, 1, 2

**Constructed URL:**
```
GET {valhallaUrl}/sources_to_targets?json={"sources":[...],"targets":[...],"costing":"auto","shape_format":"polyline6"}
```

---

## Response

### Top-Level Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `algorithm` | `string` | Routing algorithm used internally (e.g., `"timedistancematrix"`). |
| `units` | `string` | Unit system used in the response (`"miles"` or `"kilometers"`). |
| `sources` | `Source[]` | Snapped source locations as resolved by the routing engine. |
| `targets` | `Source[]` | Snapped target locations as resolved by the routing engine. |
| `sources_to_targets` | `SourcesToTarget[][]` | 2D array (M × N) of routing results. Indexed as `[source_index][target_index]`. |

---

### SourcesToTarget Object

Each cell in the matrix describes the route from one source to one target:

| Field | Type | Description |
|-------|------|-------------|
| `from_index` | `number` | Index of the source location (0-based). |
| `to_index` | `number` | Index of the target location (0-based). |
| `time` | `number` | Estimated travel time in **seconds**. `null` if no route found. |
| `distance` | `number` | Travel distance in the requested units. `null` if no route found. |
| `shape` | `string` | Encoded route geometry (in the format specified by `shape_format`). |

---

## Example Response

```json
{
  "algorithm": "timedistancematrix",
  "units": "kilometers",
  "sources": [
    { "lon": -73.9967, "lat": 40.7484 },
    { "lon": -73.9840, "lat": 40.7549 }
  ],
  "targets": [
    { "lon": -73.9776, "lat": 40.7614 },
    { "lon": -74.0776, "lat": 40.7282 },
    { "lon": -74.0445, "lat": 40.6892 }
  ],
  "sources_to_targets": [
    [
      { "from_index": 0, "to_index": 0, "time": 420, "distance": 2.1, "shape": "k{~wFpqubM..." },
      { "from_index": 0, "to_index": 1, "time": 1560, "distance": 8.4, "shape": "k{~wFpqubM..." },
      { "from_index": 0, "to_index": 2, "time": 2100, "distance": 11.2, "shape": "k{~wFpqubM..." }
    ],
    [
      { "from_index": 1, "to_index": 0, "time": 300, "distance": 1.5, "shape": "..." },
      { "from_index": 1, "to_index": 1, "time": 1800, "distance": 9.1, "shape": "..." },
      { "from_index": 1, "to_index": 2, "time": 2400, "distance": 12.3, "shape": "..." }
    ]
  ]
}
```

---

## How Valhalla Studio Uses This API

In Valhalla Studio's **Matrix** view:

1. The user selects between **Source** and **Destination** mode using a toggle.
2. Clicking on the map drops markers of the selected type.
3. When "Generate Route" is clicked, all marked sources and targets are bundled into a `sources_to_targets` request with `costing: "auto"` and `shape_format: "polyline6"`.
4. The returned matrix is iterated and each route shape is decoded using `decodeShape()` and displayed on the map with a unique random color per route.

---

## Use Cases

| Scenario | Notes |
|----------|-------|
| **Traveling Salesman Problem (TSP)** | Supply the full distance/time matrix to a TSP solver as the cost matrix for route optimization. |
| **Vehicle Routing Problem (VRP)** | Logistics platforms use the matrix to assign deliveries to the nearest or fastest vehicle. |
| **Nearest facility search** | Find the closest hospital, school, or service center from multiple demand points. |
| **Delivery time estimation** | Pre-compute all estimated delivery times for a batch of orders before assigning drivers. |
| **Ride-sharing dispatch** | Match riders to the nearest available driver by computing a driver-to-rider time matrix. |
| **Fleet management** | Calculate service windows for field technicians across a set of job sites. |
| **Supply chain optimization** | Compute cross-dock or warehouse-to-store travel time matrices for distribution planning. |
| **Location intelligence** | Rank candidate store/office locations by average accessibility to a set of customer points. |

---

## Performance Considerations

- Matrix computations scale as **O(M × N)** in terms of routing work. Very large matrices (e.g., 100 × 100 = 10,000 routes) may be slow or may exceed server limits.
- Valhalla implements optimized many-to-many algorithms (e.g., CostMatrix) that are significantly faster than computing individual route requests in a loop.
- Some Valhalla deployments limit the maximum number of sources + targets per request (typically 50–500 combined).
- For very large problems, consider batching requests or using the Route API with waypoints for smaller subsets.

---

## Shape Decoding

Route shapes in the matrix response are encoded polylines (precision 6 by default). Use `decodeShape()` in Valhalla Studio to convert them to coordinate arrays:

```typescript
const coordinates = valhallaStore.decodeShape(cell.shape);
// Returns: [[lat1, lng1], [lat2, lng2], ...]
```

---

## Error Responses

```json
{
  "error_code": 170,
  "error": "Failed to find a path from origin",
  "status_code": 400,
  "status": "Bad Request"
}
```

| Code | Description |
|------|-------------|
| `100` | Failed to parse the JSON request |
| `110` | Insufficiently specified `sources` or `targets` |
| `120` | Missing or invalid `costing` model |
| `170` | No path found between two points (e.g., island or disconnected road network) |

---

## Notes

- The response matrix is ordered: `sources_to_targets[i][j]` is always source `i` → target `j`.
- A `null` value in `time` or `distance` means no route was found between that source-target pair.
- Authentication (Basic Auth) is passed via the `Authorization` header when configured in Settings.
