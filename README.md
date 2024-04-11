## Translo is a localization management platform, open-source, for building better products

- It manages all the translations you need
- Import JSON files and translate them
- Translate via ChatGPT
- Export to JSON or via URL (if you need other types of export, please open an issue)
- If the project works, we plan to manage teams (leave a like and we'll understand that you like it)

## Running Locally

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

3. Launch local db with docker daemon

```sh
docker-compose up -d
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

## Test stripe

1. Install stripe cli:

```sh
brew install stripe/stripe-cli/stripe
```

2. Login stripe:

```sh
stripe login
```

2. Webhook listener:

```sh
pnpm run stripe:webhook
```

## Update i18n

Set the base URL of Translo in the `TRANSLO_I18N_BASE_URL` environment

```sh
pnpm run i18n
```
