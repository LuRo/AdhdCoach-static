import { getTranslations } from "./translationsApi";
import { UI_BACKEND_NAMESPACES, type UiBackendNamespace } from "../i18n/ui-namespaces";

const DEFAULT_LOCALE = "en";
const DEFAULT_NAMESPACE = "translation";

type ResolvedTranslationTarget = {
  ns: string;
  key: string;
};

let literalIndexPromise: Promise<Map<string, ResolvedTranslationTarget>> | null = null;

const hasBackendNamespace = (value: string): value is UiBackendNamespace => {
  return (UI_BACKEND_NAMESPACES as readonly string[]).includes(value);
};

const buildLiteralIndex = async (): Promise<Map<string, ResolvedTranslationTarget>> => {
  const index = new Map<string, ResolvedTranslationTarget>();

  await Promise.all(
    UI_BACKEND_NAMESPACES.map(async (namespace) => {
      const namespaceEntries = await getTranslations(DEFAULT_LOCALE, namespace);

      Object.entries(namespaceEntries).forEach(([path, englishLabel]) => {
        if (!index.has(englishLabel)) {
          index.set(englishLabel, { ns: namespace, key: path });
        }
      });
    })
  );

  return index;
};

const getLiteralIndex = async (): Promise<Map<string, ResolvedTranslationTarget>> => {
  if (!literalIndexPromise) {
    literalIndexPromise = buildLiteralIndex();
  }

  return literalIndexPromise;
};

export const resolveTranslationTarget = async (ns: string, key: string): Promise<ResolvedTranslationTarget> => {
  if (ns !== DEFAULT_NAMESPACE) {
    return { ns, key };
  }

  const segments = key.split(".").filter(Boolean);
  if (segments.length > 1) {
    const candidateNamespace = segments[0];
    if (hasBackendNamespace(candidateNamespace)) {
      return {
        ns: candidateNamespace,
        key: segments.slice(1).join(".")
      };
    }
  }

  try {
    const literalIndex = await getLiteralIndex();
    const resolved = literalIndex.get(key);
    if (resolved) {
      return resolved;
    }
  } catch {
    return { ns, key };
  }

  return { ns, key };
};
