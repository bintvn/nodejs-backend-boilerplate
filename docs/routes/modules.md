# Modules API

The example base URL is `http://localhost:3000`. These endpoints are public.

| Method   | Path            | Description     | Success          |
| -------- | --------------- | --------------- | ---------------- |
| `GET`    | `/modules`      | List modules    | `200 OK`         |
| `POST`   | `/modules`      | Create a module | `201 Created`    |
| `GET`    | `/modules/{id}` | Get a module    | `200 OK`         |
| `PATCH`  | `/modules/{id}` | Update a module | `200 OK`         |
| `DELETE` | `/modules/{id}` | Delete a module | `204 No Content` |

Replace `{id}` with the module UUID returned in `data.id`.

## Request body

Send JSON with `Content-Type: application/json` for `POST` and `PATCH`. The API rejects unknown fields.

| Field         | Required on create | Rules                                                                                                                                      |
| ------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`        | Yes                | String of up to 255 characters with at least one non-whitespace character.                                                                 |
| `slug`        | Yes                | Unique slug of up to 255 characters. Use lowercase ASCII letters and digits, with single hyphens between groups, as in `content-reviewer`. |
| `description` | No                 | String of up to 65,535 UTF-8 bytes.                                                                                                        |

For `PATCH`, send only the fields you want to change. An empty object returns the current record.

## List modules

```http
GET /modules HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with an array under `data`. The array is empty when there are no records.

## Create a module

```http
POST /modules HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Content Library",
  "slug": "content-library",
  "description": "Stores submitted content."
}
```

Returns `201 Created` with the new module under `data`.

```json
{
  "data": {
    "id": "8ef155da-8329-4eb1-8b2a-6eac8e441003",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z",
    "disabled": false,
    "name": "Content Library",
    "slug": "content-library",
    "description": "Stores submitted content."
  }
}
```

On create, an omitted `description` is returned as `null`.

## Get a module

```http
GET /modules/{id} HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with the module under `data`, using the same object shape as the create response.

## Update a module

```http
PATCH /modules/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "description": "Stores submitted and approved content."
}
```

Returns `200 OK` with the updated module under `data`, using the same object shape as the create response.

## Delete a module

```http
DELETE /modules/{id} HTTP/1.1
Host: localhost:3000
```

Returns `204 No Content` with an empty body.

## Errors

Error responses contain `success: false`, `code`, and `message`. Field validation errors can include a `details` array.

| Status                     | Code                | When it occurs                                                                                                               |
| -------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `400 Bad Request`          | `BAD_REQUEST`       | The JSON is malformed or the `PATCH` path ID is invalid.                                                                     |
| `404 Not Found`            | `NOT_FOUND`         | The requested module does not exist.                                                                                         |
| `409 Conflict`             | `CONFLICT`          | The slug already exists, or a [module-user-role assignment](module-user-roles.md) still references the module being deleted. |
| `413 Payload Too Large`    | `PAYLOAD_TOO_LARGE` | The request body exceeds the parser limit.                                                                                   |
| `422 Unprocessable Entity` | `VALIDATION_ERROR`  | The JSON body violates the field rules.                                                                                      |
