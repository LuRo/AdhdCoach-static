import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { LOCALES, type Locale } from "./locale";
import { getUiCopy } from "./ui";

type TranslationNode = string | readonly TranslationNode[] | { [key: string]: TranslationNode };

const EXTRA_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    "Main sections": "Main sections",
    "Main navigation tabs": "Main navigation tabs",
    "ADHD Coach home": "ADHD Coach home",
    Language: "Language",
    English: "English",
    Deutsch: "Deutsch",
    French: "French",
    "Open settings": "Open settings",
    "Open profile": "Open profile",
    Logout: "Logout",
    Profile: "Profile",
    "User profile": "User profile",
    "Review account details, coaching preferences, and activity context.": "Review account details, coaching preferences, and activity context.",
    "Close profile page": "Close profile page",
    "Profile page scaffold": "Profile page scaffold",
    "Add avatar, identity fields, and profile-specific actions here.": "Add avatar, identity fields, and profile-specific actions here.",
    Close: "Close",
    Morning: "Morning",
    "Planning setup": "Planning setup",
    Today: "Today",
    "Work in progress": "Work in progress",
    Debriefing: "Debriefing",
    "Close the day": "Close the day",
    "Today is running at live speed.": "Today is running at live speed.",
    "Translation edit mode": "Translation edit mode",
    "Saving...": "Saving...",
    Save: "Save",
    Cancel: "Cancel"
  },
  de: {
    "Main sections": "Hauptbereiche",
    "Main navigation tabs": "Hauptnavigations-Tabs",
    "ADHD Coach home": "ADHD Coach Startseite",
    Language: "Sprache",
    English: "Englisch",
    Deutsch: "Deutsch",
    French: "Französisch",
    "Open settings": "Einstellungen öffnen",
    "Open profile": "Profil öffnen",
    Logout: "Abmelden",
    Profile: "Profil",
    "User profile": "Benutzerprofil",
    "Review account details, coaching preferences, and activity context.": "Kontodetails, Coaching-Einstellungen und den Aktivitätskontext prüfen.",
    "Close profile page": "Profilseite schliessen",
    "Profile page scaffold": "Profilseite Platzhalter",
    "Add avatar, identity fields, and profile-specific actions here.": "Hier Avatar, Identitätsfelder und profilspezifische Aktionen hinzufügen.",
    Close: "Schliessen",
    Morning: "Morgen",
    "Planning setup": "Planungs-Setup",
    Today: "Heute",
    "Work in progress": "In Bearbeitung",
    Debriefing: "Reflexion",
    "Close the day": "Tag abschliessen",
    "Today is running at live speed.": "Heute läuft in Echtzeitgeschwindigkeit.",
    "Translation edit mode": "Übersetzungs-Bearbeitungsmodus",
    "Saving...": "Wird gespeichert...",
    Save: "Speichern",
    Cancel: "Abbrechen"
  },
  fr: {
    "Main sections": "Sections principales",
    "Main navigation tabs": "Onglets de navigation principaux",
    "ADHD Coach home": "Accueil ADHD Coach",
    Language: "Langue",
    English: "Anglais",
    Deutsch: "Allemand",
    French: "Français",
    "Open settings": "Ouvrir les paramètres",
    "Open profile": "Ouvrir le profil",
    Logout: "Se déconnecter",
    Profile: "Profil",
    "User profile": "Profil utilisateur",
    "Review account details, coaching preferences, and activity context.": "Consulter les informations du compte, les préférences de coaching et le contexte d'activité.",
    "Close profile page": "Fermer la page de profil",
    "Profile page scaffold": "Structure de page de profil",
    "Add avatar, identity fields, and profile-specific actions here.": "Ajouter ici un avatar, des champs d'identité et des actions spécifiques au profil.",
    Close: "Fermer",
    Morning: "Matin",
    "Planning setup": "Configuration du planning",
    Today: "Aujourd'hui",
    "Work in progress": "Travail en cours",
    Debriefing: "Débriefing",
    "Close the day": "Clôturer la journée",
    "Today is running at live speed.": "Aujourd'hui fonctionne à la vitesse réelle.",
    "Translation edit mode": "Mode d'édition des traductions",
    "Saving...": "Enregistrement...",
    Save: "Enregistrer",
    Cancel: "Annuler"
  }
};

const flattenStringPaths = (node: TranslationNode, path: string[] = [], output: string[] = []): string[] => {
  if (typeof node === "string") {
    output.push(path.join("."));
    return output;
  }

  if (Array.isArray(node)) {
    node.forEach((value, index) => flattenStringPaths(value, [...path, String(index)], output));
    return output;
  }

  Object.entries(node).forEach(([key, value]) => flattenStringPaths(value, [...path, key], output));
  return output;
};

const getValueAtPath = (node: TranslationNode, path: string[]): TranslationNode => {
  return path.reduce<TranslationNode>((current, segment) => {
    if (Array.isArray(current)) {
      return current[Number(segment)];
    }
    return (current as Record<string, TranslationNode>)[segment];
  }, node);
};

const buildLabelDictionary = (locale: Locale): Record<string, string> => {
  const englishTree = getUiCopy("en") as unknown as TranslationNode;
  const localizedTree = getUiCopy(locale) as unknown as TranslationNode;
  const stringPaths = flattenStringPaths(englishTree);
  const dictionary: Record<string, string> = {};

  stringPaths.forEach((path) => {
    const segments = path.split(".");
    const english = getValueAtPath(englishTree, segments);
    const localized = getValueAtPath(localizedTree, segments);

    if (typeof english === "string" && typeof localized === "string") {
      dictionary[english] = localized;
    }
  });

  return {
    ...dictionary,
    ...EXTRA_LABELS[locale]
  };
};

const resources = Object.fromEntries(LOCALES.map((locale) => [locale, { translation: buildLabelDictionary(locale) }])) as Record<
  Locale,
  { translation: Record<string, string> }
>;

if (!i18n.isInitialized) {
  i18n.use(LanguageDetector).use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    supportedLngs: [...LOCALES],
    defaultNS: "translation",
    ns: ["translation"],
    keySeparator: false,
    nsSeparator: false,
    interpolation: {
      escapeValue: false
    },
    load: "currentOnly",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "adhd-coach-static-locale"
    },
    react: {
      useSuspense: false
    }
  });
}

export default i18n;
