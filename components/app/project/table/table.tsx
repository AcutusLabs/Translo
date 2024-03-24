"use client"

import { useCallback, useMemo, useState } from "react"
import { Language } from "@/store/useI18nState"

import i18n from "@/lib/i18n"

import AddNewKeyword, { NewKeyword } from "../dialogs/add-new-keyword"
import AddNewLanguage from "../dialogs/add-new-languages"
import { ProjectData } from "../types"
import { Keyword } from "../useTranslation"
import DetailSlideOver from "./detail-slide-over"
import Row from "./row"

type Props = {
  keywords: Keyword[]
  isSaving: boolean
  addKeyword: (newKeyword: NewKeyword) => void
  deleteKey: (key: string) => void
  editTranslation: (language: string, key: string, value: string) => void
  editContext: (key: string, context: string) => void
  editKey: (key: string, newKey: string) => void
  checkIfKeyAlreadyExists: (key: string) => boolean
  languages: Language[]
  addLanguage: (language: Language) => void
  project: ProjectData
}

const Table = (props: Props) => {
  const {
    keywords,
    isSaving,
    addKeyword,
    deleteKey,
    editTranslation,
    editContext,
    editKey,
    checkIfKeyAlreadyExists,
    project,
    languages,
    addLanguage,
  } = props

  const [keySelected, selectKey] = useState<string | undefined>(undefined)

  const openDetailRow = useCallback((key: string) => {
    selectKey(key)
  }, [])

  const closeDetailRow = useCallback(() => {
    selectKey(undefined)
  }, [])

  const keywordSelected = useMemo(
    () => keywords.find((keyword) => keyword.key === keySelected),
    [keySelected, keywords]
  )

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
              className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-x-3 md:space-y-0">
          <AddNewKeyword keywords={keywords} addKeyword={addKeyword} />
          <AddNewLanguage languages={languages} addLanguage={addLanguage} />
        </div>
      </div>
      <div className="px-4 md:space-x-4">
        <p className="m-0">
          {i18n.t("Number of keywords: {number}", { number: keywords.length })}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                {i18n.t("Keyword")}
              </th>
              <th scope="col" className="px-4 py-3">
                {i18n.t("Languages")}
              </th>
              <th scope="col" className="px-4 py-3">
                {i18n.t("Context")}
              </th>
              {/* <th scope="col" className="px-4 py-3">
                Image
              </th> */}
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">{i18n.t("Actions")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((keyword) => (
              <Row
                key={keyword.key}
                keyword={keyword}
                openDetail={() => {
                  openDetailRow(keyword.key)
                }}
                deleteKeyword={() => {
                  deleteKey(keyword.key)
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
      {keywordSelected && (
        <DetailSlideOver
          project={project}
          onClose={closeDetailRow}
          keyword={keywordSelected}
          editTranslation={editTranslation}
          editContext={editContext}
          editKey={editKey}
          checkIfKeyAlreadyExists={checkIfKeyAlreadyExists}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

export default Table
