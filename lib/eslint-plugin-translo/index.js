"use strict"

//------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------
const { AST_NODE_TYPES } = require("@typescript-eslint/types")

const { ESLintUtils } = require("@typescript-eslint/experimental-utils")
const createEslintRule = ESLintUtils.RuleCreator((ruleName) => ruleName)

//------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------

// import all rules in src/rules
module.exports = {
  rules: {
    "i18n-eslint-rule": createEslintRule({
      name: "i18n-eslint-rule",
      meta: {
        type: "problem",
        docs: {
          description:
            "Avoid using i18n.t(...) without wrapping Component with withI18n",
          recommended: "error",
        },
        schema: [],
        messages: {
          i18nEslintNoWrapped: "Wrap screen with withI18n",
        },
      },
      defaultOptions: [],
      create: (context) => {
        return {
          [AST_NODE_TYPES.CallExpression](node) {
            const sourceCode = context.getSourceCode()
            const importDeclarations = sourceCode.ast.body.filter(
              (n) => n.type === "ImportDeclaration"
            )
            const hasWithI18nImport = importDeclarations.some((importNode) =>
              importNode.specifiers.some(
                (specifier) => specifier.local.name === "withI18n"
              )
            )

            const hasUseClient =
              sourceCode.ast.body.length > 0 &&
              sourceCode.ast.body[0].type === "ExpressionStatement" &&
              sourceCode.ast.body[0].expression.value === "use client"

            if (!hasWithI18nImport && !hasUseClient) {
              context.report({
                node,
                messageId: "i18nEslintNoWrapped",
              })
            }
          },
        }
      },
    }),
  },
}
