import Image from "next/image"
import { Language } from "@/store/useI18nState"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"

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
      className="border-b dark:border-gray-700 cursor-pointer"
      onClick={openDetail}
    >
      <th
        scope="row"
        className="align-middle whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white"
      >
        {keyword.key}
      </th>
      <td className="align-middle px-4 py-3">
        <div className="flex flex-wrap gap-2 max-w-[100px]">
          {keyword.languagesAvailable.map((language) => {
            if (language.available) {
              return (
                <span
                  key={language.language}
                  className="text-green-600 dark:text-green-500 font-medium"
                >
                  {language.language.toUpperCase()}
                </span>
              )
            }

            return (
              <span
                key={language.language}
                className="text-red-600 dark:text-red-500 font-medium"
              >
                {language.language.toUpperCase()}
              </span>
            )
          })}
        </div>
      </td>
      <td className="align-middle px-4 py-3">{keyword.info?.description}</td>
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
        className="align-middle px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <Menu>
            <MenuButton>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </MenuButton>
            <MenuList>
              <MenuItem>Edit</MenuItem>
              <MenuItem onClick={deleteKeyword}>Delete</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </td>
    </tr>
  )
}

export default Row
