import { NextRequest } from "next/server"
import { I18n, I18nInfo, I18nLang, ProjectSettings } from "@/store/useI18nState"
import { OpenAIHelper } from "@/utils/OpenAiUtils"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse } from "@/lib/response"

const generateTranslationSchema = z.object({
  projectId: z.string(),
  keyword: z.string(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const searchParams = req.nextUrl.searchParams

    const { keyword, projectId } = generateTranslationSchema.parse({
      projectId: searchParams.get("projectId"),
      keyword: searchParams.get("keyword"),
    })

    const project = await db.project.findFirst({
      where: {
        id: projectId,
      },
    })

    if (!project) {
      return ErrorResponse({
        error: i18n.t("The project does not exist or is not published"),
      })
    }

    const languages = project.languages as I18nLang[]

    if (!languages) {
      return ErrorResponse({
        error: i18n.t("The project does not have any languages"),
      })
    }

    const languagesPropt = languages
      .map((language) => language.short)
      .join(", ")

    const { context } = (project.info as I18nInfo[])?.find(
      (ele) => ele.key === keyword
    ) || {
      key: keyword,
      context: "",
    }

    const enLanguage = languages.find((lang) => lang.short === "en")

    if (!enLanguage) {
      return ErrorResponse({
        error: i18n.t("The project does not have en language"),
      })
    }

    const translationEn = enLanguage.keywords[keyword]

    const settings = project.settings as ProjectSettings

    let agePrompt = ""

    if (settings.ageStart && settings.ageEnd) {
      agePrompt = `with an age range between ${settings.ageStart} and ${settings.ageEnd} years old.`
    } else if (settings.ageStart) {
      agePrompt = `with an age from ${settings.ageStart}.`
    } else if (settings.ageEnd) {
      agePrompt = `with an age up to ${settings.ageEnd}.`
    }

    try {
      const prompt = `
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
      const openaiHelper = new OpenAIHelper()
      const response = await openaiHelper.askChatGPT({
        prompt,
      })
      const jsonString = openaiHelper.getResponseJSONString(response)
      const result = openaiHelper.parseChatGPTJSONString<I18n>(jsonString)
      if (result) {
        return new Response(JSON.stringify(result))
      }
      throw new Error("Failed to get response from Chat GPT.")
    } catch (e) {
      throw new Error(e)
    }
  } catch (error) {
    return handleCatchApi(error)
  }
}
