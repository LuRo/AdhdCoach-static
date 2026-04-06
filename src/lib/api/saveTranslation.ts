import { putTranslations } from "./translationsApi";
import { resolveTranslationTarget } from "./resolveTranslationTarget";

export type SaveTranslationPayload = {
  lng: string;
  ns: string;
  key: string;
  value: string;
};

export const saveTranslation = async (payload: SaveTranslationPayload): Promise<void> => {
  const normalizedValue = payload.value.trim();
  const target = await resolveTranslationTarget(payload.ns, payload.key);

  await putTranslations(payload.lng, target.ns, {
    [target.key]: normalizedValue.length > 0 ? normalizedValue : null
  });
};
