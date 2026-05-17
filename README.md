# TrackFlow

A lightweight issue tracker I built to get hands-on with full-stack development. Think Jira, but without the 47 menus you never use.

## What it does

- Kanban board with drag and drop across To Do, In Progress, In Review, and Done
- Create, update, and delete issues with type, priority, and description
- User authentication — register, log in, stay logged in
- Comments on issues for tracking activity
- Search and priority filtering
- Live stats dashboard that updates as you move cards around

## Why I built it

I wanted a project that actually touched every layer of the stack — not just a frontend with fake data, but something with real auth, a real database, and a deployment I could hand someone a link to. Issue trackers are also something every dev team uses, so understanding how one works under the hood felt worth the time.

## Tech

- React 18 with React Router for the frontend
- Supabase for the database and authentication (PostgreSQL under the hood)
- Vite for bundling
- GitHub Actions for CI/CD — every push to main triggers a fresh deploy
- Hosted on GitHub Pages

## Live demo

[cameronb007cs.github.io/trackflow](https://cameronb007cs.github.io/trackflow)

## Running it locally

Clone the repo and install dependencies:

```bash
git clone https://github.com/CameronB007CS/trackflow.git
cd trackflow
npm install
```

Create a Supabase project, grab your project URL and publishable key, then update `src/supabase.js` with your credentials.

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project structure

```
trackflow/
├── src/
│   ├── components/       # IssueCard, IssueModal, CreateModal
│   ├── context/          # Auth state via Supabase session
│   ├── pages/            # LoginPage, BoardPage
│   └── supabase.js       # Supabase client
├── .github/workflows/    # Auto-deploy to GitHub Pages on push
└── vite.config.js
```

## What I'd add with more time

- Due dates and sprint grouping
- Role-based permissions so not everyone can delete everything
- Activity log showing the full history of changes on an issue
- Mobile layout — it works but it's not pretty on a small screen yet
