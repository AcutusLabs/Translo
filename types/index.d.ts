import { User } from "@prisma/client"
import type { Icon } from "lucide-react"

import { Icons } from "@/components/icons"

export type NavItem = {
  id: string
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  id: string
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type SiteConfig = {
  name: string
  blendName: string
  url: string
  ogImage: string
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  key: "free" | "pro-monthly" | "pro-yearly" | "ex-subscriber" | "ai-tokens"
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number
    isPro: boolean
  }
