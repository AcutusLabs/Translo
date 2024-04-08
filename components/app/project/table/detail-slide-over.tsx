import { ChangeEvent, useCallback, useContext, useMemo, useState } from "react"
import { ProjectSettings } from "@/store/useI18nState"

import i18n from "@/lib/i18n"
import { useAskToAI } from "@/hooks/api/use-ask-to-ai"
import { useCostEstimation } from "@/hooks/use-cost-estimation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import SlideOver, { SlideOverRow } from "@/components/slide-over"
import { AlertContext } from "@/app/client-providers"

import { ProjectData } from "../types"
import { Keyword } from "../useTranslation"

type Props = {
  tokens: number
  keyword: Keyword
  onClose: () => void
  editTranslation: (language: string, key: string, value: string) => void
  editContext: (key: string, context: string) => void
  editKey: (key: string, newKey: string) => void
  checkIfKeyAlreadyExists: (key: string) => boolean
  project: ProjectData
}

const DetailSlideOver = (props: Props) => {
  const {
    tokens,
    keyword,
    onClose,
    editTranslation,
    editContext,
    editKey,
    checkIfKeyAlreadyExists,
    project,
  } = props

  const alertContext = useContext(AlertContext)
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

  const english = useMemo(
    () =>
      keyword.languages.find(
        (keywordLanguage) => keywordLanguage.short === "en"
      ),
    [keyword.languages]
  )

  const { isPending, mutate } = useAskToAI({
    projectId: project?.id,
    keyword: keyword.key,
    sentence: english?.value,
    onSuccess: (response) => {
      Object.keys(response).forEach((language) => {
        editTranslation(language, keyword.key, response[language])
      })
    },
    showAlertType: alertContext.showAlert,
  })

  const cost = useCostEstimation({
    sentence: english?.value || "undefined",
    numberOfLanguages: keyword.languages.length,
    context: keyword.info?.context,
    description: (project.settings as ProjectSettings).description,
    glossary: (project.settings as ProjectSettings).glossary,
  })

  return (
    <SlideOver title={i18n.t("Detail")} onClose={onClose}>
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
              {keyword.key !== key && (
                <Button
                  className="mt-2"
                  onClick={saveKey}
                  variant={isWarning ? "warning" : "default"}
                >
                  {isWarning ? "Overwrite the keyword" : "Change"}
                </Button>
              )}
            </div>
          </div>
        </SlideOverRow>
        <SlideOverRow title="Context">
          <label className="inline-block text-xs font-light text-gray-700 mt-2.5 dark:text-gray-200">
            {i18n.t(
              "It's necessary if you need to specify a context to the AI in order to make a more accurate translation"
            )}
          </label>
          <label className="inline-block text-xs font-light text-gray-700 mt-2.5 dark:text-gray-200">
            {i18n.t("Must be in English")}
          </label>
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
      </div>
      <div className="relative p-4 flex-1 sm:px-6">
        {keyword.languagesAvailable.map((lang) => (
          <div key={lang.language} className="mt-2">
            <label className="block mb-2 text-m font-medium dark:text-white">
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
            {lang.short === "en" && keyword.languagesAvailable.length > 1 && (
              <div className="flex flex-col">
                <Button
                  className="mt-2"
                  onClick={() => mutate()}
                  variant={"default"}
                >
                  {isPending && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {i18n.t("From English generate all translations")}
                </Button>
                <span
                  className="mt-2 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: i18n.t(
                      "To translate it, it will cost you: ~{number} tokens",
                      { number: cost }
                    ),
                  }}
                ></span>
                <span
                  className="mt-2 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: i18n.t(
                      "You still have {number} tokens, refresh the page to update it, make sure that the translations are saved",
                      {
                        number: tokens,
                      }
                    ),
                  }}
                ></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </SlideOver>
  )
}

export default DetailSlideOver
