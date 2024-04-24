import { PostHog } from "posthog-node"

export enum UserDoAction {
  createProject = "create_project",
  addLanguage = "add_language",
  generateFromAI = "generate_from_ai",
}

export const eventUserDo = (
  userId: string,
  client: PostHog,
  _action: UserDoAction,
  params?: any
) => {
  client.capture({
    distinctId: userId,
    event: "translo_user_do",
    properties: {
      _action,
      ...params,
    },
  })
}

export enum PaymentAction {
  subscriptionCreated = "subscription_created",
  recharged = "recharged",
  manageSubsctiption = "manage_subscription",
}

export const eventPayments = (
  userId: string,
  client: PostHog,
  _action: PaymentAction,
  params?: any
) => {
  client.capture({
    distinctId: userId,
    event: "translo_payment",
    properties: {
      _action,
      ...params,
    },
  })
}

export const sendServerPostHogEvent = async (
  event: (client: PostHog) => Promise<any> | any
) => {
  const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  })

  await event(client)
  await client.shutdown()
}
