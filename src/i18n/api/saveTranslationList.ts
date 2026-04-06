export type SaveTranslationListPayload = {
  lng: string;
  ns: string;
  key: string;
  values: string[];
};

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    if (typeof data?.error === "string" && data.error.trim().length > 0) {
      return data.error;
    }
    if (typeof data?.message === "string" && data.message.trim().length > 0) {
      return data.message;
    }
  } catch {
    return `Failed to save translation list (HTTP ${response.status}).`;
  }

  return "Failed to save translation list.";
};

export const saveTranslationList = async (payload: SaveTranslationListPayload): Promise<void> => {
  const response = await fetch("/api/translations/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    return;
  }

  throw new Error(await parseErrorMessage(response));
};
