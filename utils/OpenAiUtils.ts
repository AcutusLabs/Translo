import { I18nLang, ProjectSettings } from "@/store/useI18nState"
import OpenAI from "openai"
import { ChatCompletion } from "openai/resources/index.mjs"

import { env } from "@/env.mjs"

export type GeneratePromptTranslationParams = {
  translationEn: string
  context: string
  languagesPropt: string
  settings: ProjectSettings
  agePrompt: string
  languages: I18nLang[]
}

export const generatePromptTranslation = ({
  translationEn,
  context,
  languagesPropt,
  settings,
  agePrompt,
  languages,
}: GeneratePromptTranslationParams) => `
I'm working on internationalizing my application. I'd like to translate the text "${translationEn}"${
  context ? `, used in this context: "${context}"` : ""
}. Could you write the translations in [${languagesPropt}]?
      Translations should be ${settings.formality}
      ${
        settings.description
          ? `The project description is: ${settings.description}. `
          : ""
      }
      ${
        settings.audience.length
          ? `The target audience is: ${settings.audience.join(", ")}.`
          : ""
      }
      ${agePrompt ? agePrompt : ""}

      Be aware that in some languages there are articles where English does not have them.

respond using an unique JSON object without any comments or any other descriptions, like so:
{
  ${languages.map((lang) => `"${lang.short}": ""`).join(", ")}
}

where:
${languages.map((lang) => `language-id for ${lang.lang} = ${lang.short}`)}
`

export class OpenAIHelper {
  private openai: OpenAI

  constructor(_openai?: OpenAI) {
    if (_openai) {
      this.openai = _openai
    } else {
      this.openai = this.createOpenAIInstance()
    }
  }

  private createOpenAIInstance = () =>
    new OpenAI({
      apiKey: env.OPEN_AI_API_KEY,
      dangerouslyAllowBrowser: true,
    })

  public askChatGPTAboutImage = async ({
    base64Image,
    maxTokens = 350,
    prompt,
  }: {
    base64Image: string
    prompt: string
    maxTokens?: number
  }) =>
    this.openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: maxTokens,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
    })

  public askChatGPT = async ({
    maxTokens = 4096,
    prompt,
  }: {
    prompt: string
    maxTokens?: number
  }) =>
    this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: maxTokens,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    })

  public getResponseJSONString = (response: ChatCompletion) =>
    response.choices[0].message.content

  private cleanChatGPTJSONString = (jsonString: string) =>
    jsonString.replace("```json", "").replace("```", "")

  public parseChatGPTJSONString = <Response>(
    jsonString?: string | null
  ): Response | undefined => {
    if (!jsonString) {
      return
    }
    const content = this.cleanChatGPTJSONString(jsonString)
    if (content) {
      try {
        const parsed = JSON.parse(content)
        return parsed
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failing parsing Chat GPT response:", e)
      }
    }
  }
}
