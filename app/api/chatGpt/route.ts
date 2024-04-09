import { NextRequest } from "next/server"
import { I18n, I18nInfo, I18nLang, ProjectSettings } from "@/store/useI18nState"
import { OpenAIHelper } from "@/utils/OpenAiUtils"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { AlertType } from "@/types/api"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse } from "@/lib/response"

import { verifyCurrentUserHasAccessToProject } from "../projects/[projectId]/route"

const generateTranslationSchema = z.object({
  projectId: z.string(),
  keyword: z.string(),
  sentence: z.string(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
    })

    if (!user) {
      return new Response(i18n.t("User not found"), {
        status: 400,
      })
    }

    if (user.tokens < 0) {
      return ErrorResponse({
        error: i18n.t(
          "You don't have any more tokens to perform automatic translations"
        ),
        description: i18n.t("Please recharge your tokens"),
        alertType: AlertType.tokensRechargeNeeded,
      })
    }

    const searchParams = req.nextUrl.searchParams

    const { keyword, projectId, sentence } = generateTranslationSchema.parse({
      projectId: searchParams.get("projectId"),
      keyword: searchParams.get("keyword"),
      sentence: searchParams.get("sentence"),
    })

    // Check if the user has access to this project.
    if (!(await verifyCurrentUserHasAccessToProject(projectId))) {
      return ErrorResponse({ error: i18n.t("Wrong user"), status: 403 })
    }

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
I'm working on internationalizing my application. I'd like to translate the text "${sentence}"${
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
        const response = JSON.stringify(result)

        const cost = prompt.length + response.length

        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            tokens: Number(user.tokens) - cost,
          },
        })

        await db.aiTranslationsLog.create({
          data: {
            cost,
            userId: user.id,
          },
        })

        return new Response(response)
      }
      throw new Error("Failed to get response from Chat GPT.")
    } catch (e) {
      throw new Error(e)
    }
  } catch (error) {
    return handleCatchApi(error)
  }
}
