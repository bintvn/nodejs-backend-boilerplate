# User Roles API

The example base URL is `http://localhost:3000`. These endpoints are public.

| Method   | Path               | Description                   | Success          |
| -------- | ------------------ | ----------------------------- | ---------------- |
| `GET`    | `/user-roles`      | List user-role assignments    | `200 OK`         |
| `POST`   | `/user-roles`      | Create a user-role assignment | `201 Created`    |
| `GET`    | `/user-roles/{id}` | Get a user-role assignment    | `200 OK`         |
| `PATCH`  | `/user-roles/{id}` | Update a user-role assignment | `200 OK`         |
| `DELETE` | `/user-roles/{id}` | Delete a user-role assignment | `204 No Content` |

Replace `{id}` with the user-role assignment UUID returned in `data.id`.

## Request body

Send JSON with `Content-Type: application/json` for `POST` and `PATCH`. The API rejects unknown fields.

| Field    | Required on create | Rules                                 |
| -------- | ------------------ | ------------------------------------- |
| `userId` | Yes                | UUID of an existing [user](users.md). |
| `roleId` | Yes                | UUID of an existing [role](roles.md). |

For `PATCH`, send only the fields you want to change. An empty object returns the current record. Replace the example relationship UUIDs with IDs from your API.

## List user-role assignments

```http
GET /user-roles HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with an array under `data`. The array is empty when there are no records.

## Create a user-role assignment

```http
POST /user-roles HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "userId": "8ef155da-8329-4eb1-8b2a-6eac8e441001",
  "roleId": "8ef155da-8329-4eb1-8b2a-6eac8e441002"
}
```

Returns `201 Created` with the new user-role assignment under `data`.

```json
{
  "data": {
    "id": "8ef155da-8329-4eb1-8b2a-6eac8e441004",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z",
    "disabled": false,
    "user": {
      "id": "8ef155da-8329-4eb1-8b2a-6eac8e441001",
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-15T10:00:00.000Z",
      "disabled": false,
      "name": "Alex Morgan",
      "email": "alex@example.com"
    },
    "role": {
      "id": "8ef155da-8329-4eb1-8b2a-6eac8e441002",
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-15T10:00:00.000Z",
      "disabled": false,
      "name": "Content Reviewer",
      "slug": "content-reviewer",
      "description": "Reviews submitted content."
    }
  }
}
```

The response embeds the related `user` and `role` objects. Use the assignment UUID from `data.id` in the request path.

## Get a user-role assignment

```http
GET /user-roles/{id} HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with the user-role assignment under `data`, using the same object shape as the create response.

## Update a user-role assignment

```http
PATCH /user-roles/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "roleId": "8ef155da-8329-4eb1-8b2a-6eac8e441006"
}
```

Returns `200 OK` with the updated user-role assignment under `data`, using the same object shape as the create response.

## Delete a user-role assignment

```http
DELETE /user-roles/{id} HTTP/1.1
Host: localhost:3000
```

Returns `204 No Content` with an empty body.

## Errors

Error responses contain `success: false`, `code`, and `message`. Field validation errors can include a `details` array.

| Status                     | Code                | When it occurs                                                                                                 |
| -------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `400 Bad Request`          | `BAD_REQUEST`       | The JSON is malformed or the `PATCH` path ID is invalid.                                                       |
| `404 Not Found`            | `NOT_FOUND`         | The requested user-role assignment does not exist.                                                             |
| `409 Conflict`             | `CONFLICT`          | A [module-user-role assignment](module-user-roles.md) still references the user-role assignment being deleted. |
| `413 Payload Too Large`    | `PAYLOAD_TOO_LARGE` | The request body exceeds the parser limit.                                                                     |
| `422 Unprocessable Entity` | `VALIDATION_ERROR`  | The JSON body violates the field rules or references a record that does not exist.                             |
