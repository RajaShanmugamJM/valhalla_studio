# Locate API

## Overview

The Locate API snaps one or more geographic coordinates to the Valhalla road network and returns detailed information about the nearest road edges and nodes. Unlike routing APIs, it does not compute a route — instead it inspects the road network at specific locations and returns rich metadata about the underlying road segments (edges) and intersections (nodes).

This API is used internally in Valhalla Studio via the `locate` store method and is essential for understanding road attributes, access restrictions, speed data, and topology at any given point.

---

## Endpoint

```
GET {valhallaUrl}/locate?json=<encoded_payload>
```

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/locate` |
| Body format | JSON passed as a URL query parameter (`json=`) |
| Response format | `application/json` |

---

## Request Parameters

### Top-Level Fields

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locations` | `Location[]` | Yes | Array of geographic points to locate on the road network. |
| `costing` | `string` | Yes | Travel mode used to determine which edges are accessible for the given vehicle type. |
| `verbose` | `boolean` | No | If `true`, returns full detailed edge and node attributes. If `false`, returns only snapped coordinates. Default: `false`. |
| `directions_options` | `DirectionsOptions` | No | Options for output formatting (e.g., units). |

---

### Location Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lat` | `number` | Yes | Latitude of the point to locate in decimal degrees (WGS84). |
| `lon` | `number` | Yes | Longitude of the point to locate in decimal degrees (WGS84). |

---

### Directions Options Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `units` | `string` | No | Unit system for distances. Options: `"miles"`, `"kilometers"`. Default: `"kilometers"`. |

---

### Costing Models

The costing model filters which road edges are returned — only edges accessible to the specified travel mode are included:

| Value | Description |
|-------|-------------|
| `auto` | Locate edges accessible to cars. |
| `bicycle` | Locate edges accessible to bicycles. |
| `pedestrian` | Locate edges accessible to pedestrians. |
| `bus` | Locate edges accessible to buses. |
| `truck` | Locate edges accessible to trucks (respects weight/height restrictions). |
| `motor_scooter` | Locate edges for motor scooters. |
| `motorcycle` | Locate edges for motorcycles. |

---

## Example Request

```json
{
  "verbose": true,
  "locations": [
    { "lat": 40.7484, "lon": -73.9967 }
  ],
  "costing": "auto",
  "directions_options": {
    "units": "miles"
  }
}
```

**Constructed URL:**
```
GET {valhallaUrl}/locate?json={"verbose":true,"locations":[{"lat":40.7484,"lon":-73.9967}],"costing":"auto","directions_options":{"units":"miles"}}
```

---

## Response

The response is an array of `LocateResponse` objects — one per input location.

### Response Array

```json
[
  {
    "input_lat": 40.7484,
    "input_lon": -73.9967,
    "edges": [...],
    "nodes": [...]
  }
]
```

---

### LocateResponse Object

| Field | Type | Description |
|-------|------|-------------|
| `input_lat` | `number` | The latitude from the input `locations` array. |
| `input_lon` | `number` | The longitude from the input `locations` array. |
| `edges` | `EdgeElement[]` | Array of nearby road edges (road segments) accessible from this location under the specified costing model. |
| `nodes` | `any[]` | Array of nearby road network nodes (intersections). Present when `verbose: true`. |

---

### EdgeElement Object

Each edge represents a directed road segment near the queried location:

| Field | Type | Description |
|-------|------|-------------|
| `correlated_lat` | `number` | Latitude of the snapped point on the edge (closest point on the road). |
| `correlated_lon` | `number` | Longitude of the snapped point on the edge. |
| `side_of_street` | `string` | Which side of the road the input point falls on: `"left"`, `"right"`, or `"neither"`. |
| `percent_along` | `number` | Fractional position along the edge (0.0 = start node, 1.0 = end node). |
| `distance` | `number` | Distance in meters from the input coordinate to the snapped edge point. |
| `heading` | `number` | Compass heading of the edge at the snapped point (degrees, 0–359). |
| `outbound_reach` | `number` | Number of outbound edges reachable from this edge's end node. Useful for connectivity analysis. |
| `inbound_reach` | `number` | Number of inbound edges leading to this edge's start node. |
| `linear_reference` | `string` | Linear reference position along the edge as a base64-encoded binary value. |
| `edge_id` | `EdgeID` | Unique identifier for this edge in the Valhalla tile system. |
| `edge` | `EdgeEdge` | Detailed attributes of the road segment (access, classification, geometry, etc.). |
| `edge_info` | `EdgeInfo` | Additional metadata about the edge (speed limits, names, OSM way ID, shape). |
| `live_speed` | `LiveSpeed` | Real-time speed data for the edge (if available from a speed provider). |
| `predicted_speeds` | `any[]` | Historical/predicted speed profiles for the edge (if available). |
| `access_restrictions` | `any[]` | Time-based or conditional access restrictions on this edge. |

---

### EdgeID Object

Identifies an edge within Valhalla's hierarchical tile system:

| Field | Type | Description |
|-------|------|-------------|
| `value` | `number` | Raw 64-bit integer edge identifier. |
| `id` | `number` | Edge index within its tile. |
| `tile_id` | `number` | Tile identifier in the Valhalla tile hierarchy. |
| `level` | `number` | Tile hierarchy level (`0` = highway, `1` = arterial, `2` = local). |

---

### EdgeEdge Object (Road Segment Attributes)

Detailed road attributes for the matched edge:

| Field | Type | Description |
|-------|------|-------------|
| `forward` | `boolean` | Whether this edge is traversed in the forward direction relative to the OSM way geometry. |
| `classification` | `Classification` | Road classification details (road class, surface, use type). |
| `access` | `object` | Per-mode access flags (e.g., `{"auto": true, "bicycle": false, "pedestrian": true}`). |
| `start_restriction` | `object` | Access restriction flags at the start of the edge per travel mode. |
| `end_restriction` | `object` | Access restriction flags at the end of the edge per travel mode. |
| `lane_count` | `number` | Number of lanes on this road segment. |
| `speeds` | `Speeds` | Speed information (default, free-flow, constrained-flow, predicted). |
| `toll` | `boolean` | Whether this road segment is a toll road. |
| `bridge` | `boolean` | Whether this segment is a bridge. |
| `tunnel` | `boolean` | Whether this segment runs through a tunnel. |
| `round_about` | `boolean` | Whether this segment is part of a roundabout. |
| `traffic_signal` | `boolean` | Whether there is a traffic signal at the start of this edge. |
| `stop_sign` | `boolean` | Whether there is a stop sign at the start of this edge. |
| `yield_sign` | `boolean` | Whether there is a yield sign at the start of this edge. |
| `deadend` | `boolean` | Whether this edge leads to a dead end. |
| `not_thru` | `boolean` | Whether this edge is marked as not-through traffic (access only). |
| `destination_only` | `boolean` | Whether access is restricted to destinations only. |
| `country_crossing` | `boolean` | Whether this edge crosses an international border. |
| `seasonal` | `boolean` | Whether this road is seasonally closed (e.g., mountain passes in winter). |
| `has_sign` | `boolean` | Whether this edge has road signs data associated. |
| `bike_network` | `boolean` | Whether this edge is part of a designated bicycle network. |
| `cycle_lane` | `string` | Type of cycle lane: `"none"`, `"shared"`, `"dedicated"`, `"separated"`. |
| `sidewalk_left` | `boolean` | Whether there is a sidewalk on the left side of this road. |
| `sidewalk_right` | `boolean` | Whether there is a sidewalk on the right side of this road. |
| `truck_route` | `boolean` | Whether this edge is designated as a truck route. |
| `sac_scale` | `string` | SAC hiking difficulty scale for hiking paths (e.g., `"hiking"`, `"mountain_hiking"`). |
| `access_restriction` | `boolean` | Whether there are access restrictions on this edge. |
| `part_of_complex_restriction` | `boolean` | Whether this edge is part of a complex turn restriction. |
| `geo_attributes` | `GeoAttributes` | Geometric attributes of the edge (length, slope, curvature). |
| `end_node` | `EdgeID` | Identifier of the node at the end of this directed edge. |

---

### Classification Object

| Field | Type | Description |
|-------|------|-------------|
| `classification` | `string` | Road class: `"motorway"`, `"trunk"`, `"primary"`, `"secondary"`, `"tertiary"`, `"residential"`, `"service"`, `"unclassified"`. |
| `use` | `string` | Road use type: `"road"`, `"ramp"`, `"turn_channel"`, `"cycleway"`, `"footway"`, `"path"`, `"steps"`, `"driveway"`, `"parking_aisle"`. |
| `surface` | `string` | Road surface type: `"paved_smooth"`, `"paved"`, `"paved_rough"`, `"compacted"`, `"dirt"`, `"gravel"`, `"path"`, `"impassable"`. |
| `link` | `boolean` | Whether this is a link road (on/off ramp or connector). |
| `internal` | `boolean` | Whether this edge is internal to an intersection. |

---

### Speeds Object

| Field | Type | Description |
|-------|------|-------------|
| `default` | `number` | Default posted speed limit or estimated speed in km/h. |
| `free_flow` | `number` | Free-flow speed estimate in km/h (no congestion). |
| `constrained_flow` | `number` | Speed estimate under typical traffic congestion in km/h. |
| `predicted` | `boolean` | Whether predicted (time-of-day historical) speed data is available. |
| `type` | `string` | Speed data source type (e.g., `"constrained"`, `"freeflow"`, `"tagged"`). |

---

### GeoAttributes Object

| Field | Type | Description |
|-------|------|-------------|
| `length` | `number` | Length of the edge in kilometers. |
| `weighted_grade` | `number` | Weighted average grade (elevation change / distance). Positive = uphill. |
| `max_up_slope` | `number` | Maximum uphill grade along the edge (degrees or percent, depending on configuration). |
| `max_down_slope` | `number` | Maximum downhill grade along the edge. |
| `curvature` | `number` | Curvature index (0 = straight, higher = more curved). |

---

### EdgeInfo Object

| Field | Type | Description |
|-------|------|-------------|
| `names` | `string[]` | Street names associated with this edge. |
| `way_id` | `number` | OpenStreetMap way ID this edge was derived from. |
| `speed_limit` | `number` | Posted speed limit in km/h (0 if not available). |
| `shape` | `string` | Polyline-encoded geometry of this edge (for visualization). |
| `mean_elevation` | `number \| null` | Mean elevation of the edge in meters (null if elevation data unavailable). |
| `bike_network` | `BikeNetwork` | Bicycle network membership flags. |

---

### BikeNetwork Object

| Field | Type | Description |
|-------|------|-------------|
| `national` | `boolean` | Part of a national bicycle network. |
| `regional` | `boolean` | Part of a regional bicycle network. |
| `local` | `boolean` | Part of a local bicycle network. |
| `mountain` | `boolean` | Part of a mountain bike network. |

---

## Example Response

```json
[
  {
    "input_lat": 40.7484,
    "input_lon": -73.9967,
    "nodes": [],
    "edges": [
      {
        "correlated_lat": 40.74841,
        "correlated_lon": -73.99668,
        "side_of_street": "right",
        "percent_along": 0.52,
        "distance": 3.1,
        "heading": 91,
        "outbound_reach": 4,
        "inbound_reach": 3,
        "edge_id": { "value": 7812374623, "id": 1024, "tile_id": 88456, "level": 2 },
        "edge": {
          "forward": true,
          "classification": {
            "classification": "tertiary",
            "use": "road",
            "surface": "paved_smooth",
            "link": false,
            "internal": false
          },
          "access": { "auto": true, "bicycle": true, "pedestrian": true },
          "lane_count": 2,
          "speeds": {
            "default": 40,
            "free_flow": 45,
            "constrained_flow": 20,
            "predicted": true,
            "type": "constrained"
          },
          "toll": false,
          "bridge": false,
          "tunnel": false,
          "round_about": false
        },
        "edge_info": {
          "names": ["W 34th Street"],
          "way_id": 123456789,
          "speed_limit": 40,
          "shape": "k{~wFpqubM...",
          "mean_elevation": null,
          "bike_network": {
            "national": false,
            "regional": false,
            "local": true,
            "mountain": false
          }
        },
        "live_speed": {},
        "predicted_speeds": [],
        "access_restrictions": []
      }
    ]
  }
]
```

---

## Use Cases

| Scenario | Notes |
|----------|-------|
| **Road attribute inspection** | Check speed limits, surface type, lane count, and road class at any coordinate. |
| **Access validation** | Verify whether a given point is accessible to a specific vehicle type (truck, bicycle, etc.) before routing. |
| **Turn restriction detection** | Identify edges that are part of complex turn restrictions for custom routing logic. |
| **Speed data access** | Retrieve free-flow and congestion-aware speed estimates for road segments. |
| **Snapping GPS coordinates** | Find the nearest road point and its OSM way ID for geo-processing pipelines. |
| **Elevation & gradient analysis** | Use `geo_attributes.weighted_grade` to find hilly road segments. |
| **Bicycle infrastructure audit** | Check `cycle_lane`, `bike_network`, and `sidewalk_left/right` for active transportation planning. |
| **Map data QA** | Inspect OSM-derived attributes (way IDs, names, access flags) for data quality validation. |
| **Connectivity analysis** | Use `inbound_reach` and `outbound_reach` to identify dead ends or poorly connected road segments. |

---

## Notes

- When `verbose: false`, the response is much smaller and only contains snapped coordinates without edge/node details.
- The Locate API is the best way to "look up" road network properties at an arbitrary point without computing a full route.
- Multiple locations can be queried in a single request; the response array preserves input order.
- The `edge_id` fields use Valhalla's internal tile-based identifier system. `tile_id` and `level` together identify the tile; `id` is the edge index within that tile.
- Authentication (Basic Auth) is passed via the `Authorization` header when configured in Settings.
