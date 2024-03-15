/* eslint-env node */

const types = [
  {
    value: "feat",
    name: "feat:     A new feature",
  },
  {
    value: "fix",
    name: "fix:      A bug fix",
  },
  {
    value: "refactor",
    name: "refactor: A code change that neither fixes a bug nor adds a feature",
  },
  {
    value: "perf",
    name: "perf:     A code change that improves performance",
  },
  {
    value: "chore",
    name: `chore:    Changes to the build process or auxiliary tools
            and libraries such as documentation generation`,
  },
]

const scopesValues = [
  "general",
  "project",
  "landing",
  "subscription",
  "user",
  "i18n",
].sort((prev, next) => {
  if (prev > next) {
    return 1
  } else if (prev < next) {
    return -1
  } else {
    return 0
  }
})

const scopes = scopesValues.map((name) => ({ name }))

module.exports = {
  // override the messages
  messages: {
    type: "Select the type of change that you're committing:",
    scope: "Denote the SCOPE of this change (Mandatory):",
    // used if allowCustomScopes is true
    customScope: "Denote the SCOPE of this change (Mandatory):",
    subject: "Write a SHORT, IMPERATIVE tense description of the change:\n",
    confirmCommit: "Are you sure you want to proceed with the commit above?",
  },
  types,
  scopes,
  // allowTicketNumber: true,
  // isTicketNumberRequired: false,
  ticketNumberPrefix: "#",
  ticketNumberRegExp: "\\d{1,5}",
  skipQuestions: ["breaking", "footer", "body"],
  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "perf", "refactor"],
  footerPrefix: "",
  subjectLimit: 100,
  askForBreakingChangeFirst: false,
  upperCaseSubject: false,
}
