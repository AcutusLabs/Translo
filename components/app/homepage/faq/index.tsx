import Question, { FaqQuestion } from "./question"

const allFaqs: FaqQuestion[] = [
  {
    id: "languages",
    title: "Which languages does Translo support?",
    description: "Translo supports all languages",
  },
  {
    id: "free-trial",
    title: "How does the free trial work?",
    description:
      "The free trial begins upon sign-up, enabling you to explore the app. During the trial, 1 project is available with a limit of 20 keywords. Upon subscribing to a premium plan, you will have unrestricted access.",
  },
  {
    id: "cancel-subscription",
    title: "Can I cancel at anytime?",
    description:
      "Yes, You can do it through Stripe or by contacting our customer support.",
  },
  {
    id: "payment-method",
    title: "What payment methods do you accept?",
    description: "Translo is currently using Stripe for processing payments.",
  },
  {
    id: "renew",
    title: "Does the subscription renew automatically?",
    description:
      "Yes. Anyway, you can cancel the automatic renewal of the subscription whenever you want from your account settings.",
  },
]

const Faq = () => {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="max-w-xs">
            <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
              Frequently
              <br />
              asked questions
            </h2>
            <p className="mt-1 hidden md:block text-gray-600 dark:text-gray-400">
              Answers to the most frequently asked questions.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="hs-accordion-group divide-y divide-gray-200 dark:divide-gray-700">
            {allFaqs.map((faq) => (
              <Question {...faq} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Faq
