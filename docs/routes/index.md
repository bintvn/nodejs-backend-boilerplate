# API Root

The example base URL is `http://localhost:3000`. This endpoint is public.

## Get the welcome message

```http
GET / HTTP/1.1
Host: localhost:3000
```

Returns `200 OK` with the following JSON body.

```json
{
  "success": true,
  "message": "Welcome!"
}
```

## Resource routes

- [Users](users.md)
- [Roles](roles.md)
- [Modules](modules.md)
- [User Roles](user-roles.md)
- [Module User Roles](module-user-roles.md)
- [Unmatched requests](not-found.md)
