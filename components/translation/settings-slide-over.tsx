import SlideOver, { SlideOverButton, SlideOverRow } from "../slide-over"

type Props = {
  onClose: () => void
}

const ProjectSettingsSlideOver = (props: Props) => {
  const { onClose } = props

  return (
    <SlideOver title="Settings" onClose={onClose} onSave={() => {}}>
      <div className="relative p-4 flex-1 sm:px-6">
        <SlideOverRow title="Available languages">
          <SlideOverButton text="Add language" onClick={() => {}} />
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
          ></textarea>
        </SlideOverRow>

        <SlideOverRow title="Formality">
          <div className="sm:col-span-9">
            <div className="sm:flex">
              <label className="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <input
                  type="radio"
                  className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                />
                <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Formal
                </span>
              </label>

              <label className="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <input
                  type="radio"
                  className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                />
                <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Informal
                </span>
              </label>

              <label className="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <input
                  type="radio"
                  className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
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
              <label className="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <input
                  type="radio"
                  className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                />
                <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Male
                </span>
              </label>

              <label className="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <input
                  type="radio"
                  className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                />
                <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Female
                </span>
              </label>

              <label className="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                <input
                  type="radio"
                  className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
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
              />
              <input
                type="number"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="40"
                data-1p-ignore
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
          <SlideOverButton text="Add word" onClick={() => {}} />
        </SlideOverRow>
      </div>
    </SlideOver>
  )
}

export default ProjectSettingsSlideOver
