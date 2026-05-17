# TrackFlow — Issue Tracker

A full-stack project management tool inspired by Jira. Built with React, Node.js, and PostgreSQL.

![TrackFlow Board](https://placehold.co/900x480/185FA5/ffffff?text=TrackFlow+Kanban+Board)

## Features

- **Kanban board** — drag and drop issues across To Do, In Progress, In Review, and Done columns
- **Full CRUD** — create, view, update, and delete issues with type, priority, and assignee
- **JWT authentication** — register and log in; protected routes on both frontend and backend
- **Comments** — add activity comments to any issue
- **Filtering** — filter by assignee, priority, and free-text search
- **Live stats** — dashboard metrics update in real time as issues move

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, React Router v6, Vite |
| Backend  | Node.js, Express |
| Database | PostgreSQL |
| Auth     | JWT + bcrypt |

## Project Structure

```
trackflow/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # IssueCard, IssueModal, CreateModal
│       ├── context/         # AuthContext (JWT state)
│       ├── hooks/           # useApi (fetch wrapper)
│       └── pages/           # LoginPage, BoardPage
├── server/                  # Express backend
│   ├── db/
│   │   ├── pool.js          # PostgreSQL connection pool
│   │   └── schema.sql       # Tables + seed data
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login
│   │   ├── issues.js        # Full CRUD + comments
│   │   └── users.js         # GET /users, GET /me
│   └── index.js             # Express app entry
└── package.json             # Root scripts (concurrently)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in, receive JWT |
| GET | `/api/issues` | List issues (supports `?q=`, `?priority=`, `?assignee_id=`) |
| GET | `/api/issues/:id` | Get issue + comments |
| POST | `/api/issues` | Create issue |
| PATCH | `/api/issues/:id` | Update issue fields |
| DELETE | `/api/issues/:id` | Delete issue |
| POST | `/api/issues/:id/comments` | Add comment |
| GET | `/api/users` | List users |
| GET | `/api/users/me` | Current user profile |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/trackflow.git
cd trackflow
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/trackflow
JWT_SECRET=change_this_to_a_long_random_string
PORT=5000
```

### 3. Set up the database

```bash
psql -U postgres -f server/db/schema.sql
```

This creates the database, tables, and seeds example data.

### 4. Install dependencies

```bash
npm run install:all
```

### 5. Run the app

```bash
npm run dev
```

This starts both the Express server (port 5000) and the React dev server (port 5173) concurrently.

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

The app is ready to deploy to **Railway** or **Render**:

1. Create a PostgreSQL database in your platform of choice
2. Set `DATABASE_URL`, `JWT_SECRET`, and `NODE_ENV=production` as environment variables
3. Set the build command to `npm run install:all && cd client && npm run build`
4. Set the start command to `npm run server`
5. Serve the `client/dist` folder as static files from Express (add `app.use(express.static('client/dist'))` in production)

## License

MIT
