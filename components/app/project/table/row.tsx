import i18n from "@/lib/i18n"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { KeywordData, LanguageData } from "../types"

type Props = {
  keyword: KeywordData
  languages: LanguageData[]
  openDetail: () => void
  deleteKeyword: () => void
}

const Row = (props: Props) => {
  const { keyword, languages, openDetail, deleteKeyword } = props

  return (
    <tr
      className="cursor-pointer border-b dark:border-gray-700"
      onClick={openDetail}
    >
      <td
        scope="row"
        className="whitespace-nowrap px-4 py-3 align-middle font-medium text-gray-900 dark:text-white text-ellipsis overflow-hidden w-[70%]"
      >
        {keyword.keyword}
      </td>
      <td className="px-4 py-3 align-middle">
        <div className="flex flex-wrap gap-2">
          {languages.map((language) => {
            const translation = keyword.translations.find(
              (translation) => translation.language.id === language.id
            )
            if (translation?.value) {
              return (
                <span
                  key={language.short}
                  className="font-medium text-green-600 dark:text-green-500"
                >
                  {language.short.toUpperCase()}
                </span>
              )
            }

            return (
              <span
                key={language.short}
                className="font-medium text-red-600 dark:text-red-500"
              >
                {language.short.toUpperCase()}
              </span>
            )
          })}
        </div>
      </td>
      <td
        className="px-4 py-3 align-middle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={openDetail}
                className={"hover:cursor-pointer"}
              >
                {i18n.t("Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={deleteKeyword}
                className={"hover:cursor-pointer"}
              >
                {i18n.t("Delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

export default Row
