import Link from "next/link"

import i18n from "@/lib/i18n"
import { navigate } from "@/lib/link"
import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"

export default function NotFound() {
  return (
    <EmptyPlaceholder className="mx-auto max-w-[800px]">
      <EmptyPlaceholder.Icon name="warning" />
      <EmptyPlaceholder.Title>
        {i18n.t("Uh oh! Not Found")}
      </EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        {i18n.t("This transition cound not be found. Please try again.")}
      </EmptyPlaceholder.Description>
      <Link
        href={navigate().dashboard()}
        className={buttonVariants({ variant: "ghost" })}
      >
        {i18n.t("Go to Dashboard")}
      </Link>
    </EmptyPlaceholder>
  )
}
