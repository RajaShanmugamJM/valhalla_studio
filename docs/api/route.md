# Route API

## Overview

The Route API computes turn-by-turn navigation routes between two or more locations using Valhalla's routing engine. It returns a detailed trip object containing maneuvers, shape geometry (polyline-encoded), summary statistics, and human-readable instructions. This is the core API used by the **Turn-by-Turn** view in Valhalla Studio.

---

## Endpoint

```
GET {valhallaUrl}/route?json=<encoded_payload>
```

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/route` |
| Body format | JSON passed as a URL query parameter (`json=`) |
| Response format | `application/json` |

---

## Request Parameters

The request payload is a JSON object passed via the `json` query parameter.

### Top-Level Fields

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locations` | `Location[]` | Yes | Ordered list of waypoints. At minimum two locations (origin and destination) are required. |
| `costing` | `string` | Yes | Costing model to use for routing. Determines the travel mode. |
| `costing_options` | `object` | No | Fine-grained options scoped to the selected costing model. |
| `units` | `string` | No | Unit system for distances in the response. Accepts `"miles"` or `"kilometers"`. Defaults to `"kilometers"`. |
| `id` | `string` | No | Arbitrary identifier echoed back in the response. Useful for correlating requests with responses. |
| `language` | `string` | No | Language for narrative instructions (e.g., `"en-US"`, `"de-DE"`). Defaults to `"en-US"`. |
| `directions_type` | `string` | No | Level of detail for instructions. Options: `"none"`, `"maneuvers"`, `"instructions"`. |
| `alternates` | `number` | No | Number of alternate routes to return alongside the primary route. |

---

### Location Object

Each entry in the `locations` array represents a waypoint.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lat` | `number` | Yes | Latitude of the waypoint in decimal degrees (WGS84). |
| `lon` | `number` | Yes | Longitude of the waypoint in decimal degrees (WGS84). |
| `type` | `string` | No | Location type. `"break"` creates a stop with full maneuvers. `"via"` is a pass-through point with no stop. `"break_through"` combines both behaviors. Defaults to `"break"`. |
| `heading` | `number` | No | Preferred heading at the location in degrees (0–359). Useful for one-way street entry direction. |
| `heading_tolerance` | `number` | No | Tolerance in degrees for the heading preference. |
| `street` | `string` | No | Street name hint to help snap the location to the correct road. |
| `minimum_reachability` | `number` | No | Minimum number of edges that must be reachable to consider the location routable. |
| `radius` | `number` | No | Search radius in meters for snapping the location to the road network. |

---

### Costing Models

The `costing` field determines the travel mode. Supported values:

| Value | Description |
|-------|-------------|
| `auto` | Standard automobile routing. Prefers highways and major roads. |
| `auto_shorter` | Automobile routing that prefers shorter distance over time. |
| `bicycle` | Bicycle routing. Considers bike-friendly paths, lanes, and surfaces. |
| `bus` | Bus routing (follows road network, disregards transit schedules). |
| `pedestrian` | Walking routing. Uses footways, crossings, and pedestrian paths. |
| `truck` | Routing for heavy goods vehicles. Avoids low bridges, weight limits, etc. |
| `taxi` | Taxi-specific routing (similar to auto but uses taxi-accessible roads). |
| `motor_scooter` | Routing for motor scooters and mopeds. |
| `motorcycle` | Motorcycle routing. |
| `bikeshare` | Mixed pedestrian and bicycle routing for bikeshare scenarios. |
| `multimodal` | Combines transit and pedestrian routing (requires transit data). |

---

### Costing Options

Fine-tune routing behavior per costing model under `costing_options.<model>`:

#### `auto` / `auto_shorter` / `taxi` / `bus`

| Field | Type | Description |
|-------|------|-------------|
| `country_crossing_penalty` | `number` | Added cost (seconds) for crossing a country border. Default: `600`. |
| `maneuver_penalty` | `number` | Cost (seconds) added when a maneuver (turn) is required. |
| `gate_cost` | `number` | Cost (seconds) to pass through a gate. |
| `toll_booth_cost` | `number` | Cost (seconds) at a toll booth. |
| `ferry_cost` | `number` | Cost (seconds) to board a ferry. |
| `use_ferry` | `number` | Willingness to use ferries (0=avoid, 1=prefer). Default: `0.5`. |
| `use_highways` | `number` | Willingness to use highways (0=avoid, 1=prefer). Default: `1.0`. |
| `use_tolls` | `number` | Willingness to pay tolls (0=avoid, 1=prefer). Default: `0.5`. |
| `use_living_streets` | `number` | Willingness to use living streets (0=avoid, 1=prefer). |

#### `bicycle`

| Field | Type | Description |
|-------|------|-------------|
| `bicycle_type` | `string` | Type of bicycle: `"Road"`, `"Hybrid"`, `"City"`, `"Cross"`, `"Mountain"`. |
| `cycling_speed` | `number` | Target cycling speed in km/h. Default varies by bicycle type. |
| `use_roads` | `number` | Preference for regular roads vs. dedicated bike infrastructure (0–1). |
| `use_hills` | `number` | Willingness to use hilly terrain (0=avoid, 1=embrace). |
| `use_ferry` | `number` | Willingness to use ferries (0–1). |

#### `pedestrian`

| Field | Type | Description |
|-------|------|-------------|
| `walking_speed` | `number` | Walking speed in km/h. Default: `5.1`. |
| `walkway_factor` | `number` | Multiplier applied to walkway travel times. Lower = prefer walkways. |
| `sidewalk_factor` | `number` | Multiplier applied to sidewalk travel times. |
| `max_hiking_difficulty` | `number` | Maximum allowed SAC hiking difficulty scale (0–6). |
| `use_ferry` | `number` | Willingness to use ferries (0–1). |

---

## Example Request

```json
{
  "locations": [
    { "lat": 40.7484, "lon": -73.9967 },
    { "lat": 40.7527, "lon": -73.9772 }
  ],
  "costing": "auto",
  "costing_options": {
    "auto": {
      "country_crossing_penalty": 2000
    }
  },
  "units": "miles",
  "id": "my_work_route"
}
```

**Constructed URL:**
```
GET {valhallaUrl}/route?json={"locations":[{"lat":40.7484,"lon":-73.9967},{"lat":40.7527,"lon":-73.9772}],"costing":"auto","units":"miles","id":"my_work_route"}
```

---

## Response

The response contains a `trip` object (and optionally an `id` and `alternates` array).

### Top-Level Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `trip` | `Trip` | The primary route result. |
| `id` | `string` | Echoed identifier from the request. |
| `alternates` | `Alternate[]` | Array of alternate routes (present when `alternates` was requested). |

---

### Trip Object

| Field | Type | Description |
|-------|------|-------------|
| `locations` | `Location[]` | Snapped locations as resolved by the routing engine. |
| `legs` | `Leg[]` | Array of route legs. One leg per pair of consecutive `break` locations. |
| `summary` | `Summary` | Aggregated statistics for the entire trip. |
| `status_message` | `string` | Human-readable status (e.g., `"Found route between points"`). |
| `status` | `number` | Status code. `0` = success. |
| `units` | `string` | Unit system used in the response (`"miles"` or `"kilometers"`). |
| `language` | `string` | Language of the narrative instructions. |

---

### Leg Object

| Field | Type | Description |
|-------|------|-------------|
| `maneuvers` | `Maneuver[]` | Ordered list of driving maneuvers for this leg. |
| `summary` | `Summary` | Statistics for this leg (time, length, etc.). |
| `shape` | `string` | Polyline-encoded geometry of the route leg (precision 6). Decode using `decodeShape()`. |

---

### Maneuver Object

| Field | Type | Description |
|-------|------|-------------|
| `type` | `number` | Maneuver type code (e.g., `1` = left turn, `2` = right turn, `10` = straight, `24` = destination). |
| `instruction` | `string` | Full text navigation instruction (e.g., `"Turn right onto Main St."`). |
| `verbal_pre_transition_instruction` | `string` | Verbal instruction to announce before the maneuver. |
| `verbal_post_transition_instruction` | `string` | Verbal instruction to announce after completing the maneuver. |
| `verbal_succinct_transition_instruction` | `string` | Short verbal instruction for the maneuver. |
| `verbal_transition_alert_instruction` | `string` | Early-warning verbal alert for the upcoming maneuver. |
| `street_names` | `string[]` | Street names associated with this maneuver segment. |
| `time` | `number` | Estimated travel time for this maneuver in seconds. |
| `length` | `number` | Distance of this maneuver in the requested units. |
| `cost` | `number` | Internal routing cost for this maneuver. |
| `begin_shape_index` | `number` | Index into the leg's shape where this maneuver begins. |
| `end_shape_index` | `number` | Index into the leg's shape where this maneuver ends. |
| `travel_mode` | `string` | Travel mode for this maneuver (e.g., `"drive"`, `"walk"`, `"bicycle"`). |
| `travel_type` | `string` | Specific travel type (e.g., `"car"`, `"road"`, `"foot"`). |

---

### Summary Object

| Field | Type | Description |
|-------|------|-------------|
| `time` | `number` | Total travel time in seconds. |
| `length` | `number` | Total distance in the requested units. |
| `cost` | `number` | Internal routing cost. |
| `has_time_restrictions` | `boolean` | Whether the route uses roads with time-based access restrictions. |
| `has_toll` | `boolean` | Whether the route includes toll roads. |
| `has_highway` | `boolean` | Whether the route uses highway segments. |
| `has_ferry` | `boolean` | Whether the route includes a ferry crossing. |
| `min_lat` | `number` | Minimum latitude of the route bounding box. |
| `min_lon` | `number` | Minimum longitude of the route bounding box. |
| `max_lat` | `number` | Maximum latitude of the route bounding box. |
| `max_lon` | `number` | Maximum longitude of the route bounding box. |

---

## Example Response (Abbreviated)

```json
{
  "trip": {
    "locations": [
      { "type": "break", "lat": 40.7484, "lon": -73.9967, "original_index": 0 },
      { "type": "break", "lat": 40.7527, "lon": -73.9772, "original_index": 1 }
    ],
    "legs": [
      {
        "maneuvers": [
          {
            "type": 2,
            "instruction": "Drive east on W 34th Street.",
            "verbal_pre_transition_instruction": "Drive east on West 34th Street for 1.2 miles.",
            "street_names": ["W 34th Street"],
            "time": 245,
            "length": 1.2,
            "cost": 253.0,
            "begin_shape_index": 0,
            "end_shape_index": 42,
            "travel_mode": "drive",
            "travel_type": "car"
          }
        ],
        "summary": {
          "time": 245,
          "length": 1.2,
          "cost": 253.0,
          "has_time_restrictions": false,
          "has_toll": false,
          "has_highway": false,
          "has_ferry": false,
          "min_lat": 40.7484,
          "min_lon": -73.9967,
          "max_lat": 40.7527,
          "max_lon": -73.9772
        },
        "shape": "k{~wFpqubM..."
      }
    ],
    "summary": {
      "time": 245,
      "length": 1.2,
      "cost": 253.0,
      "has_time_restrictions": false,
      "has_toll": false,
      "has_highway": false,
      "has_ferry": false,
      "min_lat": 40.7484,
      "min_lon": -73.9967,
      "max_lat": 40.7527,
      "max_lon": -73.9772
    },
    "status_message": "Found route between points",
    "status": 0,
    "units": "miles",
    "language": "en-US"
  },
  "id": "my_work_route"
}
```

---

## Use Cases

| Scenario | Notes |
|----------|-------|
| **Navigation applications** | Compute turn-by-turn driving, cycling, or walking directions between two or more waypoints. |
| **ETA estimation** | Use `summary.time` and `summary.length` to display estimated arrival time and distance. |
| **Route visualization** | Decode the `shape` field using the polyline-6 algorithm to render the route on a map. |
| **Multi-stop trip planning** | Add intermediate `break` locations to plan multi-leg journeys. |
| **Accessibility routing** | Use `pedestrian` costing with `max_hiking_difficulty` to plan wheelchair-friendly routes. |
| **Logistics & delivery** | Plan truck routes that avoid weight-restricted roads using `truck` costing. |
| **Country border routing** | Apply `country_crossing_penalty` to discourage or penalize cross-border detours. |
| **Alternate route comparison** | Request multiple alternates to present users with route choices. |

---

## Shape Decoding

Route shapes are encoded as polyline strings with precision 6. Use the built-in `decodeShape(shape, precision?)` utility in Valhalla Studio to convert them to `[lat, lng]` coordinate arrays suitable for map rendering:

```typescript
const coordinates = valhallaStore.decodeShape(leg.shape);
// Returns: [[lat1, lng1], [lat2, lng2], ...]
```

---

## Error Responses

Valhalla returns errors as JSON with an `error` field and an `error_code`:

```json
{
  "error_code": 154,
  "error": "Path distance exceeds the max distance limit",
  "status_code": 400,
  "status": "Bad Request"
}
```

Common error codes:

| Code | Description |
|------|-------------|
| `100` | Failed to parse request JSON |
| `110` | Insufficiently specified required parameter `locations` |
| `120` | Insufficiently specified required parameter `costing` |
| `154` | Path distance exceeds the max distance limit |
| `171` | No suitable edges found for location |

---

## Notes

- The Route API is called via `GET` with the JSON payload URL-encoded in the `json` query parameter (not a `POST` body).
- Route shape geometry uses **polyline encoding with precision 6** (not the standard Google precision 5).
- Authentication (Basic Auth) is passed via the `Authorization` header when configured in Settings.
