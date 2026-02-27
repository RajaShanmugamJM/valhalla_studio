# Valhalla API Documentation

This directory contains detailed documentation for each API endpoint supported by Valhalla Studio. Each document covers the API's purpose, request parameters, response structure, example payloads, and common use cases.

---

## Supported APIs

| API | Endpoint | HTTP Method | View in Studio | Description |
|-----|----------|-------------|----------------|-------------|
| [Route](./route.md) | `/route` | `GET` | Turn-by-Turn | Turn-by-turn routing between two or more locations |
| [Isochrone](./isochrone.md) | `/isochrone` | `GET` | Isochrone | Reachable area polygons within time/distance thresholds |
| [Matrix](./matrix.md) | `/sources_to_targets` | `GET` | Matrix | Travel time/distance matrix for multiple origins and destinations |
| [Trace Route](./trace_route.md) | `/trace_route` | `POST` | Trace Route | Map matching — snaps raw GPS traces to the road network |
| [Locate](./locate.md) | `/locate` | `GET` | — | Road network inspection and coordinate snapping |
| [Status](./status.md) | `/status` | `GET` | Settings | Real-time health check to verify endpoint accessibility |

---

## API Overview

### [Route API](./route.md)
Computes turn-by-turn navigation routes between waypoints. Returns detailed maneuvers, encoded route geometry, travel time, and distance. Supports multiple costing models (auto, bicycle, pedestrian, truck, and more) and optional alternate routes.

**Key use cases:** Navigation apps, ETA estimation, multi-stop trip planning, logistics routing.

---

### [Isochrone API](./isochrone.md)
Generates GeoJSON polygons representing areas reachable from a point within specified time or distance contours. Supports multiple nested contours with custom colors, polygon simplification, and time-dependent calculations.

**Key use cases:** Service area mapping, commute shed analysis, accessibility planning, urban planning.

---

### [Matrix API](./matrix.md)
Computes an M × N matrix of travel times and distances between sets of origin (source) and destination (target) locations. Returns encoded route shapes for every source-target pair.

**Key use cases:** TSP/VRP solvers, nearest facility search, delivery optimization, fleet dispatch.

---

### [Trace Route API](./trace_route.md)
Matches a sequence of raw GPS coordinates to the most likely path on the road network (map matching). Returns a clean routed trip with turn-by-turn maneuvers. Handles noisy or sparse GPS data via Hidden Markov Model matching.

**Key use cases:** Fleet telematics, GPS track cleansing, rideshare trip reconstruction, activity analysis.

---

### [Locate API](./locate.md)
Snaps coordinates to the road network and returns detailed attributes about the nearest road edges and intersections. Provides road classification, speed data, access flags, surface type, lane count, and more.

**Key use cases:** Road attribute inspection, access validation, speed data retrieval, coordinate snapping, map data QA.

---

### [Status API](./status.md)
Provides a quick heartbeat mechanism to check if the Valhalla server is running and accessible. Frequently used by load balancers, container orchestration tools, or API gateways to determine service health.

**Key use cases:** Endpoint validation, health checks, uptime monitoring, orchestrator probes.

---

## Authentication

All APIs support optional **Basic Authentication**. When enabled in Valhalla Studio's Settings, an `Authorization: Basic <base64(username:password)>` header is included in every request.

---

## Common Parameters

### Location Object
All APIs share a common location structure:

```json
{ "lat": 40.7484, "lon": -73.9967 }
```

| Field | Type | Description |
|-------|------|-------------|
| `lat` | `number` | Latitude in decimal degrees (WGS84) |
| `lon` | `number` | Longitude in decimal degrees (WGS84) |

### Costing Models
The `costing` parameter is shared across all routing APIs:

| Value | Description |
|-------|-------------|
| `auto` | Automobile routing |
| `bicycle` | Cycling routing |
| `pedestrian` | Walking routing |
| `bus` | Bus routing |
| `truck` | Heavy goods vehicle routing |
| `motor_scooter` | Motor scooter routing |
| `motorcycle` | Motorcycle routing |
| `multimodal` | Combined transit + pedestrian (requires transit data) |

---

## Shape Encoding

Route shapes in API responses use **polyline-6 encoding** (precision 6). Use Valhalla Studio's built-in `decodeShape()` utility to convert them to coordinate arrays:

```typescript
import { useValhallaStore } from '@/stores/valhalla';

const store = useValhallaStore();
const coordinates = store.decodeShape(encodedShape);
// Returns: [[lat1, lng1], [lat2, lng2], ...]
```

---

## Further Reading

- [Valhalla Official Documentation](https://valhalla.github.io/valhalla/)
- [Valhalla GitHub Repository](https://github.com/valhalla/valhalla)
- [OpenStreetMap Wiki — Valhalla](https://wiki.openstreetmap.org/wiki/Valhalla)
