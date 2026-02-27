# Isochrone API

## Overview

The Isochrone API calculates reachable areas from one or more origin points within specified time or distance thresholds. It returns GeoJSON polygons (contours) that represent the boundary of how far you can travel from a given location in a given amount of time or distance. This is used by the **Isochrone** view in Valhalla Studio.

An isochrone (from Greek: "iso" = equal, "chronos" = time) is a line that connects all points reachable in the same travel time. A single API call can return multiple nested contours representing different time/distance bands.

---

## Endpoint

```
GET {valhallaUrl}/isochrone?json=<encoded_payload>
```

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/isochrone` |
| Body format | JSON passed as a URL query parameter (`json=`) |
| Response format | `application/json` (GeoJSON FeatureCollection) |

---

## Request Parameters

### Top-Level Fields

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locations` | `Location[]` | Yes | Array of origin points from which reachability is calculated. Typically one location, but multiple are supported. |
| `costing` | `string` | Yes | Travel mode / costing model to determine movement constraints. |
| `costing_options` | `object` | No | Fine-grained options for the selected costing model (same as Route API). |
| `contours` | `Contour[]` | Yes | Array of contour definitions specifying time or distance thresholds and display colors. |
| `polygons` | `boolean` | No | If `true`, returns polygon features. If `false`, returns linestring contours. Default: `false`. |
| `denoise` | `number` | No | Value between `0` and `1` to remove small, disconnected contour islands. `1.0` = keep only the largest contour, `0` = keep all. Default: `1.0`. |
| `generalize` | `number` | No | Tolerance in meters for the Douglas-Peucker polygon simplification algorithm. Higher = simpler/smoother polygons. |
| `show_locations` | `boolean` | No | If `true`, input locations are included as `Point` features in the GeoJSON response. |
| `id` | `string` | No | Optional identifier echoed back in the response. |
| `date_time` | `object` | No | Departure/arrival date and time for time-dependent isochrones. |

---

### Location Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lat` | `number` | Yes | Latitude of the origin in decimal degrees (WGS84). |
| `lon` | `number` | Yes | Longitude of the origin in decimal degrees (WGS84). |
| `type` | `string` | No | Location type. For isochrones this is typically `"break"` (default). |

---

### Contour Object

Each contour defines one reachability boundary. Multiple contours are returned as nested GeoJSON features.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `time` | `number` | Conditional | Travel time threshold in **minutes**. Required if `metric` is `"time"` or not specified. |
| `distance` | `number` | Conditional | Travel distance threshold in **kilometers**. Required if `metric` is `"distance"`. |
| `color` | `string` | No | Hex color code (without `#`) for styling the contour in GeoJSON properties (e.g., `"D95151"`). Used as a rendering hint. |

> **Note:** You cannot mix `time` and `distance` contours in a single request. Either all contours use `time` or all use `distance`.

---

### Costing Models

The `costing` field determines the travel mode used to calculate reachability:

| Value | Description |
|-------|-------------|
| `auto` | Automobile — follows road network speed limits. |
| `bicycle` | Cycling — considers bike infrastructure and surface types. |
| `pedestrian` | Walking — uses footpaths, sidewalks, and crossings. |
| `bus` | Bus travel on the road network. |
| `truck` | Heavy goods vehicle routing. |
| `motor_scooter` | Motor scooter / moped routing. |
| `motorcycle` | Motorcycle routing. |

Costing options (identical to those in the Route API) can be passed under `costing_options.<model>`.

---

### Date/Time Object (Optional)

Enables time-dependent isochrones that account for traffic or transit schedules.

| Field | Type | Description |
|-------|------|-------------|
| `type` | `number` | `1` = depart at, `2` = arrive by. |
| `value` | `string` | ISO 8601 date/time string (e.g., `"2024-06-15T08:00"`). |

---

## Example Request

```json
{
  "locations": [
    { "lat": 48.8566, "lon": 2.3522 }
  ],
  "costing": "auto",
  "contours": [
    { "time": 10, "color": "4CBB17" },
    { "time": 20, "color": "FFD700" },
    { "time": 30, "color": "D95151" }
  ],
  "polygons": true,
  "show_locations": true
}
```

This request generates three time-based isochrone polygons from central Paris:
- Green polygon: area reachable within 10 minutes by car
- Yellow polygon: area reachable within 20 minutes by car
- Red polygon: area reachable within 30 minutes by car

**Constructed URL:**
```
GET {valhallaUrl}/isochrone?json={"locations":[{"lat":48.8566,"lon":2.3522}],"costing":"auto","contours":[{"time":10,"color":"4CBB17"},{"time":20,"color":"FFD700"},{"time":30,"color":"D95151"}],"polygons":true}
```

---

## Response

The response is a **GeoJSON FeatureCollection**. Each contour is a `Feature` with either `Polygon` or `LineString` geometry.

### GeoJSON FeatureCollection

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[2.2, 48.8], [2.3, 48.9], ...]]
      },
      "properties": {
        "fill": "#D95151",
        "fillOpacity": 0.33,
        "fill-opacity": 0.33,
        "fillColor": "#D95151",
        "color": "#D95151",
        "contour": 30,
        "opacity": 0.33,
        "metric": "time"
      }
    }
  ]
}
```

### Feature Properties

| Property | Type | Description |
|----------|------|-------------|
| `contour` | `number` | The time (in minutes) or distance (in km) value for this contour. |
| `metric` | `string` | The metric type: `"time"` or `"distance"`. |
| `color` | `string` | Hex color code with `#` prefix (from the request `color` field). |
| `fill` | `string` | Same as `color` — for GeoJSON styling libraries. |
| `fillColor` | `string` | Same as `color` — for Leaflet-compatible rendering. |
| `fillOpacity` | `number` | Recommended fill opacity for polygon rendering (e.g., `0.33`). |
| `opacity` | `number` | Recommended stroke opacity. |

---

## How Valhalla Studio Uses This API

In Valhalla Studio's **Isochrone** view:

1. The user clicks on the map to set an origin point.
2. The user defines one or more contours with a time value (minutes) and a display color.
3. On submit, the app calls the Isochrone API with `costing: "auto"` and the specified contours.
4. The returned GeoJSON is rendered on the map using Leaflet's `GeoJSON` layer with per-contour fill colors.

The contour color is stripped of its `#` prefix before being sent to the API (Valhalla expects the hex string without `#`).

---

## Use Cases

| Scenario | Notes |
|----------|-------|
| **Service area analysis** | Determine how far an ambulance, fire truck, or delivery vehicle can reach within a time window. |
| **Real estate accessibility** | Show which neighborhoods are reachable from a workplace or school within a commute time. |
| **Urban planning** | Visualize accessibility gaps and transit deserts. |
| **Retail catchment areas** | Map the population within N minutes of a store or service location. |
| **Emergency management** | Model evacuation reach zones from a hazard point. |
| **Tourism & hospitality** | Show guests what attractions are reachable on foot or by bike from a hotel. |
| **Competitive analysis** | Compare service coverage areas between two business locations. |
| **Multi-modal accessibility** | Compare reachability by car vs. bicycle vs. foot from the same origin. |

---

## Notes

- Contour `time` values must be in **ascending order** (e.g., 5, 10, 30). Valhalla may return unexpected results if contours are not sorted.
- The maximum contour time varies by Valhalla server configuration but is typically **120 minutes** for auto and **240 minutes** for pedestrian.
- Distance contours are specified in **kilometers**, not miles, regardless of the `units` setting.
- Each contour is a separate GeoJSON `Feature`. Outer contours (larger time values) enclose inner contours.
- The `color` field in the request is a hint for visualization. Valhalla reflects it back in the GeoJSON properties but does not apply it to actual geometry.
- Authentication (Basic Auth) is passed via the `Authorization` header when configured in Settings.
