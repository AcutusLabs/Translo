import { MAX_KEYWORDS_STARTER_URSER } from "@/lib/constants"
import i18n from "@/lib/i18n"

import Question, { FaqQuestion } from "./question"

const Faq = () => {
  const allFaqs: FaqQuestion[] = [
    {
      id: "languages",
      title: i18n.t("Which languages does Translo support?"),
      description: i18n.t("Translo supports all languages"),
    },
    {
      id: "free-trial",
      title: i18n.t("How does the free trial work?"),
      description: i18n.t(
        "The free trial begins upon sign-up, enabling you to explore the app. During the trial, {MAX_PROJECTS_STARTER_URSER} project is available with a limit of {MAX_KEYWORDS_STARTER_URSER} keywords. Upon subscribing to a premium plan, you will have unrestricted access.",
        { MAX_KEYWORDS_STARTER_URSER }
      ),
    },
    {
      id: "cancel-subscription",
      title: i18n.t("Can I cancel at anytime?"),
      description: i18n.t(
        "Yes, You can do it through Stripe or by contacting our customer support."
      ),
    },
    {
      id: "payment-method",
      title: i18n.t("What payment methods do you accept?"),
      description: i18n.t(
        "Translo is currently using Stripe for processing payments."
      ),
    },
    {
      id: "renew",
      title: i18n.t("Does the subscription renew automatically?"),
      description: i18n.t(
        "Yes. Anyway, you can cancel the automatic renewal of the subscription whenever you want from your account settings."
      ),
    },
  ]

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="max-w-xs">
            <h2
              className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white"
              dangerouslySetInnerHTML={{
                __html: i18n
                  .t("Frequently asked questions")
                  .replace(/(< *script)/gi, "illegalscript"),
              }}
            ></h2>
            <p className="mt-1 hidden md:block text-gray-600 dark:text-gray-400">
              {i18n.t("Answers to the most frequently asked questions.")}
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="hs-accordion-group divide-y divide-gray-200 dark:divide-gray-700">
            {allFaqs.map((faq) => (
              <Question key={faq.id} {...faq} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Faq
