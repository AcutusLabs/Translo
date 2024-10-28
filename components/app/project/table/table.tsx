"use client"

import { useCallback, useContext, useMemo, useState } from "react"

import i18n from "@/lib/i18n"
import { useDeleteKeyword } from "@/hooks/api/project/keyword/use-delete-keyword"
import { Icons } from "@/components/icons"
import { AlertContext } from "@/app/[lang]/client-providers"

import AddNewKeyword from "../dialogs/add-new-keyword"
import AddNewLanguage from "../dialogs/add-new-languages"
import { KeywordData, LanguageData, ProjectData } from "../types"
import DetailSlideOver from "./detail-slide-over"
import Row from "./row"

type Props = {
  tokens: number
  keywords: KeywordData[]
  languages: LanguageData[]
  project: ProjectData
}

const Table = (props: Props) => {
  const { keywords, project, languages, tokens } = props

  const [keySelected, selectKey] = useState<string | undefined>(undefined)

  const openDetailRow = useCallback((key: string) => {
    selectKey(key)
  }, [])

  const closeDetailRow = useCallback(() => {
    selectKey(undefined)
  }, [])

  const keywordSelected = useMemo(
    () => keywords.find((keyword) => keyword.keyword === keySelected),
    [keySelected, keywords]
  )

  const alertContext = useContext(AlertContext)

  const { mutate: deleteKeyword } = useDeleteKeyword({
    projectId: project?.id,
    showAlertType: alertContext.showAlert,
  })

  const [query, setQuery] = useState("")

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value)
    },
    []
  )

  const filteredKeywords = useMemo(() => {
    return keywords.filter((keyword) => {
      return keyword.keyword.toLowerCase().includes(query.toLowerCase())
    })
  }, [keywords, query])

  const handleResetQuery = useCallback(() => {
    setQuery("")
  }, [])

  return (
    <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 rounded-lg border-[1px]">
      <div className="flex flex-col items-center justify-between space-y-3 p-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="w-full md:w-1/2">
          <label htmlFor="simple-search" className="sr-only">
            {i18n.t("Search")}
          </label>
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 px-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
              placeholder={i18n.t("Search")}
              onChange={handleQueryChange}
              value={query}
            />
            {query && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={handleResetQuery}
              >
                <Icons.close size={"18px"} />
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-x-3 md:space-y-0">
          <AddNewKeyword projectId={project.id} keywords={keywords} />
          <AddNewLanguage projectId={project.id} languages={languages} />
        </div>
      </div>
      <div className="px-4 md:space-x-4">
        <p className="m-0">
          {i18n.t("Number of keywords: {number}", { number: keywords.length })}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="table-fixed w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3 w-[70%]">
                {i18n.t("Keyword")}
              </th>
              <th scope="col" className="px-4 py-3 w-[25%]">
                {i18n.t("Languages")}
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">{i18n.t("Actions")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredKeywords.map((keyword) => (
              <Row
                key={keyword.keyword}
                keyword={keyword}
                languages={languages}
                openDetail={() => {
                  openDetailRow(keyword.keyword)
                }}
                deleteKeyword={() => {
                  deleteKeyword(keyword.id)
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
      {keywordSelected && (
        <DetailSlideOver
          projectId={project.id}
          tokens={tokens}
          project={project}
          languages={languages}
          onClose={closeDetailRow}
          keyword={keywordSelected}
        />
      )}
    </div>
  )
}

export default Table
