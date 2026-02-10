# User Management System

A production-ready Node.js + Express user management system featuring authentication, role-based access control, CRUD operations, and a live password strength meter.

---

##  Quick Start

```bash
npm install
npm start          # or:  npx nodemon server.js  (for auto-reload)
```

Open **http://localhost:3000** — a default admin account is auto-seeded on first run:

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123!`|

>  Change the seeded password immediately after first login via **Profile → Change Password**.

---

##  Project Structure

```
├── server.js # App entry point; loads Express, sessions, security headers
├── routes.js # All routes: login, register, dashboard, admin, CRUD API, profile
├── db.js # Database setup (sql.js / SQLite in WebAssembly) + prepared queries
├── middleware.js # Auth guards: requireAuth, requireAdmin, protectPage
├── validation.js # Input sanitisation (XSS) + regex validation
│
├── views/
│ ├── shell.js # Global HTML wrapper (<html>, <head>, nav)
│ ├── login.js # Login page + POST /api/auth/login
│ ├── register.js # Register page + password strength meter + POST /api/auth/register
│ ├── dashboard.js # Logged-in user dashboard
│ ├── admin.js # Admin panel (user table, edit modal, delete)
│ ├── profile.js # Profile page + change password form
│ └── index.js # Barrel export for views
│
├── public/
│ ├── styles.css # Global CSS (static file)
│ └── togglePassword.js # Show/hide password eye icon
│
├── package.json
└── README.md
```

---

##  Architecture

### Authentication Flow
1. User submits credentials → validated & sanitised on the server.
2. Password is verified against an **bcrypt** hash stored in SQLite.
3. On success a server-side **session** is created (cookie is `HttpOnly` + `SameSite`).
4. Every protected route checks `req.session` — direct URL access without a valid session redirects to `/login`.

### Role-Based Access Control (RBAC)
| Role  | Permissions                                      |
|-------|--------------------------------------------------|
| admin | Full CRUD on all users, access to `/admin` panel |
| user  | View own profile, change own password            |

* The **first registered user** is automatically promoted to `admin`.
* The system prevents removing or deleting the **last admin**.

### Protected Routes
| Route        | Guard                  |
|--------------|------------------------|
| `/dashboard` | `protectPage`          |
| `/profile`   | `protectPage`          |
| `/admin`     | `protectPage` + `requireAdmin` |
| `PUT /api/users/:id` | `requireAuth` + `requireAdmin` |
| `DELETE /api/users/:id` | `requireAuth` + `requireAdmin` |

---

##  Security Features

| Feature | Implementation |
|---------|----------------|
| Password hashing | bcrypt (memory-hard, resistant to GPU attacks) |
| XSS prevention | `xss` library strips all dangerous tags/attributes on every input |
| SQL injection | **Parameterised queries** via `better-sqlite3` prepared statements — user input is never interpolated into SQL strings |
| Session hijacking | `HttpOnly` cookie (inaccessible to JS), `SameSite: lax` |
| Clickjacking | `X-Frame-Options: DENY` header |
| Content sniffing | `X-Content-Type-Options: nosniff` header |
| CSP | `Content-Security-Policy` header restricts script/style origins |
| Input validation | Server-side regex checks on username, email, password before any DB write |

---

##  API Reference

### Auth

| Method | Endpoint              | Body                          | Auth? |
|--------|-----------------------|-------------------------------|-------|
| POST   | `/api/auth/register`  | `{username, email, password}` | No    |
| POST   | `/api/auth/login`     | `{username, password}`        | No    |
| POST   | `/api/auth/logout`    | —                             | Session |

### Users (Admin only)

| Method | Endpoint           | Body                                  |
|--------|--------------------|---------------------------------------|
| GET    | `/api/users`       | —                                     |
| PUT    | `/api/users/:id`   | `{username?, email?, role?, password?}` |
| DELETE | `/api/users/:id`   | —                                     |

### Profile

| Method | Endpoint                  | Body                              |
|--------|---------------------------|-----------------------------------|
| PUT    | `/api/profile/password`   | `{currentPassword, newPassword}`  |

---

##  Password Strength Meter

Scoring (each criterion = +1 point, max 5):

| Check                        | Points |
|------------------------------|--------|
| Length ≥ 8                   | +1     |
| Length ≥ 12                  | +1     |
| Mix of upper + lower case    | +1     |
| Contains a digit             | +1     |
| Contains a special character | +1     |

| Score | Label       | Colour   |
|-------|-------------|----------|
| 0     | —           | grey     |
| 1     | Very weak   | red      |
| 2     | Weak        | red      |
| 3     | Okay        | amber    |
| 4     | Strong      | purple   |
| 5     | Very strong | green    |

---

##  Customisation Tips

* **Database** — `db.js` uses `better-sqlite3` (file-based, zero config). For production swap to PostgreSQL via `pg` and adjust queries.
* **Session store** — currently in-memory. For multi-process deployments use `connect-redis` or `express-session` with a DB store.
* **Secret key** — replace the hard-coded `secret` in `server.js` with an environment variable (`process.env.SESSION_SECRET`).
* **Port** — set via `PORT` env var (defaults to `3000`).
