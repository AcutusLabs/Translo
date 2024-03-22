import { ChangeEvent, useCallback, useState } from "react"
import { Project } from "@prisma/client"

import i18n from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import SlideOver, { SlideOverRow } from "@/components/slide-over"

import { Keyword } from "../useTranslation"

type Props = {
  keyword: Keyword
  isSaving: boolean
  onClose: () => void
  editTranslation: (language: string, key: string, value: string) => void
  editContext: (key: string, context: string) => void
  editKey: (key: string, newKey: string) => void
  checkIfKeyAlreadyExists: (key: string) => boolean
  project: Project
}

const DetailSlideOver = (props: Props) => {
  const {
    keyword,
    isSaving,
    onClose,
    editTranslation,
    editContext,
    editKey,
    checkIfKeyAlreadyExists,
    project,
  } = props

  const [key, setKey] = useState(keyword.key)
  const [isWarning, setIsWarning] = useState(false)

  const handleChangeKey = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (event.target.value === keyword.key) {
        setIsWarning(false)
      } else {
        setIsWarning(checkIfKeyAlreadyExists(event.target.value))
      }
      setKey(event.target.value)
    },
    [checkIfKeyAlreadyExists, keyword.key]
  )

  const handleChangeTranslation = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>, language: string) => {
      editTranslation(language, keyword.key, event.target.value)
    },
    [editTranslation, keyword.key]
  )

  const handleChangeContext = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      editContext(keyword.key, event.target.value)
    },
    [editContext, keyword.key]
  )

  const saveKey = useCallback(() => {
    editKey(keyword.key, key)
  }, [editKey, key, keyword.key])

  const askAI = useCallback(async () => {
    const response = await fetch(
      `/api/chatGpt?projectId=${project?.id}&keyword=${keyword.key}`
    ).then((res) => res.json())
    Object.keys(response).forEach((language) => {
      editTranslation(language, keyword.key, response[language])
    })
  }, [editTranslation, keyword.key, project?.id])

  return (
    <SlideOver title={keyword.key} onClose={onClose} isSaving={isSaving}>
      <div className="relative p-4 flex-1 sm:px-6">
        <SlideOverRow title="Keyword">
          <div className="mt-1">
            <label className="inline-block text-xs font-light text-gray-700 mt-2.5 dark:text-gray-200">
              {i18n.t(
                "Pay attention not to insert an existing keyword, or you will overwrite that keyword"
              )}
            </label>
            <textarea
              rows={3}
              className="t-textarea mt-2"
              placeholder={i18n.t("Context")}
              value={key}
              onChange={handleChangeKey}
            ></textarea>
            <div className="flex gap-2">
              <Button
                className="mt-2"
                onClick={saveKey}
                variant={isWarning ? "warning" : "default"}
              >
                {isWarning ? "Overwrite the keyword" : "Change"}
              </Button>
              <Button className="mt-2" onClick={askAI} variant={"default"}>
                {i18n.t("Generate")}
              </Button>
            </div>
          </div>
        </SlideOverRow>
        <SlideOverRow title="Context">
          <div className="mt-1">
            <textarea
              rows={3}
              className="t-textarea"
              placeholder="Leave the keyword context here..."
              value={keyword.info?.context}
              onChange={handleChangeContext}
            ></textarea>
          </div>
        </SlideOverRow>
        {keyword.languagesAvailable.map((lang) => (
          <div key={lang.language} className="mt-2">
            <label className="block mb-2 text-sm font-medium dark:text-white">
              {lang.language}
            </label>
            <div className="mt-1">
              <textarea
                rows={3}
                className="t-textarea"
                placeholder={`Leave ${lang.language} translation here...`}
                value={
                  keyword.languages.find(
                    (keywordLanguage) =>
                      keywordLanguage.language === lang.language
                  )?.value
                }
                onChange={(e) => handleChangeTranslation(e, lang.language)}
              ></textarea>
            </div>
          </div>
        ))}
      </div>
    </SlideOver>
  )
}

export default DetailSlideOver
