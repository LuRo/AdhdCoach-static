import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const uiSourcePath = path.join(projectRoot, "src", "i18n", "ui.ts");
const backendStorageRoot = path.join(projectRoot, "backend", "storage", "translations");

const source = fs.readFileSync(uiSourcePath, "utf8");
const match = source.match(/const uiCopy = ([\s\S]*?) as const;/);

if (!match || !match[1]) {
  throw new Error("Could not parse uiCopy object from src/i18n/ui.ts");
}

const uiCopy = Function(`"use strict"; return (${match[1]});`)();

const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

const flatten = (value, pathParts = [], output = {}) => {
  if (typeof value === "string") {
    output[pathParts.join(".")] = value;
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => flatten(entry, [...pathParts, String(index)], output));
    return output;
  }

  if (isRecord(value)) {
    Object.entries(value).forEach(([key, entry]) => flatten(entry, [...pathParts, key], output));
    return output;
  }

  return output;
};

const locales = Object.keys(uiCopy);

locales.forEach((locale) => {
  const localeValue = uiCopy[locale];
  if (!isRecord(localeValue)) {
    return;
  }

  const localeFolder = path.join(backendStorageRoot, locale);
  fs.mkdirSync(localeFolder, { recursive: true });

  Object.entries(localeValue).forEach(([namespace, namespaceTree]) => {
    const flattened = flatten(namespaceTree);
    const sorted = Object.fromEntries(Object.entries(flattened).sort(([a], [b]) => a.localeCompare(b)));
    const targetPath = path.join(localeFolder, `${namespace}.json`);
    fs.writeFileSync(targetPath, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
  });
});

console.log(`Migrated ui.ts into backend storage for locales: ${locales.join(", ")}`);
