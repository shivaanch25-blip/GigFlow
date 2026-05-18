# GigFlow — Simple Setup Guide (Beginner Friendly)

This guide helps you run GigFlow locally (backend + frontend) on a developer machine.

Prerequisites

- Node.js (v18 or later) and npm installed — see https://nodejs.org/
- Git
- MongoDB: either a local MongoDB instance or a MongoDB Atlas cluster

Steps

1. Clone the repository

```bash
git clone <repository-url> gigflow
cd gigflow
```

2. Backend setup

```bash
cd backend
npm install
# Copy the example env and edit with your values
copy .env.example .env   # Windows PowerShell
# or
cp .env.example .env    # macOS / Linux
# Edit .env and set MONGO_URI and JWT_SECRET
# Example (local dev): MONGO_URI=mongodb://localhost:27017/gigflow
npm run dev
```

Backend runs on `http://localhost:5000` by default. You should see console output indicating the server is running.

3. Frontend setup

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Vite will start a dev server and print a local URL (e.g., `http://localhost:5173`). Open it in your browser.

4. Create initial user

When the backend starts it may create a default admin user depending on the startup script. Otherwise, register via the frontend `/register` page.

5. Common troubleshooting

- MongoDB connection error: check `MONGO_URI` in `backend/.env`
- Port conflicts: change `PORT` in `backend/.env` or in `frontend` Vite config
- Build errors: ensure Node.js version matches project `engines` if specified

6. Run production builds

- Backend build

```bash
cd backend
npm run build
# then start production server
npm start
```

- Frontend build

```bash
cd frontend
npm run build
# deploy the `dist` (or `build`) directory to a static host
```

If you want help creating a seed data set or running in Docker, ask and I can add Docker compose instructions next.
