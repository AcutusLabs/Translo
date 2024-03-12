import Link from "next/link"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DownloadFormat } from "../useTranslation"

type DownloadKeywordsDropdownMenuProps = {
  id: string
  download: (format: DownloadFormat) => void
}

export function DownloadKeywordsDropdownMenu(
  props: DownloadKeywordsDropdownMenuProps
) {
  const { id, download } = props
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-4">
        <button
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "outline-none"
          )}
        >
          <span>{i18n.t("Download")}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="truncate text-sm text-muted-foreground">
              {i18n.t("Base url:")}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {i18n.t("project.baseurl", { id })}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="hover:cursor-pointer flex"
          onClick={() => {
            download(DownloadFormat.json_files)
          }}
        >
          <p>{i18n.t("Download .json files")}</p>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:cursor-pointer">
          <Link
            target="_blank"
            href="https://github.com/Matergi/Translo/pull/27/files"
          >
            {i18n.t("TS code")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
