import { ChangeEvent, useCallback } from "react"
import {
  ConstantTranslations,
  EditLanguageType,
  Language,
  ProjectSettings,
} from "@/store/useI18nState"

import SlideOver, { SlideOverRow } from "../../slide-over"
import AddNewConstantTranslation from "./dialogs/add-new-constant-translation"
import AddNewLanguage from "./dialogs/add-new-languages"
import EditConstantTranslation from "./dialogs/edit-contant-translation"
import EditLanguage from "./dialogs/edit-languages"

type Props = {
  languages: Language[]
  settings: ProjectSettings
  addLanguage: (language: Language) => void
  editLanguage: (language: EditLanguageType) => void
  deleteLanguage: (language: Language) => void
  onClose: () => void
  editSettings: (newSettings: Partial<ProjectSettings>) => void
  addNewConstantTranslation: (newword: ConstantTranslations) => void
}

const ProjectSettingsSlideOver = (props: Props) => {
  const {
    languages,
    settings,
    addLanguage,
    editLanguage,
    deleteLanguage,
    onClose,
    editSettings,
    addNewConstantTranslation,
  } = props

  const handleChangeDescription = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      editSettings({ description: event.target.value })
    },
    [editSettings]
  )

  const handleChangeAgeStart = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      editSettings({ ageStart: event.target.value })
    },
    [editSettings]
  )

  const handleChangeAgeEnd = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      editSettings({ ageEnd: event.target.value })
    },
    [editSettings]
  )

  return (
    <SlideOver title="Settings" onClose={onClose}>
      <div className="relative p-4 flex-1 sm:px-6">
        <SlideOverRow title="Available languages">
          <>
            {languages.map((language) => (
              <EditLanguage
                key={language.short}
                language={language}
                editLanguage={editLanguage}
                deleteLanguage={deleteLanguage}
              />
            ))}
          </>

          <AddNewLanguage addLanguage={addLanguage} />
        </SlideOverRow>
      </div>
      <div className="relative p-4 flex-1 sm:px-6">
        <h4 className="text-sm leading-6 text-gray-700" id="slide-over-title">
          To achieve a well-done translation, we need to provide context to the
          AI
        </h4>
        <SlideOverRow title="Brief project description">
          <textarea
            id="af-submit-app-description"
            className="t-textarea"
            rows={6}
            placeholder="A detailed summary will better explain your products to the AI."
            value={settings.description}
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
                  checked={settings.formality === "formal"}
                  onChange={() => {
                    editSettings({
                      formality: "formal",
                    })
                  }}
                />
                <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Formal
                </span>
              </label>

              <label className="hover:cursor-pointer flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <input
                  type="radio"
                  className="hover:cursor-pointer shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                  checked={settings.formality === "informal"}
                  onChange={() => {
                    editSettings({
                      formality: "informal",
                    })
                  }}
                />
                <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Informal
                </span>
              </label>

              <label className="hover:cursor-pointer flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <input
                  type="radio"
                  className="hover:cursor-pointer shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                  checked={settings.formality === "neutral"}
                  onChange={() => {
                    editSettings({
                      formality: "neutral",
                    })
                  }}
                />
                <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Neutral
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
                  checked={settings.audience.includes("male")}
                  onChange={(event) => {
                    if (event.target.checked) {
                      editSettings({
                        audience: [...settings.audience, "male"],
                      })
                    } else {
                      editSettings({
                        audience: settings.audience.filter(
                          (gender) => gender !== "male"
                        ),
                      })
                    }
                  }}
                />
                <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Male
                </span>
              </label>

              <label className="hover:cursor-pointer flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <input
                  type="checkbox"
                  className="hover:cursor-pointer shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                  checked={settings.audience.includes("female")}
                  onChange={(event) => {
                    if (event.target.checked) {
                      editSettings({
                        audience: [...settings.audience, "female"],
                      })
                    } else {
                      editSettings({
                        audience: settings.audience.filter(
                          (gender) => gender !== "female"
                        ),
                      })
                    }
                  }}
                />
                <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Female
                </span>
              </label>

              <label className="hover:cursor-pointer flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <input
                  type="checkbox"
                  className="hover:cursor-pointer shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                  checked={settings.audience.includes("other")}
                  onChange={(event) => {
                    if (event.target.checked) {
                      editSettings({
                        audience: [...settings.audience, "other"],
                      })
                    } else {
                      editSettings({
                        audience: settings.audience.filter(
                          (gender) => gender !== "other"
                        ),
                      })
                    }
                  }}
                />
                <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Other
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
                value={settings.ageStart}
                onChange={handleChangeAgeStart}
              />
              <input
                type="number"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="40"
                data-1p-ignore
                value={settings.ageEnd}
                onChange={handleChangeAgeEnd}
              />
            </div>
          </div>
        </SlideOverRow>

        <SlideOverRow
          title="Words designated as constant translations"
          subtitle="Terminology that must consistently be translated the same
                      way. Some words, when translated into a language, may have
                      multiple translations. To ensure that a particular
                      translation is preferred across all instances, we need to
                      manually specify the original phrase and its corresponding
                      translation"
        >
          <>
            {settings.constantTranslations.map((word) => (
              <EditConstantTranslation
                languages={languages.map((language) => language.short)}
                key={word._id}
                word={word}
                editWord={() => {}}
                deleteWord={() => {}}
              />
            ))}
          </>
          <AddNewConstantTranslation
            languages={languages.map((language) => language.short)}
            addContantTranslation={(newWord) =>
              addNewConstantTranslation(newWord)
            }
          />
        </SlideOverRow>
      </div>
    </SlideOver>
  )
}

export default ProjectSettingsSlideOver
