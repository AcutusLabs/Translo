import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    STRIPE_PRO_MONTHLY_PRICE_ID: z.string().min(1),
    STRIPE_PRO_YEARLY_PRICE_ID: z.string().min(1),
    STRIPE_AI_TRANSLATION_PLAN_ID: z.string().min(1),
    MAIL_SMTP_HOST: z.string().min(1),
    MAIL_SMTP_PORT: z.string().min(1),
    MAIL_SMTP_USER: z.string().min(1),
    MAIL_SMTP_PASSWORD: z.string().min(1),
    MAIL_SMTP_FROM: z.string().min(1),
    OPEN_AI_API_KEY: z.string().min(1),
    TRANSLO_I18N_BASE_URL: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_DEBUG_ENABLED: z.string().optional(),
    SENTRY_DNS: z.string(),
    SENTRY_ENVIROMENT: z.string(),
    TEST_MODE_ENABLED: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_TRANSLATE_ALL_PROJECT_ENABLED: z.string(),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    MAIL_SMTP_FROM: process.env.MAIL_SMTP_FROM,
    MAIL_SMTP_HOST: process.env.MAIL_SMTP_HOST,
    MAIL_SMTP_PORT: process.env.MAIL_SMTP_PORT,
    MAIL_SMTP_USER: process.env.MAIL_SMTP_USER,
    MAIL_SMTP_PASSWORD: process.env.MAIL_SMTP_PASSWORD,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRO_MONTHLY_PRICE_ID: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    STRIPE_PRO_YEARLY_PRICE_ID: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    STRIPE_AI_TRANSLATION_PLAN_ID: process.env.STRIPE_AI_TRANSLATION_PLAN_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    TRANSLO_I18N_BASE_URL: process.env.TRANSLO_I18N_BASE_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_DEBUG_ENABLED:
      process.env.NEXT_PUBLIC_POSTHOG_DEBUG_ENABLED,
    SENTRY_DNS: process.env.SENTRY_DNS,
    SENTRY_ENVIROMENT: process.env.SENTRY_ENVIROMENT,
    NEXT_PUBLIC_TRANSLATE_ALL_PROJECT_ENABLED:
      process.env.NEXT_PUBLIC_TRANSLATE_ALL_PROJECT_ENABLED,
    TEST_MODE_ENABLED: process.env.TEST_MODE_ENABLED,
  },
})
