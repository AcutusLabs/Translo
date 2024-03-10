import { DashboardConfig } from "types"
import i18n from "@/lib/i18n"

export const dashboardConfig: DashboardConfig = {
  mainNav: [],
  sidebarNav: [
    {
      id: "projects",
      title: i18n.t("app.dashboard.Projects"),
      href: "/dashboard",
      icon: "project",
    },
    {
      id: "billing",
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      id: "settings",
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
