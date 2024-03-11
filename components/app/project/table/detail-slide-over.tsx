import { ChangeEvent, useCallback, useState } from "react"

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

  return (
    <SlideOver title={keyword.key} onClose={onClose} isSaving={isSaving}>
      <div className="relative p-4 flex-1 sm:px-6">
        <SlideOverRow title="Keyword">
          <div className="mt-1">
            <label className="inline-block text-xs font-light text-gray-700 mt-2.5 dark:text-gray-200">
              Pay attention not to insert an existing keyword, or you will
              overwrite that keyword
            </label>
            <textarea
              rows={3}
              className="t-textarea mt-2"
              placeholder="Welcome"
              value={key}
              onChange={handleChangeKey}
            ></textarea>
            <Button
              className="mt-2"
              onClick={saveKey}
              variant={isWarning ? "warning" : "default"}
            >
              {isWarning ? "Overwrite the keyword" : "Change"}
            </Button>
          </div>
        </SlideOverRow>
        <SlideOverRow title="Description">
          <div className="mt-1">
            <textarea
              rows={3}
              className="t-textarea"
              placeholder="Leave the keyword description here..."
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
