# Module User Roles API

The example base URL is `http://localhost:3000`. These endpoints are public.

| Method   | Path                      | Description                          | Success          |
| -------- | ------------------------- | ------------------------------------ | ---------------- |
| `GET`    | `/module-user-roles`      | List module-user-role assignments    | `200 OK`         |
| `POST`   | `/module-user-roles`      | Create a module-user-role assignment | `201 Created`    |
| `GET`    | `/module-user-roles/{id}` | Get a module-user-role assignment    | `200 OK`         |
| `PATCH`  | `/module-user-roles/{id}` | Update a module-user-role assignment | `200 OK`         |
| `DELETE` | `/module-user-roles/{id}` | Delete a module-user-role assignment | `204 No Content` |

Replace `{id}` with the module-user-role assignment UUID returned in `data.id`.

## Request body

Send JSON with `Content-Type: application/json` for `POST` and `PATCH`. The API rejects unknown fields.

| Field        | Required on create | Rules                                                      |
| ------------ | ------------------ | ---------------------------------------------------------- |
| `moduleId`   | Yes                | UUID of an existing [module](modules.md).                  |
| `userRoleId` | Yes                | UUID of an existing [user-role assignment](user-roles.md). |

Include at least one of `moduleId` and `userRoleId` in a `PATCH` request. Replace the example relationship UUIDs with IDs from your API.

## List module-user-role assignments

```http
GET /module-user-roles HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with an array under `data`. The array is empty when there are no records.

## Create a module-user-role assignment

```http
POST /module-user-roles HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "moduleId": "8ef155da-8329-4eb1-8b2a-6eac8e441003",
  "userRoleId": "8ef155da-8329-4eb1-8b2a-6eac8e441004"
}
```

Returns `201 Created` with the new module-user-role assignment under `data`.

```json
{
  "data": {
    "id": "8ef155da-8329-4eb1-8b2a-6eac8e441005",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z",
    "disabled": false,
    "module": {
      "id": "8ef155da-8329-4eb1-8b2a-6eac8e441003",
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-15T10:00:00.000Z",
      "disabled": false,
      "name": "Content Library",
      "slug": "content-library",
      "description": "Stores submitted content."
    },
    "userRole": {
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
}
```

The response embeds the related `module` and `userRole`. The `userRole` object contains the related `user` and `role`. Use the module-user-role assignment UUID from `data.id` in the request path.

## Get a module-user-role assignment

```http
GET /module-user-roles/{id} HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with the module-user-role assignment under `data`, using the same object shape as the create response.

## Update a module-user-role assignment

```http
PATCH /module-user-roles/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "moduleId": "8ef155da-8329-4eb1-8b2a-6eac8e441007"
}
```

Returns `200 OK` with the updated module-user-role assignment under `data`, using the same object shape as the create response.

## Delete a module-user-role assignment

```http
DELETE /module-user-roles/{id} HTTP/1.1
Host: localhost:3000
```

Returns `204 No Content` with an empty body.

## Errors

Error responses contain `success: false`, `code`, and `message`. Field validation errors can include a `details` array.

| Status                     | Code                | When it occurs                                                                                                        |
| -------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `400 Bad Request`          | `BAD_REQUEST`       | The JSON is malformed or the `PATCH` path ID is invalid. The API also returns this error for an empty `PATCH` object. |
| `404 Not Found`            | `NOT_FOUND`         | The requested module-user-role assignment does not exist.                                                             |
| `409 Conflict`             | `CONFLICT`          | The module and user-role pair already exists.                                                                         |
| `413 Payload Too Large`    | `PAYLOAD_TOO_LARGE` | The request body exceeds the parser limit.                                                                            |
| `422 Unprocessable Entity` | `VALIDATION_ERROR`  | The JSON body violates the field rules or references a record that does not exist.                                    |
