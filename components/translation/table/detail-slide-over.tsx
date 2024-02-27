import { ChangeEvent, useCallback } from "react"

import SlideOver, { SlideOverRow } from "@/components/slide-over"

import { Keyword } from "../useTranslation"

type Props = {
  keyword: Keyword
  isSaving: boolean
  onClose: () => void
  editTranslation: (language: string, key: string, value: string) => void
  editContext: (key: string, context: string) => void
}

const DetailSlideOver = (props: Props) => {
  const { keyword, isSaving, onClose, editTranslation, editContext } = props

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

  return (
    <SlideOver title={keyword.key} onClose={onClose} isSaving={isSaving}>
      <div className="relative p-4 flex-1 sm:px-6">
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
