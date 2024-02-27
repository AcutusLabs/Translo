export type FaqQuestion = {
  id: string
  title: string
  description: string
}

const Question = (props: FaqQuestion) => {
  const { id, title, description } = props
  return (
    <div
      className="hs-accordion pt-6 pb-3"
      id={`hs-basic-with-title-and-arrow-stretched-heading-${id}`}
    >
      <button
        className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        aria-controls={`hs-basic-with-title-and-arrow-stretched-collapse-${id}`}
      >
        {title}
        <svg
          className="hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
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
          <path d="m6 9 6 6 6-6" />
        </svg>
        <svg
          className="hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
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
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
      <div
        id={`hs-basic-with-title-and-arrow-stretched-collapse-${id}`}
        className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
        aria-labelledby={`hs-basic-with-title-and-arrow-stretched-heading-${id}`}
      >
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  )
}

export default Question
