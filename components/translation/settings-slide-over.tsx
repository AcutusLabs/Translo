import { cn } from "@/lib/utils"

import { buttonVariants } from "../ui/button"

type Props = {
  onClose: () => void
}

const ProjectSettingsSlideOver = (props: Props) => {
  const { onClose } = props
  return (
    <div
      className="relative z-10"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto relative w-screen max-w-md">
              <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                <button
                  type="button"
                  className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 ring-transparent "
                  onClick={onClose}
                >
                  <span className="absolute -inset-2.5"></span>
                  <span className="sr-only">Close panel</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div
                className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 sm:px-6 flex justify-between items-center">
                  <h2
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="slide-over-title"
                  >
                    Settings
                  </h2>

                  <button className={cn(buttonVariants())}>
                    <span>Save</span>
                  </button>
                </div>
                <div className="divide-y divide-gray-100 ">
                  <div className="relative p-4 flex-1 sm:px-6">
                    <Row title="Available languages">
                      <Button text="Add language" onClick={() => {}} />
                    </Row>
                  </div>
                  <div className="relative p-4 flex-1 sm:px-6">
                    <h4
                      className="text-sm leading-6 text-gray-700"
                      id="slide-over-title"
                    >
                      To achieve a well-done translation, we need to provide
                      context to the AI
                    </h4>
                    <Row title="Brief project description">
                      <textarea
                        id="af-submit-app-description"
                        className="py-2 px-3 block w-full border-gray-200 border-2 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                        rows={6}
                        placeholder="A detailed summary will better explain your products to the AI."
                      ></textarea>
                    </Row>

                    <Row title="Formality">
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
                    </Row>

                    <Row title="Target audience">
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
                    </Row>
                    <Row title="Target audience age">
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
                    </Row>

                    <Row
                      title="Words designated as constant translations"
                      subtitle="Terminology that must consistently be translated the same
                      way. Some words, when translated into a language, may have
                      multiple translations. To ensure that a particular
                      translation is preferred across all instances, we need to
                      manually specify the original phrase and its corresponding
                      translation"
                    >
                      <Button text="Add word" onClick={() => {}} />
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type RowProps = {
  title: string
  subtitle?: string
  children: React.ReactElement | React.ReactElement[]
}

const Row = (props: RowProps) => (
  <div className="space-y-2 mt-2 flex flex-col">
    <label
      htmlFor="af-submit-app-description"
      className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-gray-200"
    >
      {props.title}
    </label>
    {props.subtitle && (
      <label
        htmlFor="af-submit-app-description"
        className="inline-block text-xs font-light text-gray-700 mt-2.5 dark:text-gray-200"
      >
        {props.subtitle}
      </label>
    )}
    {props.children}
  </div>
)

type ButtonProps = {
  text: string
  onClick: () => void
}

const Button = (props: ButtonProps) => (
  <button
    type="button"
    onClick={props.onClick}
    className="max-w-max py-2 px-3 inline-flex items-center gap-x-2 text-[13px] font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
  >
    <svg
      className="shrink-0 size-4"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </svg>
    {props.text}
  </button>
)

export default ProjectSettingsSlideOver
