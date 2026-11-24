# Users API

The example base URL is `http://localhost:3000`. These endpoints are public.

| Method   | Path          | Description                               | Success          |
| -------- | ------------- | ----------------------------------------- | ---------------- |
| `GET`    | `/users`      | List users                                | `200 OK`         |
| `POST`   | `/users`      | Create a user and return created user DTO | `201 Created`    |
| `GET`    | `/users/{id}` | Get a user                                | `200 OK`         |
| `PATCH`  | `/users/{id}` | Update a user                             | `204 No Content` |
| `DELETE` | `/users/{id}` | Delete a user                             | `204 No Content` |

Replace `{id}` with the user UUID returned in `data.id`.

## Request body

Send JSON with `Content-Type: application/json` for `POST` and `PATCH`. The API rejects unknown fields.

| Field      | Required on create | Rules                                                                                                    |
| ---------- | ------------------ | -------------------------------------------------------------------------------------------------------- |
| `name`     | Yes                | String of up to 255 characters with at least one non-whitespace character.                               |
| `email`    | Yes                | Unique email address of up to 255 characters after trimming. The API stores it in lowercase.             |
| `password` | Yes                | String of up to 255 characters with at least one non-whitespace character. Use it as a write-only field. |

For `PATCH`, send only the fields you want to change. An empty object returns the current record.

## List users

```http
GET /users HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with an array under `data`. The array is empty when there are no records.

## Create a user

```http
POST /users HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "ExamplePass123!"
}
```

Returns `201 Created` with the new user under `data`.

```json
{
  "data": {
    "id": "8ef155da-8329-4eb1-8b2a-6eac8e441001",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z",
    "disabled": false,
    "name": "Alex Morgan",
    "email": "alex@example.com"
  }
}
```

## Get a user

```http
GET /users/{id} HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with the user under `data`, using the same object shape as the create response.

## Update a user

```http
PATCH /users/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Alex Rivera"
}
```

Returns `204 No Content` with an empty body.

## Delete a user

```http
DELETE /users/{id} HTTP/1.1
Host: localhost:3000
```

Returns `204 No Content` with an empty body.

## Errors

Error responses contain `success: false`, `code`, and `message`. Field validation errors can include a `details` array.

| Status                     | Code                | When it occurs                                                                                                |
| -------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `400 Bad Request`          | `BAD_REQUEST`       | The JSON is malformed or the `PATCH` path ID is invalid.                                                      |
| `404 Not Found`            | `NOT_FOUND`         | The requested user does not exist.                                                                            |
| `409 Conflict`             | `CONFLICT`          | The email already exists, or a [user-role assignment](user-roles.md) still references the user being deleted. |
| `413 Payload Too Large`    | `PAYLOAD_TOO_LARGE` | The request body exceeds the parser limit.                                                                    |
| `422 Unprocessable Entity` | `VALIDATION_ERROR`  | The JSON body violates the field rules.                                                                       |
