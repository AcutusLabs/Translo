import { MarketingConfig } from "types"
import i18n from "@/lib/i18n"
import { navigate } from "@/lib/link"

export const marketingConfig = (): MarketingConfig => ({
  mainNav: [
    {
      id: "features",
      title: i18n.t("Features"),
      href: navigate().homeFeatures(),
    },
    {
      id: "pricing",
      title: i18n.t("Pricing"),
      href: navigate().pricing(),
    },
  ],
})
