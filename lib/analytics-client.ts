import posthog from "posthog-js"

export enum PageAnalytics {
  home = "home",
  pricing = "pricing",
  login = "login",
  register = "register",
  projects = "projects",
  project = "project",
  billing = "billing",
  settings = "settings",
  changeEmail = "change_email",
  emailVerify = "email_verify",
  resetPassword = "reset_password",
}

export enum UserDoClientAction {
  addLanguage = "add_language",
  shareProject = "share_project",
}

type eventPostHogClientAction = UserDoClientAction

export const eventPostHogClient = (
  _action: eventPostHogClientAction,
  params?: any
) => {
  posthog.capture("translo_user_do", { _action, ...params })
}
