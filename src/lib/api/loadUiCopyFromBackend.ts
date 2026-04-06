import { getTranslations } from "./translationsApi";
import { UI_BACKEND_NAMESPACES } from "../i18n/ui-namespaces";

const TRANSLATION_NAMESPACE = "translation";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isArrayIndex = (segment: string) => /^\d+$/.test(segment);

const setByPath = (target: Record<string, unknown>, path: string, value: string) => {
  const segments = path.split(".").filter(Boolean);
  if (segments.length === 0) {
    return;
  }

  let current: Record<string, unknown> | unknown[] = target;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    const nextSegment = segments[index + 1];
    const nextShouldBeArray = isArrayIndex(nextSegment);
    const slotIndex = Number(segment);

    if (Array.isArray(current)) {
      const currentValue = current[slotIndex];
      if (nextShouldBeArray) {
        if (!Array.isArray(currentValue)) {
          current[slotIndex] = [];
        }
      } else if (!isRecord(currentValue)) {
        current[slotIndex] = {};
      }
      current = current[slotIndex] as Record<string, unknown> | unknown[];
      continue;
    }

    const currentValue = current[segment];
    if (nextShouldBeArray) {
      if (!Array.isArray(currentValue)) {
        current[segment] = [];
      }
    } else if (!isRecord(currentValue)) {
      current[segment] = {};
    }
    current = current[segment] as Record<string, unknown> | unknown[];
  }

  const finalSegment = segments[segments.length - 1];
  if (Array.isArray(current)) {
    current[Number(finalSegment)] = value;
    return;
  }

  current[finalSegment] = value;
};

const unflattenTranslations = (flatEntries: Record<string, string>): Record<string, unknown> => {
  const nested: Record<string, unknown> = {};
  Object.entries(flatEntries).forEach(([path, value]) => {
    setByPath(nested, path, value);
  });
  return nested;
};

const applyLiteralOverrides = (node: unknown, literalOverrides: Record<string, string>): unknown => {
  if (typeof node === "string") {
    return literalOverrides[node] ?? node;
  }

  if (Array.isArray(node)) {
    return node.map((item) => applyLiteralOverrides(item, literalOverrides));
  }

  if (isRecord(node)) {
    const next: Record<string, unknown> = {};
    Object.entries(node).forEach(([key, value]) => {
      next[key] = applyLiteralOverrides(value, literalOverrides);
    });
    return next;
  }

  return node;
};

export const loadUiCopyFromBackend = async (lng: string): Promise<Record<string, unknown>> => {
  const uiCopy: Record<string, unknown> = {};

  const [translationOverrides, ...namespaceEntries] = await Promise.all([
    getTranslations(lng, TRANSLATION_NAMESPACE),
    ...UI_BACKEND_NAMESPACES.map((namespace) => getTranslations(lng, namespace))
  ]);

  UI_BACKEND_NAMESPACES.forEach((namespace, index) => {
    const flatTranslations = namespaceEntries[index] ?? {};
    const nestedNamespace = unflattenTranslations(flatTranslations);
    uiCopy[namespace] = applyLiteralOverrides(nestedNamespace, translationOverrides);
  });

  return uiCopy;
};
