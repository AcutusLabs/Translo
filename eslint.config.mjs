import path from "node:path"
import { fileURLToPath } from "node:url"
import { fixupPluginRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import next from "@next/eslint-plugin-next"
import tsParser from "@typescript-eslint/parser"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import tailwindcss from "eslint-plugin-tailwindcss"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat.extends("prettier", "plugin:tailwindcss/recommended"),
  {
    ignores: [".next"],
  },
  {
    plugins: {
      tailwindcss,
      "react-hooks": fixupPluginRules(reactHooks),
      react,
      next,
    },

    settings: {
      tailwindcss: {
        callees: ["cn"],
        config: "tailwind.config.js",
      },

      next: {
        rootDir: true,
      },
    },

    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/classnames-order": "off",
      "tailwindcss/enforces-shorthand": "off",
      "tailwindcss/no-unnecessary-arbitrary-value": "off",
      "import/no-anonymous-default-export": "off",
      "react-hooks/exhaustive-deps": 2,
      "react-hooks/rules-of-hooks": "error",
      "no-console": "error",
      "react/no-array-index-key": "error",
      "react/jsx-key": "error",

      "react/jsx-no-literals": [
        "error",
        {
          noStrings: true,
          ignoreProps: true,
          noAttributeStrings: false,
        },
      ],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
  },
]
