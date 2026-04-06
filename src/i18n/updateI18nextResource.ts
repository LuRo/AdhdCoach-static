import type { i18n as I18nInstance } from "i18next";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const cloneRecord = (value: Record<string, unknown>): Record<string, unknown> => {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
};

const setByPath = (source: Record<string, unknown>, path: string, value: string | string[]) => {
  const segments = path.split(".").filter(Boolean);
  if (segments.length === 0) {
    return;
  }

  let current: Record<string, unknown> = source;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    const next = current[segment];

    if (!isRecord(next)) {
      current[segment] = {};
    }

    current = current[segment] as Record<string, unknown>;
  }

  current[segments[segments.length - 1]] = value;
};

export const updateI18nextResource = (
  instance: I18nInstance,
  lng: string,
  ns: string,
  key: string,
  value: string | string[]
) => {
  const existingBundle = instance.getResourceBundle(lng, ns);
  const mutableBundle = isRecord(existingBundle) ? cloneRecord(existingBundle) : {};

  setByPath(mutableBundle, key, value);

  instance.addResourceBundle(lng, ns, mutableBundle, true, true);
  instance.addResource(lng, ns, key, value);
};
