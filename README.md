# GigFlow (ServiceHive Assignment)

A lightweight CRM for managing sales leads — built as a MERN-style project with a TypeScript Express backend and a React + Vite frontend. This repository contains the GigFlow application used for the ServiceHive assignment submission.

**Project Description**

GigFlow helps small sales teams capture, track, and manage leads. It provides authentication (JWT), role-based access, lead CRUD, search/filtering, pagination, CSV export, and a small dashboard with key metrics.

**Tech Stack**

- Backend: Node.js, Express, TypeScript, Mongoose
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Database: MongoDB (Atlas or local)
- Authentication: bcrypt, JSON Web Tokens (JWT)

**Features**

- User registration and login (JWT-based)
- Role-based authorization (admin, sales)
- Create, read, update, delete leads
- Search, filter, sort, pagination for leads
- CSV export of lead lists
- Dashboard summary (counts, new today, status breakdown)
- Responsive UI with light/dark theme toggle

**Folder Structure**

- Backend: [backend]
  - `src/` — TypeScript source
    - `controllers/` — Express route logic
    - `models/` — Mongoose schemas
    - `routes/` — Express route registration
    - `middlewares/` — Auth, RBAC, error handler
    - `config/` — DB connection and environment utilities
    - `app.ts`, `server.ts`
  - `package.json`, `tsconfig.json`

- Frontend: [frontend]
  - `src/`
    - `pages/` — Pages (Dashboard, Leads, Login, Register, LeadForm, LeadDetails)
    - `components/` — Reusable UI pieces (Sidebar, Navbar, LeadTable, Filters)
    - `context/` — Auth and Theme providers
    - `api/axios.ts` — API client with auth interceptors
  - `vite.config.ts`, `tailwind.config.js`, `package.json`

**Environment Variables**

Create a `.env` file in `backend/` based on `.env.example`.

Required variables:

- `MONGO_URI` — MongoDB connection string (Atlas or local)
- `JWT_SECRET` — Secret used to sign JWT tokens
- `PORT` — (optional) API port, default 5000

**API Endpoints (Overview)**

- `POST /api/auth/register` — Create a new user
- `POST /api/auth/login` — Login and receive a JWT
- `GET /api/leads` — List leads (supports `page`, `limit`, `search`, `status`, `source`, `sort`)
- `POST /api/leads` — Create a lead (authenticated)
- `GET /api/leads/:id` — Get lead details (authenticated)
- `PUT /api/leads/:id` — Update a lead (authenticated)
- `DELETE /api/leads/:id` — Delete a lead (authenticated)
- `GET /api/leads/export` — Export CSV of leads (authenticated)
- `GET /api/leads/summary` — Dashboard summary (authenticated)

For full OpenAPI-style details see `backend/OPENAPI.md`.

**Setup Instructions (Backend)**

1. Install Node.js (v18+ recommended) and npm.
2. From the `backend` folder:

```bash
cd backend
npm install
cp .env.example .env
# Edit .env to add your MONGO_URI and JWT_SECRET
npm run dev
```

The backend will run on `http://localhost:5000` by default.

**Setup Instructions (Frontend)**

1. From the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` (Vite default) in your browser.

**Local Development**

- Start MongoDB (local or ensure Atlas connection).
- Start backend in dev mode: `npm run dev` in `backend`.
- Start frontend in dev mode: `npm run dev` in `frontend`.
- The backend may seed a default admin only in development mode; use registration for production accounts.

**Deployment (Render + Netlify)**

- Backend: deploy to Render with the `backend` folder as the service root. Use `npm run build` and `npm start`.
- Frontend: deploy to Netlify from the `frontend` folder. Use `npm run build` and `dist` as the output directory.
- Database: use MongoDB Atlas. Set `MONGO_URI`, `JWT_SECRET`, and `CORS_ORIGIN` in the Render environment.

**Screenshots**

_Add screenshots here before submission — examples:_

- `screenshots/dashboard.png`
- `screenshots/leads_list.png`
- `screenshots/lead_form.png`

**Contribution**

Contributions are welcome. Please open an issue first and follow the repository coding style.

**License**

This project is provided for the ServiceHive assignment. Use under the MIT License.

---

For detailed backend API docs, deployment instructions, and beginner-friendly setup steps, see:

- `backend/OPENAPI.md` (API docs)
- `SETUP.md` (simple setup)
- `deploy.md` (deployment steps)
