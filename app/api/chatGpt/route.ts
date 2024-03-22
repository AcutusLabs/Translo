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

    const settings = project.settings as ProjectSettings

    try {
      const prompt = `
I'm working on internationalizing my application. I'd like to translate the text "${keyword}" ${
        context ? `, used in this context: "${context}"` : ""
      }. Could you write the translations in [${languagesPropt}]?
[[Translations should be informal]] <-- ${settings.formality}
[[in the tone of a tech website]] <-- ${settings.description}
[[The target audience is both male and female]] <-- ${settings.audience}
with an age range between ${settings.ageStart} and ${settings.ageEnd} years old.

respond using an unique JSON object without any comments or any other descriptions, like so:
{
    "en": "",
    "it": "",
    "es": ""
}

where:
language-id for english = en
language-id for italian = it
language-id for spanish = es

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
