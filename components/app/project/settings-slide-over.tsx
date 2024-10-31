import { ChangeEvent, Fragment, useCallback, useContext, useState } from "react"

import i18n from "@/lib/i18n"
import { useEditProject } from "@/hooks/api/project/use-edit-project"
import usePreventEraseData from "@/hooks/use-prevent-erase-data"
import useDidMountEffect from "@/hooks/useDidMountEffect"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import PreventEraseData from "@/components/prevent-erase-data-alert"
import { AlertContext } from "@/app/[lang]/client-providers"

import SlideOver, { SlideOverRow } from "../../slide-over"
import AddNewLanguage from "./dialogs/add-new-languages"
import AddNewTerm, { NewTerm } from "./dialogs/add-new-term"
import EditLanguage from "./dialogs/edit-languages"
import EditTerm from "./dialogs/edit-term"
import { Formality, LanguageData, ProjectSettings, Sex } from "./types"

type Props = {
  projectId: string
  languages: LanguageData[]
  settings: ProjectSettings
  onClose: () => void
}

const ProjectSettingsSlideOver = (props: Props) => {
  const { projectId, languages, settings, onClose } = props

  const alertContext = useContext(AlertContext)

  const [localSettings, setLocalSettings] = useState<ProjectSettings>({
    glossary: [],
    ...settings,
  })

  const { isPending: isSaving, mutate: save } = useEditProject({
    projectId: projectId,
    projectProps: {
      settings: localSettings,
    },
    showAlertType: alertContext.showAlert,
    onSuccess: () => {
      setShouldSave(false)
    },
  })

  const handleChangeDescription = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setLocalSettings((_settings) => ({
        ..._settings,
        description: event.target.value,
      }))
    },
    []
  )

  const handleChangeAgeStart = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLocalSettings((_settings) => ({
        ..._settings,
        ageStart: event.target.value,
      }))
    },
    []
  )

  const handleChangeAgeEnd = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLocalSettings((_settings) => ({
        ..._settings,
        ageEnd: event.target.value,
      }))
    },
    []
  )

  const handleAddTerm = useCallback(
    (term: NewTerm) => {
      setLocalSettings((_settings) => ({
        ..._settings,
        glossary: [...(localSettings.glossary || []), term],
      }))
    },
    [localSettings.glossary]
  )

  const [shouldSave, setShouldSave] = useState(false)

  useDidMountEffect(() => {
    setShouldSave(true)
  }, [localSettings])

  const { preventEraseDataVisible, onCloseFromModal, onCloseSecure } =
    usePreventEraseData({
      shouldSave,
      onClose,
    })

  return (
    <>
      <SlideOver title="Settings" onClose={onCloseSecure}>
        <div className="relative p-4 flex-1 sm:px-6">
          <SlideOverRow title="Available languages">
            <>
              {languages.map((language) => (
                <EditLanguage
                  projectId={projectId}
                  key={language.short}
                  language={language}
                  disabled={language.short === "en"}
                />
              ))}
            </>

            <AddNewLanguage projectId={projectId} languages={languages} />
          </SlideOverRow>
        </div>
        <div className="relative p-4 flex-1 sm:px-6">
          <h4 className="text-sm leading-6 text-gray-700" id="slide-over-title">
            {i18n.t(
              "To achieve a well-done translation, we need to provide context to the AI."
            )}
          </h4>
          <SlideOverRow title="Brief project description">
            <label className="inline-block text-xs font-light text-gray-700 mt-2.5 dark:text-gray-200">
              {i18n.t("Must be in English")}
            </label>
            <textarea
              id="af-submit-app-description"
              className="t-textarea"
              rows={6}
              placeholder={i18n.t(
                "A detailed summary will better explain your products to the AI."
              )}
              value={localSettings.description}
              onChange={handleChangeDescription}
            ></textarea>
          </SlideOverRow>

          <SlideOverRow title="Formality">
            <div className="sm:col-span-9">
              <div className="sm:flex">
                <label className="hover:cursor-pointer flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                  <input
                    type="radio"
                    className="hover:cursor-pointer shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    checked={localSettings.formality === Formality.Formal}
                    onChange={() => {
                      setLocalSettings((_settings) => ({
                        ..._settings,
                        formality: Formality.Formal,
                      }))
                    }}
                  />
                  <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                    {i18n.t("Formal")}
                  </span>
                </label>

                <label className="hover:cursor-pointer flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                  <input
                    type="radio"
                    className="hover:cursor-pointer shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    checked={localSettings.formality === Formality.Informal}
                    onChange={() => {
                      setLocalSettings((_settings) => ({
                        ..._settings,
                        formality: Formality.Informal,
                      }))
                    }}
                  />
                  <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                    {i18n.t("Informal")}
                  </span>
                </label>

                <label className="hover:cursor-pointer flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                  <input
                    type="radio"
                    className="hover:cursor-pointer shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    checked={localSettings.formality === Formality.Neutral}
                    onChange={() => {
                      setLocalSettings((_settings) => ({
                        ..._settings,
                        formality: Formality.Neutral,
                      }))
                    }}
                  />
                  <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                    {i18n.t("Neutral")}
                  </span>
                </label>
              </div>
            </div>
          </SlideOverRow>

          <SlideOverRow title="Target audience">
            <div className="sm:col-span-9">
              <div className="sm:flex">
                <label className="hover:cursor-pointer flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                  <input
                    type="checkbox"
                    className="hover:cursor-pointer shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    checked={localSettings.audience?.includes(Sex.Male)}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setLocalSettings((_settings) => ({
                          ..._settings,
                          audience: [
                            ...(localSettings.audience || []),
                            Sex.Male,
                          ],
                        }))
                      } else {
                        setLocalSettings((_settings) => ({
                          ..._settings,
                          audience: localSettings.audience?.filter(
                            (gender) => gender !== Sex.Male
                          ),
                        }))
                      }
                    }}
                  />
                  <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                    {i18n.t("Male")}
                  </span>
                </label>

                <label className="hover:cursor-pointer flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                  <input
                    type="checkbox"
                    className="hover:cursor-pointer shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    checked={localSettings.audience?.includes(Sex.Female)}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setLocalSettings((_settings) => ({
                          ..._settings,
                          audience: [
                            ...(localSettings.audience || []),
                            Sex.Female,
                          ],
                        }))
                      } else {
                        setLocalSettings((_settings) => ({
                          ..._settings,
                          audience: localSettings.audience?.filter(
                            (gender) => gender !== Sex.Female
                          ),
                        }))
                      }
                    }}
                  />
                  <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                    {i18n.t("Female")}
                  </span>
                </label>

                <label className="hover:cursor-pointer flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                  <input
                    type="checkbox"
                    className="hover:cursor-pointer shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    checked={localSettings.audience?.includes(Sex.Other)}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setLocalSettings((_settings) => ({
                          ..._settings,
                          audience: [
                            ...(localSettings.audience || []),
                            Sex.Other,
                          ],
                        }))
                      } else {
                        setLocalSettings((_settings) => ({
                          ..._settings,
                          audience: localSettings.audience?.filter(
                            (gender) => gender !== Sex.Other
                          ),
                        }))
                      }
                    }}
                  />
                  <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                    {i18n.t("Other")}
                  </span>
                </label>
              </div>
            </div>
          </SlideOverRow>
          <SlideOverRow title="Target audience age">
            <div className="sm:col-span-9">
              <div className="sm:flex">
                <input
                  type="number"
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                  placeholder="25"
                  data-1p-ignore
                  value={localSettings.ageStart}
                  onChange={handleChangeAgeStart}
                />
                <input
                  type="number"
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                  placeholder="40"
                  data-1p-ignore
                  value={localSettings.ageEnd}
                  onChange={handleChangeAgeEnd}
                />
              </div>
            </div>
          </SlideOverRow>

          <SlideOverRow
            title={i18n.t("Glossary")}
            subtitle={i18n.t(
              "Use a glossary to keep project translations consistent"
            )}
          >
            <>
              {localSettings.glossary?.map((term) => (
                <EditTerm
                  languages={languages.map((language) => language.short)}
                  key={term._id}
                  term={term}
                  editWord={() => {}}
                  deleteWord={() => {}}
                />
              ))}
            </>
            <AddNewTerm
              languages={languages.map((language) => language.short)}
              addTerm={(newWord) => handleAddTerm(newWord)}
            />
          </SlideOverRow>
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

export default ProjectSettingsSlideOver
