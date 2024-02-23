import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [],
  sidebarNav: [
    {
      id: "translations",
      title: "Translations",
      href: "/dashboard",
      icon: "translation",
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
