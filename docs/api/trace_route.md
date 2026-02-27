# Trace Route API (Map Matching)

## Overview

The Trace Route API matches a sequence of raw GPS coordinates to the most likely path on the road network. This process is known as **map matching** — it takes noisy, imprecise GPS traces and "snaps" them to real road segments, producing a clean routable path with full turn-by-turn maneuvers, road attributes, and encoded geometry.

This is used by the **Trace Route** view in Valhalla Studio, where users can paste raw GPS traces as JSON and visualize the matched route on the map.

---

## Endpoint

```
POST {valhallaUrl}/trace_route
```

| Property | Value |
|----------|-------|
| Method | `POST` |
| Path | `/trace_route` |
| Request body | `application/json` |
| Response format | `application/json` |

> Unlike the Route, Matrix, and Isochrone APIs, Trace Route uses `POST` with a JSON body rather than a `GET` with a `json=` query parameter.

---

## Request Parameters

### Top-Level Fields

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `shape` | `Shape[]` | Yes | Ordered array of GPS trace points to be matched to the road network. |
| `costing` | `string` | Yes | Travel mode for map matching. Determines which road types are eligible. |
| `costing_options` | `object` | No | Fine-grained options for the selected costing model. |
| `shape_match` | `string` | No | Matching algorithm to use. Controls the trade-off between speed and accuracy. Default: `"walk_or_snap"`. |
| `units` | `string` | No | Unit system for distances in the response. Options: `"miles"`, `"kilometers"`. Default: `"kilometers"`. |
| `id` | `string` | No | Optional identifier echoed back in the response. |
| `begin_time` | `string` | No | ISO 8601 timestamp of the first GPS point. Used for time-dependent matching. |
| `durations` | `number[]` | No | Array of time durations (seconds) between consecutive GPS points. Improves matching quality. |
| `use_timestamps` | `boolean` | No | If `true`, timestamps encoded in the `shape` points are used for timing. |
| `trace_options` | `object` | No | Advanced options for controlling map-matching behavior (search radius, interpolation, etc.). |

---

### Shape Object

Each entry in the `shape` array represents one raw GPS measurement.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lat` | `number` | Yes | Latitude of the GPS point in decimal degrees (WGS84). |
| `lon` | `number` | Yes | Longitude of the GPS point in decimal degrees (WGS84). |
| `type` | `string` | No | Point type. `"break"` creates a routing stop at this point (produces maneuvers). `"via"` is a pass-through GPS sample with no stop. Default: `"break"`. |
| `original_index` | `number` | No | Original index of this point in the input sequence. Returned in the response for correlation. |
| `time` | `number` | No | Unix timestamp (seconds) of when this GPS reading was recorded. Used when `use_timestamps: true`. |

---

### Shape Match Algorithms

The `shape_match` parameter controls how the GPS trace is matched to the road network:

| Value | Description |
|-------|-------------|
| `"edge_walk"` | Strict matching — each GPS point must correspond to an adjacent road edge. Fast but requires clean, dense GPS data. |
| `"map_snap"` | Full Hidden Markov Model (HMM) map matching. Handles noisy, sparse, or out-of-order GPS data. More accurate but slower. |
| `"walk_or_snap"` | Tries `edge_walk` first; falls back to `map_snap` if `edge_walk` fails. **Default.** Balances speed and robustness. |

---

### Costing Models

| Value | Description |
|-------|-------------|
| `auto` | Match trace to roads accessible by car. |
| `bicycle` | Match trace to bicycle-accessible paths. |
| `pedestrian` | Match trace to walkable paths and footways. |
| `bus` | Match trace to bus-accessible road network. |
| `truck` | Match trace to truck-accessible roads. |
| `motor_scooter` | Match trace to roads accessible by motor scooter. |
| `motorcycle` | Match trace to motorcycle-accessible roads. |

---

### Trace Options Object (Advanced)

| Field | Type | Description |
|-------|------|-------------|
| `search_radius` | `number` | Maximum search radius (meters) around each GPS point when snapping to roads. Default: `50`. |
| `gps_accuracy` | `number` | Estimated GPS measurement accuracy in meters. Influences the HMM emission probability. Default: `5`. |
| `breakage_distance` | `number` | Distance (meters) at which a GPS gap is considered a route break rather than a missed segment. Default: `2000`. |
| `interpolation_distance` | `number` | Minimum distance (meters) between interpolated GPS points along matched edges. |
| `turn_penalty_factor` | `number` | Penalty multiplier applied to U-turns during matching (0.0 = no penalty, higher = discourage U-turns). Default: `0`. |

---

## Example Request

```json
{
  "shape": [
    { "lat": 40.7484, "lon": -73.9967, "type": "break" },
    { "lat": 40.7490, "lon": -73.9950, "type": "via" },
    { "lat": 40.7498, "lon": -73.9935, "type": "via" },
    { "lat": 40.7510, "lon": -73.9910, "type": "via" },
    { "lat": 40.7527, "lon": -73.9772, "type": "break" }
  ],
  "costing": "auto",
  "shape_match": "walk_or_snap"
}
```

**HTTP Request:**
```http
POST {valhallaUrl}/trace_route
Content-Type: application/json

{
  "shape": [...],
  "costing": "auto",
  "shape_match": "walk_or_snap"
}
```

---

## Response

The response has the same structure as the Route API — a `trip` object containing legs, maneuvers, shape geometry, and summary statistics. Alternate matched paths may also be returned.

### Top-Level Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `trip` | `Trip` | The primary map-matched route. |
| `alternates` | `Alternate[]` | Alternative matched routes (if any). |
| `id` | `string` | Echoed identifier from the request. |

---

### Trip Object

Same structure as the Route API response:

| Field | Type | Description |
|-------|------|-------------|
| `locations` | `Location[]` | Snapped/matched locations corresponding to `break`-type shape points. |
| `legs` | `Leg[]` | Route legs between consecutive `break` points. |
| `summary` | `Summary` | Aggregated trip statistics. |
| `status_message` | `string` | Human-readable status message. |
| `status` | `number` | Status code (`0` = success). |
| `units` | `string` | Unit system used in the response. |
| `language` | `string` | Language of narrative instructions. |

---

### Leg Object

| Field | Type | Description |
|-------|------|-------------|
| `maneuvers` | `Maneuver[]` | Turn-by-turn maneuvers for the matched leg. |
| `summary` | `Summary` | Time, distance, and bounding box for the leg. |
| `shape` | `string` | Polyline-6 encoded geometry of the matched path. |

---

### Maneuver Object (same as Route API)

| Field | Type | Description |
|-------|------|-------------|
| `type` | `number` | Maneuver type code. |
| `instruction` | `string` | Full narrative instruction. |
| `verbal_pre_transition_instruction` | `string` | Pre-maneuver verbal cue. |
| `verbal_post_transition_instruction` | `string` | Post-maneuver verbal cue. |
| `street_names` | `string[]` | Street names for this segment. |
| `time` | `number` | Estimated time in seconds. |
| `length` | `number` | Distance in the requested units. |
| `begin_shape_index` | `number` | Start index in the leg shape. |
| `end_shape_index` | `number` | End index in the leg shape. |
| `travel_mode` | `string` | Travel mode (e.g., `"drive"`). |
| `travel_type` | `string` | Travel type (e.g., `"car"`). |

---

### Summary Object (same as Route API)

| Field | Type | Description |
|-------|------|-------------|
| `time` | `number` | Total travel time in seconds. |
| `length` | `number` | Total distance in requested units. |
| `has_toll` | `boolean` | Route includes toll roads. |
| `has_highway` | `boolean` | Route uses highway segments. |
| `has_ferry` | `boolean` | Route includes ferry crossing. |
| `min_lat` / `max_lat` | `number` | Bounding box latitude range. |
| `min_lon` / `max_lon` | `number` | Bounding box longitude range. |

---

## Example Response (Abbreviated)

```json
{
  "trip": {
    "locations": [
      { "type": "break", "lat": 40.7484, "lon": -73.9967, "original_index": 0 },
      { "type": "break", "lat": 40.7527, "lon": -73.9772, "original_index": 4 }
    ],
    "legs": [
      {
        "maneuvers": [
          {
            "type": 1,
            "instruction": "Drive east on W 34th Street.",
            "street_names": ["W 34th Street"],
            "time": 198,
            "length": 1.1,
            "begin_shape_index": 0,
            "end_shape_index": 38,
            "travel_mode": "drive",
            "travel_type": "car"
          }
        ],
        "summary": { "time": 198, "length": 1.1, "cost": 210.0 },
        "shape": "k{~wFpqubM..."
      }
    ],
    "summary": { "time": 198, "length": 1.1, "has_toll": false },
    "status_message": "Matched route between points",
    "status": 0,
    "units": "kilometers",
    "language": "en-US"
  },
  "alternates": []
}
```

---

## How Valhalla Studio Uses This API

In Valhalla Studio's **Trace Route** view:

1. The user pastes a raw GPS trace as a JSON object into the code editor.
2. On submit, the JSON is sent directly as the POST body to `/trace_route`.
3. The matched route `trip` and `alternates` are decoded and rendered on the map.
4. Alternate routes are displayed in **red** to distinguish them from the primary matched route.

The editor accepts the full Trace Route payload structure, giving users full control over all parameters.

---

## Use Cases

| Scenario | Notes |
|----------|-------|
| **GPS track cleansing** | Remove noise from raw GPS logs and produce a clean, road-snapped path. |
| **Fleet telematics** | Process vehicle GPS tracks to reconstruct actual driven routes for reporting and auditing. |
| **Rideshare trip reconstruction** | Match ride-hailing trips to the road network for billing, analysis, or replay. |
| **Sports & fitness activity analysis** | Match cycling or running GPS tracks to roads and trails for accurate distance and elevation data. |
| **Road condition monitoring** | Snap probe vehicle GPS data to road segments for speed, pothole, or anomaly detection. |
| **Navigation replay** | Reconstruct historical trips for debugging navigation software. |
| **Logistics audit** | Verify that delivery vehicles followed planned routes. |
| **Accident reconstruction** | Map vehicle GPS data to the road network to understand pre-accident trajectories. |

---

## Shape Decoding

Matched route shapes use polyline-6 encoding, identical to the Route API. Use `decodeShape()` in Valhalla Studio:

```typescript
const coordinates = valhallaStore.decodeShape(leg.shape);
// Returns: [[lat1, lng1], [lat2, lng2], ...]
```

---

## Trace Route vs. Route API

| Feature | Route API | Trace Route API |
|---------|-----------|-----------------|
| Input | Explicit origin/destination | Raw GPS trace points |
| Snapping | Snaps two endpoints | Snaps every GPS point to road |
| Purpose | Route planning | GPS track matching |
| HTTP method | `GET` | `POST` |
| Handles noisy GPS | No | Yes (via `map_snap`) |
| Returns maneuvers | Yes | Yes |
| Use case | Navigation | Fleet, analytics, replay |

---

## Error Responses

```json
{
  "error_code": 443,
  "error": "Shape is empty",
  "status_code": 400,
  "status": "Bad Request"
}
```

| Code | Description |
|------|-------------|
| `100` | Failed to parse request JSON |
| `442` | No shape provided |
| `443` | Shape array is empty |
| `444` | Shape match failure — no road found near trace points |
| `445` | Route discontinuity — gap too large between GPS points |

---

## Notes

- Trace Route uses **`POST`** with a JSON body, unlike the other Valhalla APIs which use `GET` with `json=` query parameters.
- For best matching quality, provide GPS points at regular intervals (every 5–30 meters) and include timestamps where available.
- The `"via"` point type generates no maneuver at that GPS sample — use it for intermediate GPS readings between actual stops.
- The `"break"` point type at the start and end of the trace generates full maneuver output.
- Authentication (Basic Auth) is passed via the `Authorization` header when configured in Settings.
