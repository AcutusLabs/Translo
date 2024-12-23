type Props = {
  title?: string
  onClose: () => void
  children: React.ReactElement | React.ReactElement[]
}

const SlideOver = (props: Props) => {
  const { children, title, onClose } = props
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
                  data-testid="slide-over-close-button"
                  type="button"
                  className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 ring-transparent "
                  onClick={onClose}
                >
                  <span className="absolute -inset-2.5"></span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div
                className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
                data-testid="slide-over"
              >
                <div className="px-4 sm:px-6 flex justify-between items-center">
                  <h2
                    className="text-base font-semibold leading-6 text-gray-900 m-0"
                    id="slide-over-title"
                  >
                    {title}
                  </h2>
                </div>
                <div className="divide-y divide-gray-100 ">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export type SlideOverRowProps = {
  title: string
  subtitle?: string
  children: React.ReactElement | React.ReactElement[]
}

export const SlideOverRow = (props: SlideOverRowProps) => (
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

export type SlideOverButtonProps = {
  text: string
  onClick: () => void
}

export const SlideOverButton = (props: SlideOverButtonProps) => (
  <button type="button" onClick={props.onClick} className="t-button">
    <svg
      className="shrink-0 size-4"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </svg>
    {props.text}
  </button>
)

export default SlideOver
