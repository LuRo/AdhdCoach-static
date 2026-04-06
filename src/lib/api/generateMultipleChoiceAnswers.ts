const API_BASE_URL = (import.meta.env.VITE_TRANSLATIONS_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8082";

const buildGenerateOptionsUrl = () => `${API_BASE_URL}/api/v1/multiple-choice-options`;

type GenerateMultipleChoiceAnswersPayload = {
  question: string;
  locale: "en" | "de" | "fr";
  count?: number;
};

const parseErrorMessage = async (response: Response, fallbackMessage: string): Promise<string> => {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    if (typeof data?.error === "string" && data.error.trim().length > 0) {
      return data.error;
    }
    if (typeof data?.message === "string" && data.message.trim().length > 0) {
      return data.message;
    }
  } catch {
    return `${fallbackMessage} (HTTP ${response.status}).`;
  }

  return fallbackMessage;
};

export const generateMultipleChoiceAnswers = async ({
  question,
  locale,
  count = 5
}: GenerateMultipleChoiceAnswersPayload): Promise<string[]> => {
  const response = await fetch(buildGenerateOptionsUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question,
      locale,
      count
    })
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Failed to generate answer options."));
  }

  const data = (await response.json()) as { options?: unknown };
  if (!Array.isArray(data.options)) {
    throw new Error("The generation endpoint returned an invalid response.");
  }

  return data.options
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};
