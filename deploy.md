# Deployment Guide for Render + Vercel

This document outlines the production deployment workflow for GigFlow using Render for the backend and Vercel for the frontend. It does not rely on Docker.

---

## MongoDB → Atlas

1. Create a MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
2. Create a database user with a strong password.
3. Allow access from your cloud host or use Atlas IP Access List.
4. Build a connection string like:

```
mongodb+srv://<username>:<password>@cluster0.abcd.mongodb.net/gigflow?retryWrites=true&w=majority
```

5. Use that string as the `MONGO_URI` environment variable in Render.

---

## Backend → Render

1. Commit and push the repo to GitHub.
2. In Render, create a new Web Service.
3. Connect the service to the repo and set the root directory to `backend`.
4. Configure the build and start commands:
   - Build command: `npm run build`
   - Start command: `npm start`
5. Add production environment variables to Render:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — strong random secret
   - `CORS_ORIGIN` — your frontend origin, for example `https://your-app.vercel.app`
   - `PORT` — optional, Render will provide this automatically
6. Use Node 18+ on Render, which is also specified by the backend `engines` field.

Notes:

- The backend now exposes `/api` and `/api/health` for easy deployment checks.
- CORS is configured using the `CORS_ORIGIN` variable, with local defaults for dev.

---

## Frontend → Vercel

1. In Vercel, create a new project and point it at the `frontend` folder.
2. Use these build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add the environment variable:
   - `VITE_API_URL` — e.g. `https://your-backend-service.onrender.com/api`
4. Deploy your frontend site.

The existing `frontend/vercel.json` already configures the static build and client-side routing fallback.

---

## Environment and CORS

- Backend: `CORS_ORIGIN` should contain the production frontend URL.
- Frontend: `VITE_API_URL` should point to the backend base path, including `/api`.
- Keep `JWT_SECRET` and `MONGO_URI` secure in Render.

---

## Notes on Docker

This guide is intentionally focused on Render and Vercel deployment only. Existing Docker files and Compose YAML are not required for production.
