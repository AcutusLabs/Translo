import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Keyword } from "../useTranslation"

type Props = {
  keyword: Keyword
  openDetail: () => void
  deleteKeyword: () => void
}

const Row = (props: Props) => {
  const { keyword, openDetail, deleteKeyword } = props

  return (
    <tr
      className="cursor-pointer border-b dark:border-gray-700"
      onClick={openDetail}
    >
      <th
        scope="row"
        className="whitespace-nowrap px-4 py-3 align-middle font-medium text-gray-900 dark:text-white"
      >
        {keyword.key}
      </th>
      <td className="px-4 py-3 align-middle">
        <div className="flex max-w-[100px] flex-wrap gap-2">
          {keyword.languagesAvailable.map((language) => {
            if (language.available) {
              return (
                <span
                  key={language.language}
                  className="font-medium text-green-600 dark:text-green-500"
                >
                  {language.short.toUpperCase()}
                </span>
              )
            }

            return (
              <span
                key={language.language}
                className="font-medium text-red-600 dark:text-red-500"
              >
                {language.short.toUpperCase()}
              </span>
            )
          })}
        </div>
      </td>
      <td className="px-4 py-3 align-middle">{keyword.info?.context}</td>
      {/* <td className="align-middle">
        <Image
          className="rounded-lg m-0"
          src="https://placekitten.com/200/200"
          alt="image description"
          width={80}
          height={80}
        />
      </td> */}
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
              <DropdownMenuItem onClick={openDetail}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={deleteKeyword}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

export default Row
