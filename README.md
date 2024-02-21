# Translo

## Running Locally

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

3. Run local db with docker

```sh
docker-compose up
```

4. Run migrations

```sh
pnpm prisma:migrate:dev
```

5. Start the development server:

```sh
pnpm dev
```

6. Commit:

```sh
git add .
pnpm run commit
```
