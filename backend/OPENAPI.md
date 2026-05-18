# GigFlow Backend — OpenAPI-style Documentation

Version: 1.0.0
Base URL: `/api`

---

## Authentication

### POST /api/auth/register

Create a new user.

Request
POST /api/auth/register
Content-Type: application/json

Body (example)

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Success Response (201)

```json
{
  "success": true,
  "data": {
    "_id": "645...",
    "name": "Alice",
    "email": "alice@example.com",
    "role": "sales",
    "createdAt": "2026-05-18T...",
    "updatedAt": "..."
  }
}
```

Error Responses

- 400 Bad Request — validation failure
- 409 Conflict — email already exists
- 500 Internal Server Error

### POST /api/auth/login

Authenticate and receive a JWT.

Request
POST /api/auth/login
Content-Type: application/json

Body

```json
{
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Success Response (200)

```json
{
  "success": true,
  "data": {
    "token": "<jwt-token>",
    "user": {
      "_id": "645...",
      "email": "alice@example.com",
      "role": "sales"
    }
  }
}
```

Error Responses

- 400 Bad Request — missing fields
- 401 Unauthorized — invalid credentials
- 500 Internal Server Error

---

## Leads

All lead endpoints are protected. Send `Authorization: Bearer <token>` header.

Common error structure

```json
{
  "success": false,
  "message": "Description of error"
}
```

### GET /api/leads

List leads with optional search, filter, sort and pagination.

Query parameters

- `page` (integer, optional) — page number (default 1)
- `limit` (integer, optional) — items per page (default 10)
- `search` (string, optional) — search by name/email/phone (case-insensitive)
- `status` (string, optional) — one of `New`, `Contacted`, `Qualified`, `Converted`, `Lost`
- `source` (string, optional) — one of `Website`, `Instagram`, `Referral`, `Email`, `Social`, `Other`
- `sort` (string, optional) — `new` or `old` (default `new`)

Success Response (200)

```json
{
  "success": true,
  "total": 42,
  "page": 1,
  "totalPages": 5,
  "limit": 10,
  "data": [
    {
      "_id": "645...",
      "name": "Acme Corp",
      "email": "lead@acme.com",
      "phone": "(555) 123-4567",
      "status": "New",
      "source": "Website",
      "assignedTo": "Rep Name",
      "createdAt": "2026-05-18T..."
    }
  ]
}
```

### POST /api/leads

Create a new lead.

Request body

```json
{
  "name": "Acme Corp",
  "email": "lead@acme.com",
  "phone": "(555) 123-4567",
  "status": "New", // optional, defaults to New
  "source": "Website", // optional
  "assignedTo": "Rep Name"
}
```

Success Response (201)

```json
{
  "success": true,
  "data": {
    /* created lead object */
  }
}
```

Validation Errors

- 400 Bad Request — missing required `name`, `email`, `phone`

### GET /api/leads/{id}

Get lead details.

Path param: `id` — lead ObjectId

Success Response (200)

```json
{
  "success": true,
  "data": {
    /* lead object */
  }
}
```

Errors

- 401 Unauthorized
- 404 Not Found

### PUT /api/leads/{id}

Update a lead. Requires `name`, `email`, `phone` in the body as minimum.

Request body (example)

```json
{
  "name": "New Name",
  "email": "updated@example.com",
  "phone": "(555) 987-6543",
  "status": "Contacted",
  "source": "Referral",
  "assignedTo": "Other Rep"
}
```

Success Response (200)

```json
{
  "success": true,
  "data": {
    /* updated lead object */
  }
}
```

Errors

- 400 Bad Request
- 401 Unauthorized
- 404 Not Found

### DELETE /api/leads/{id}

Delete a lead.

Success Response (200)

```json
{
  "success": true,
  "message": "Lead deleted."
}
```

Errors

- 401 Unauthorized
- 404 Not Found

### GET /api/leads/export

Export leads matching current filters as CSV.

Query parameters: same as `GET /api/leads` (search, status, source, sort)

Response

- `Content-Type: text/csv`
- Attachment `leads.csv`

### GET /api/leads/summary

Dashboard summary.

Success response (200)

```json
{
  "success": true,
  "data": {
    "total": 42,
    "newToday": 3,
    "statusCounts": {
      "New": 10,
      "Contacted": 8,
      "Qualified": 12,
      "Converted": 6,
      "Lost": 6
    }
  }
}
```

---

## Authentication header

Include the header on protected routes:

```
Authorization: Bearer <token>
```

---

## Error Handling

All errors return a JSON object with `success: false` and a `message` describing the problem. HTTP status codes follow conventional meanings (400, 401, 403, 404, 500).

---

## Notes

- All request/response timestamps use ISO 8601 strings.
- Replace placeholder host/port when deploying.
