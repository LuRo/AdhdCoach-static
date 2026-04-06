import { putTranslations } from "./translationsApi";

export type SaveTranslationListPayload = {
  lng: string;
  ns: string;
  key: string;
  values: string[];
};

export const saveTranslationList = async (payload: SaveTranslationListPayload): Promise<void> => {
  const translations: Record<string, string | null> = {};

  payload.values.forEach((value, index) => {
    const listKey = `${payload.key}.${index}`;
    const trimmed = value.trim();
    translations[listKey] = trimmed.length > 0 ? value : null;
  });

  await putTranslations(payload.lng, payload.ns, translations);
};
