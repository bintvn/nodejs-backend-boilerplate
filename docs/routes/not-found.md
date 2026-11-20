# Unmatched Requests

The example base URL is `http://localhost:3000`. Requests that reach the fallback without matching a registered route return `404 Not Found`. This includes requests to an unknown path and requests using an unsupported method on a known path.

## Example request

```http
GET /unknown HTTP/1.1
Host: localhost:3000
```

## Response

Returns `404 Not Found` with the requested path in `message`.

```json
{
  "success": false,
  "code": "NOT_FOUND",
  "message": "Route '/unknown' is not found"
}
```
