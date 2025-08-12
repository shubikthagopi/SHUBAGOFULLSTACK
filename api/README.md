API setup:
1. Copy .env.example to .env and adjust DATABASE_URL & JWT_SECRET.
2. Run migrations & seed (docker compose includes a 'migrations' service):
   `docker compose up --build migrations`
3. Start api: `npm run dev`
