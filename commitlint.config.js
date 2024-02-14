/* eslint-env node */

const {
  types,
  scopes,
  allowCustomScopes,
  subjectLimit,
} = require("./commitizen.config")

const validTypes = types.map((type) => type.value)
const validScopes = scopes.map((scope) => scope.name)
const scopeValidationLevel = allowCustomScopes ? 1 : 2

module.exports = {
  extends: ["@commitlint/config-conventional", "@commitlint/parse"],

  // Add your own rules. See https://commitlint.js.org/#/reference-rules
  rules: {
    // Apply valid scopes and types
    "header-max-length": [2, "always", subjectLimit],
    "header-min-length": [2, "always", 20],
    "scope-enum": [scopeValidationLevel, "always", validScopes],
    "scope-empty": [2, "never"],
    "scope-case": [0, "always", "lower-case"],
    "type-enum": [2, "always", validTypes],
    "type-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "subject-min-length": [2, "always", 5],
    "subject-full-stop": [0, "never"],
    "subject-case": [2, "always", "sentence-case"],
    "references-empty": [2, "never"],
  },
  parserPreset: {
    parserOpts: {
      // issue https://github.com/conventional-changelog/commitlint/issues/607
      // headerPattern: /^(chore|docs|feat|fix|pref|refactor|style)(?:\(([\w\$\.\-\* ]*)\))?\: (DOC-|DD-)(\d{5,}) (.*)$/g,
      // headerCorrespondence: ['type', 'scope', 'subject'],
      // issuePrefixes: ["DOC-"],
      // referenceActions: ["DOC-"],
    },
  },
}
