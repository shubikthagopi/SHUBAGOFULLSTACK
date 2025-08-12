# SHUBAGO Fullstack Scaffold v2

This updated scaffold includes:
- Prisma migration + seed (creates an admin user: admin@shubago / password: Admin123! — change immediately)
- Frontend login UI and token handling
- Invoice printable HTML and PDF endpoints (PDF via Puppeteer)
- Docker Compose service to run migrations on startup
- Seed script for initial products and admin user

Security note: Change JWT_SECRET and database passwords in production!

Quick dev steps:
1. Copy .env.example to api/.env and adjust.
2. Run `docker compose up --build` — the migrations service will run Prisma migrate and seed.
3. Open frontend at http://localhost:5173 and API at http://localhost:4000
