import { SiteFooter } from "@/components/site-footer"

import Nav from "./nav"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <Nav />
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
