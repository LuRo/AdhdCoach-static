export type SaveTranslationPayload = {
  lng: string;
  ns: string;
  key: string;
  value: string;
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
    return `Failed to save translation (HTTP ${response.status}).`;
  }

  return "Failed to save translation.";
};

export const saveTranslation = async (payload: SaveTranslationPayload): Promise<void> => {
  const response = await fetch("/api/translations", {
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
