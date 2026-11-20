# Roles API

The example base URL is `http://localhost:3000`. These endpoints are public.

| Method   | Path          | Description   | Success          |
| -------- | ------------- | ------------- | ---------------- |
| `GET`    | `/roles`      | List roles    | `200 OK`         |
| `POST`   | `/roles`      | Create a role | `201 Created`    |
| `GET`    | `/roles/{id}` | Get a role    | `200 OK`         |
| `PATCH`  | `/roles/{id}` | Update a role | `200 OK`         |
| `DELETE` | `/roles/{id}` | Delete a role | `204 No Content` |

Replace `{id}` with the role UUID returned in `data.id`.

## Request body

Send JSON with `Content-Type: application/json` for `POST` and `PATCH`. The API rejects unknown fields.

| Field         | Required on create | Rules                                                                                                                                      |
| ------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`        | Yes                | String of up to 255 characters with at least one non-whitespace character.                                                                 |
| `slug`        | Yes                | Unique slug of up to 255 characters. Use lowercase ASCII letters and digits, with single hyphens between groups, as in `content-reviewer`. |
| `description` | No                 | String of up to 65,535 UTF-8 bytes.                                                                                                        |

For `PATCH`, send only the fields you want to change. An empty object returns the current record.

## List roles

```http
GET /roles HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with an array under `data`. The array is empty when there are no records.

## Create a role

```http
POST /roles HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Content Reviewer",
  "slug": "content-reviewer",
  "description": "Reviews submitted content."
}
```

Returns `201 Created` with the new role under `data`.

```json
{
  "data": {
    "id": "8ef155da-8329-4eb1-8b2a-6eac8e441002",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z",
    "disabled": false,
    "name": "Content Reviewer",
    "slug": "content-reviewer",
    "description": "Reviews submitted content."
  }
}
```

On create, an omitted or empty `description` is returned as `null`.

## Get a role

```http
GET /roles/{id} HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with the role under `data`, using the same object shape as the create response.

## Update a role

```http
PATCH /roles/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "description": "Reviews and approves submitted content."
}
```

Returns `200 OK` with the updated role under `data`, using the same object shape as the create response.

## Delete a role

```http
DELETE /roles/{id} HTTP/1.1
Host: localhost:3000
```

Returns `204 No Content` with an empty body.

## Errors

Error responses contain `success: false`, `code`, and `message`. Field validation errors can include a `details` array.

| Status                     | Code                | When it occurs                                                                                               |
| -------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `400 Bad Request`          | `BAD_REQUEST`       | The JSON is malformed or the `PATCH` path ID is invalid.                                                     |
| `404 Not Found`            | `NOT_FOUND`         | The requested role does not exist.                                                                           |
| `409 Conflict`             | `CONFLICT`          | The slug already exists, or a [user-role assignment](user-roles.md) still references the role being deleted. |
| `413 Payload Too Large`    | `PAYLOAD_TOO_LARGE` | The request body exceeds the parser limit.                                                                   |
| `422 Unprocessable Entity` | `VALIDATION_ERROR`  | The JSON body violates the field rules.                                                                      |
