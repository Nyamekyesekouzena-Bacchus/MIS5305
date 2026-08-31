# Miracle Exterminating Service Management System

A Next.js (App Router) application for managing customers, service requests,
inspections, appointments, and payments for a pest-control business.

## Tech stack

- **Next.js 13 (App Router)** + React 18, reactstrap / Bootstrap 5
- **Prisma** ORM with **PostgreSQL**
- **Docker** for a zero-config local database

---

## Quick start

Pick the option that matches what you have installed.

### Option A — Only Docker installed (no Node.js needed)

This runs the **entire app inside Docker**, so the only requirement is Docker
Desktop.

```bash
git clone <this-repo>
cd MIS5305
docker compose --profile app up
```

Docker builds the app image, starts PostgreSQL, applies the schema, seeds the
data, and launches the app. When you see it listening, open
<http://localhost:3000>. Stop it with `Ctrl+C`, and next time run the same
command (add `--build` after changing code).

### Option B — Node.js 20+ and Docker installed (recommended for developers)

Everything is automated; only the database runs in Docker.

```bash
git clone <this-repo>
cd MIS5305
npm install
npm run dev
```

The first time you run `npm run dev` (or `npm run build`) the setup script runs
automatically and:

1. Creates a `.env` file with a generated `AUTH_SECRET`.
2. Starts the PostgreSQL database in Docker (`docker compose up -d`).
3. Waits for the database to be ready.
4. Generates the Prisma client and applies the schema (`prisma db push`).
5. Seeds the roles and default accounts (`prisma db seed`).

When it finishes, open <http://localhost:3000>.

### Default logins

| Role    | Username  | Password     |
| ------- | --------- | ------------ |
| Admin   | `admin`   | `admin123`   |
| Manager | `manager` | `manager123` |

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running) — required for both options
- [Node.js 20+](https://nodejs.org/) — only for Option B

> **Windows:** works the same way. Use PowerShell or Command Prompt (or WSL2).
> Docker Desktop must be running, and enable its WSL2 backend if prompted. All
> the commands above are identical.

---

## Useful commands

| Command             | What it does                                                |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Runs setup (first time) and starts the dev server          |
| `npm run build`     | Runs setup (first time) and builds for production          |
| `npm run start`     | Starts the production build                                 |
| `npm run setup`     | Runs the full setup manually (Docker + schema + seed)      |
| `npm run db:up`     | Starts just the database container                         |
| `npm run db:down`   | Stops the database container                               |
| `npm run db:reset`  | **Destroys** the database volume and re-seeds from scratch |
| `npm run db:seed`   | Re-runs the seed script                                    |
| `npm test`          | Runs the unit tests                                        |

---

## How the database is configured

The database runs in Docker, defined in [`docker-compose.yml`](docker-compose.yml):

- Image: `postgres:16-alpine`
- Database: `mis5305`, user `mis`, password `mis_password`
- Exposed on host port **5433** (mapped to container 5432) to avoid clashing
  with any Postgres you may already run locally.
- Data is persisted in the `miracle_pgdata` Docker volume.

The generated `.env` points at it:

```
DATABASE_URL="postgresql://mis:mis_password@localhost:5433/mis5305?schema=public"
```

### Using your own database instead of Docker

Set `DATABASE_URL` in `.env` to any external PostgreSQL instance. If the host is
not `localhost` / `127.0.0.1`, the setup script skips Docker and only runs the
schema push and seed against your database.

### Skipping setup

For environments where the database is already provisioned (e.g. CI or a hosted
deployment) you can bypass the automated setup:

```bash
SKIP_DB_SETUP=1 npm run build
```

---

## Troubleshooting

- **"Docker is installed but not running"** — start Docker Desktop and retry.
- **Port 5433 already in use** — change the host port in `docker-compose.yml`
  and the port in your `.env` `DATABASE_URL` to match.
- **Want a clean database** — run `npm run db:reset` (this deletes all data).
- **Have an old `.env` pointing at port 5432** — update its `DATABASE_URL` to
  the Docker URL above, or delete `.env` and re-run `npm run setup` to
  regenerate it.
