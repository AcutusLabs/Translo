import { I18n } from "../store/useI18nState";
import { OpenAIHelper } from "../utils/OpenAiUtils";

export const autocompleteI18nObject = async (i18n: I18n): Promise<I18n> => {
  try {
    const prompt = `I will send you a json with some i18n translation. Please fill and correct translations and respond using a JSON object without comments and do not add any other descriptions and comments:\n${JSON.stringify(
      i18n
    )}`;

    const openaiHelper = new OpenAIHelper();
    const response = await openaiHelper.askChatGPT({
      prompt,
    });
    console.log("response", response);
    const jsonString = openaiHelper.getResponseJSONString(response);
    console.log("response", jsonString);
    const result = openaiHelper.parseChatGPTJSONString<I18n>(jsonString);
    if (result) {
      return result;
    }
    throw new Error("Failed to get response from Chat GPT.");
  } catch (e) {
    throw new Error("Failing to fetch Chat GPT response");
  }
};
