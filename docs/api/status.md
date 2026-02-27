# Status API

The `/status` endpoint provides a way to check the health and operational status of the Valhalla routing instance. It is commonly used for monitoring, readiness probes, and ensuring that the service is accessible and functioning correctly.

## Endpoint

`GET /status`

## Description

This endpoint returns varying levels of detail depending on the setup of your Valhalla server. Typically, it simply returns a 200 OK HTTP status code along with a small JSON payload or simple string indicating success. It does not require complex routing calculations and serves purely as a heartbeat or health check mechanism.

## Example Request

```bash
curl http://localhost:8002/status
```

## Example Response

A healthy Valhalla server may return something like:

```json
{
  "status": "ok",
  "version": "3.1.4"
}
```

*(Note: Exact response format depends on the Valhalla version and configuration, but a 200 OK HTTP status is the primary indicator of accessibility.)*

## Usage in Valhalla Studio

In Valhalla Studio, the `/status` endpoint is invoked automatically when saving the Valhalla Server URL in the Settings drawer (along with Basic Authentication credentials if enabled). This validation ensures that the configured instance is reachable before persisting the configuration, preventing errors during subsequent routing requests.
