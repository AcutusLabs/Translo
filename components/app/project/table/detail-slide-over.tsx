import {
  ChangeEvent,
  Fragment,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

import i18n from "@/lib/i18n"
import {
  TranslationsProps,
  useAddOrEditTranslations,
} from "@/hooks/api/project/keyword/translation/use-add-or-edit-translations"
import { useEditContext } from "@/hooks/api/project/keyword/use-edit-context"
import { useEditKeyword } from "@/hooks/api/project/keyword/use-edit-keyword"
import { useAskToAI } from "@/hooks/api/project/use-ask-to-ai"
import { useCostEstimation } from "@/hooks/use-cost-estimation"
import usePreventEraseData from "@/hooks/use-prevent-erase-data"
import useDidMountEffect from "@/hooks/useDidMountEffect"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"
import PreventEraseData from "@/components/prevent-erase-data-alert"
import SlideOver, { SlideOverRow } from "@/components/slide-over"
import { AlertContext } from "@/app/client-providers"

import {
  KeywordData,
  LanguageData,
  ProjectData,
  ProjectSettings,
} from "../types"

type Props = {
  projectId: string
  tokens: number
  keyword: KeywordData
  languages: LanguageData[]
  onClose: () => void
  project: ProjectData
}

type LanguageHint = {
  projectLanguageId: string
  hint: string
}

const DetailSlideOver = (props: Props) => {
  const { projectId, tokens, keyword, languages, onClose, project } = props

  const alertContext = useContext(AlertContext)
  const [key, setKey] = useState(keyword.keyword)
  const [translations, setTranslations] = useState<
    (TranslationsProps & {
      history: string[]
    })[]
  >(
    languages.map((language) => {
      const translation = keyword.translations.find(
        (_translation) => _translation.language.id === language.id
      )
      if (translation) {
        return {
          translationId: translation.id,
          projectLanguageId: translation.language.id,
          value: translation.value,
          history: translation.history as string[],
        }
      }
      return {
        projectLanguageId: language.id,
        value: "",
        history: [],
      }
    })
  )
  const [hints, setHints] = useState<LanguageHint[]>([])
  const [context, setContext] = useState<string>(keyword.context)

  const [shouldSave, setShouldSave] = useState(false)

  useDidMountEffect(() => {
    setShouldSave(true)
  }, [translations, hints, context])

  const { preventEraseDataVisible, onCloseFromModal, onCloseSecure } =
    usePreventEraseData({
      shouldSave,
      onClose,
    })

  const updateLocalTranslation = useCallback(
    (value: string, projectLanguageId: string) => {
      if (projectLanguageId) {
        setTranslations(
          translations.map((translation) => {
            if (translation.projectLanguageId !== projectLanguageId) {
              return translation
            }

            return {
              ...translation,
              value,
            }
          })
        )
      } else {
        setTranslations([
          ...translations,
          {
            projectLanguageId,
            value,
            history: [],
          },
        ])
      }
    },
    [translations]
  )

  const [isWarning, setIsWarning] = useState(false)

  const { mutate: editContext } = useEditContext({
    projectId: projectId,
    keywordId: keyword.id,
    context,
    showAlertType: alertContext.showAlert,
    onSuccess: () => {
      setShouldSave(false)
    },
  })

  const { isPending: isSaving, mutate: editOrAddTranslation } =
    useAddOrEditTranslations({
      projectId: projectId,
      keywordId: keyword.id,
      translationsProps: translations.map((translation) => ({
        translationId: translation.translationId,
        projectLanguageId: translation.projectLanguageId,
        value: translation.value,
      })),
      showAlertType: alertContext.showAlert,
      onSuccess: () => {
        editContext()
      },
    })

  const save = useCallback(() => {
    editOrAddTranslation()
  }, [editOrAddTranslation])

  const handleChangeKey = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (event.target.value === keyword.keyword) {
        setIsWarning(false)
      }
      setKey(event.target.value)
    },
    [keyword.keyword]
  )

  const handleChangeTranslation = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>, language: string) => {
      setTranslations(
        translations.map((translation) => {
          if (translation.projectLanguageId !== language) {
            return translation
          }

          return {
            ...translation,
            value: event.target.value,
          }
        })
      )
    },
    [translations]
  )

  const handleChangeContext = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setContext(event.target.value)
    },
    [setContext]
  )

  const { isPending: isEditKeyPending, mutate: editKey } = useEditKeyword({
    projectId: project.id,
    keywordId: keyword.id,
    newKey: key,
    showAlertType: alertContext.showAlert,
  })

  const english = useMemo(() => {
    const englishLanguage = languages.find(
      (language) => language.short === "en"
    )
    return translations.find(
      (translation) => translation.projectLanguageId === englishLanguage?.id
    )
  }, [languages, translations])

  const { isPending, mutate } = useAskToAI({
    projectId: project?.id,
    keywordId: keyword.id,
    sentence: english?.value,
    onSuccess: (response) => {
      const hints: LanguageHint[] = []
      Object.keys(response).forEach((languageShort) => {
        const language = languages.find(
          (_lang) => _lang.short === languageShort
        )

        if (!language) {
          return
        }

        const currentTranslation = translations.find(
          (translation) => translation.projectLanguageId === language?.id
        )

        if (currentTranslation && !currentTranslation.value) {
          setTranslations(
            translations.map((translation) => {
              if (translation.projectLanguageId !== language.id) {
                return translation
              }

              return {
                ...translation,
                value: response[languageShort],
              }
            })
          )
        } else {
          hints.push({
            projectLanguageId: language.id,
            hint: response[languageShort],
          })
        }
      })
      setHints(hints)
    },
    showAlertType: alertContext.showAlert,
  })

  const cost = useCostEstimation({
    sentences: [english?.value || "undefined"],
    numberOfLanguages: languages.length,
    context: keyword.context,
    description: (project.settings as ProjectSettings).description,
    glossary: (project.settings as ProjectSettings).glossary,
  })

  return (
    <>
      <SlideOver
        title={i18n.t("Detail")}
        onClose={() => {
          onCloseSecure()
        }}
      >
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
                {keyword.keyword !== key && (
                  <Button
                    className="mt-2"
                    onClick={() => editKey()}
                    variant={isWarning ? "warning" : "default"}
                  >
                    {isEditKeyPending ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Fragment />
                    )}
                    {isWarning
                      ? i18n.t("Overwrite the keyword")
                      : i18n.t("Change")}
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
                value={context}
                onChange={handleChangeContext}
              ></textarea>
            </div>
          </SlideOverRow>
        </div>
        <div className="relative p-4 flex-1 sm:px-6">
          {languages.map((lang, index) => {
            const keywordTranslation = keyword.translations.find(
              (translation) => translation.language.id === lang.id
            )

            const translation = translations.find(
              (_translation) => _translation.projectLanguageId === lang.id
            )

            const hint = hints.find(
              (_hint) => _hint.projectLanguageId === lang.id
            )?.hint

            return (
              <div key={lang.id}>
                {index > 0 && <Separator className="my-7" />}
                <div className="mt-2">
                  <label className="block mb-2 text-m font-medium dark:text-white">
                    {lang.name}
                  </label>
                  <div className="mt-1">
                    <textarea
                      rows={3}
                      className="t-textarea"
                      placeholder={`Leave ${lang.name} translation here...`}
                      value={translation?.value}
                      onChange={(e) => handleChangeTranslation(e, lang.id)}
                    ></textarea>
                    {lang.short !== "en" && hint && (
                      <div className="flex items-center rounded-md border mt-2 justify-between p-2 border-green-600">
                        <div className="flex flex-col w-full">
                          <span className="text-sm text-green-600">
                            <b>{i18n.t("hint:")}</b>
                          </span>
                          <div className="flex flex-row items-center justify-between w-full">
                            <p className="text-sm text-muted-foreground m-0">
                              {hint}
                            </p>
                            <Button
                              className=""
                              onClick={() => {
                                updateLocalTranslation(
                                  hint || keywordTranslation?.value || "",
                                  lang.id
                                )
                                setHints(
                                  hints.filter(
                                    (_hint) =>
                                      _hint.projectLanguageId !== lang.id
                                  )
                                )
                              }}
                              variant={"link"}
                            >
                              {i18n.t("use this")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {lang.short === "en" && languages.length > 1 && (
                    <div className="flex flex-col">
                      <Button
                        className="mt-2 max-w-fit"
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
              </div>
            )
          })}
        </div>

        <div className="h-[50px]" />
        <div className="absolute bottom-0 left-0 right-0 pt-1 pb-3 px-3 !border-t-0 !border-b-0 bg-white">
          <Button
            className="mt-2 w-full"
            onClick={() => save()}
            variant={shouldSave ? "default" : "success"}
          >
            {isSaving ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Fragment />
            )}
            {shouldSave ? i18n.t("Save") : i18n.t("Saved")}
          </Button>
        </div>
      </SlideOver>
      <PreventEraseData
        onCloseFromModal={onCloseFromModal}
        visible={preventEraseDataVisible}
      />
    </>
  )
}

export default DetailSlideOver
