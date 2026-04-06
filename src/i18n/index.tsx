import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import { LOCALES, normalizeLocale, type Locale } from "./locale";
import { useTranslationEditMode, TranslationEditModeProvider } from "./TranslationEditModeContext";
import { updateI18nextResource } from "./updateI18nextResource";
import { getUiCopy } from "./ui";

type LegacyCopy = {
  common: { close: string; cancel: string; save: string; reset: string; add: string };
  locale: { label: string; en: string; de: string; fr: string };
  nav: { homeAria: string; settingsAria: string; profileAria: string; logout: string; sectionsAria: string };
  profile: { sectionLabel: string; title: string; description: string; closeAria: string; badge: string; scaffoldTitle: string; scaffoldText: string };
  settings: {
    sectionLabel: string;
    title: string;
    description: string;
    closeAria: string;
    debriefBadge: string;
    versionLabel: string;
    questionSetHeading: string;
    questionSetDescription: string;
    lastUpdated: string;
    questionLabel: string;
    answerLabelsBadge: string;
    answerLabelsUsedFor: string;
    answerLabel: string;
    saveQuestionSet: string;
    resetToSaved: string;
    plannerBadge: string;
    plannerTitle: string;
    plannerText: string;
  };
  ui: ReturnType<typeof getUiCopy>;
};

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: LegacyCopy;
  translationEnabled: boolean;
  setTranslationEnabled: (enabled: boolean) => void;
  setTranslationValue: (locale: Locale, path: string, value: string) => void;
  translationOverrides: Record<string, Record<string, string>>;
};

const I18nContext = createContext<I18nValue | null>(null);

const legacyCopyByLocale: Record<Locale, Omit<LegacyCopy, "ui">> = {
  en: {
    common: { close: "Close", cancel: "Cancel", save: "Save", reset: "Reset", add: "Add" },
    locale: { label: "Language", en: "English", de: "Deutsch", fr: "French" },
    nav: { homeAria: "ADHD Coach home", settingsAria: "Open settings", profileAria: "Open profile", logout: "Logout", sectionsAria: "Main sections" },
    profile: {
      sectionLabel: "Profile",
      title: "User profile",
      description: "Review account details, coaching preferences, and activity context.",
      closeAria: "Close profile page",
      badge: "Profile",
      scaffoldTitle: "Profile page scaffold",
      scaffoldText: "Add avatar, identity fields, and profile-specific actions here."
    },
    settings: {
      sectionLabel: "Settings",
      title: "Application settings",
      description: "Configure the debrief question set and the day-planning defaults.",
      closeAria: "Close settings page",
      debriefBadge: "Debrief questions",
      versionLabel: "Version",
      questionSetHeading: "Edit each question in its own tab.",
      questionSetDescription: "Each tab controls one prompt and its own answer scale. Historical submissions keep the version that was active when they were saved.",
      lastUpdated: "Last updated",
      questionLabel: "Question {{index}}",
      answerLabelsBadge: "Answer labels",
      answerLabelsUsedFor: "Used only for Question {{index}}",
      answerLabel: "Answer {{index}}",
      saveQuestionSet: "Save question set",
      resetToSaved: "Reset to saved",
      plannerBadge: "Planner defaults",
      plannerTitle: "Local day simulation is stored per test date.",
      plannerText: "Use the morning planner to select a test date, then save the plan and debrief answers locally for that day."
    }
  },
  de: {
    common: { close: "Schliessen", cancel: "Abbrechen", save: "Speichern", reset: "Zurücksetzen", add: "Hinzufügen" },
    locale: { label: "Sprache", en: "English", de: "Deutsch", fr: "Französisch" },
    nav: { homeAria: "ADHD Coach Startseite", settingsAria: "Einstellungen öffnen", profileAria: "Profil öffnen", logout: "Abmelden", sectionsAria: "Hauptbereiche" },
    profile: {
      sectionLabel: "Profil",
      title: "Benutzerprofil",
      description: "Kontodetails, Coaching-Einstellungen und den Aktivitätskontext prüfen.",
      closeAria: "Profilseite schliessen",
      badge: "Profil",
      scaffoldTitle: "Profilseite Platzhalter",
      scaffoldText: "Hier Avatar, Identitätsfelder und profilspezifische Aktionen hinzufügen."
    },
    settings: {
      sectionLabel: "Einstellungen",
      title: "App-Einstellungen",
      description: "Das Reflexionsfragen-Set und die Planungs-Standards konfigurieren.",
      closeAria: "Einstellungsseite schliessen",
      debriefBadge: "Reflexionsfragen",
      versionLabel: "Version",
      questionSetHeading: "Jede Frage in einem eigenen Tab bearbeiten.",
      questionSetDescription: "Jeder Tab steuert eine Frage und ihre eigene Antwortskala. Historische Einreichungen behalten die Version, die beim Speichern aktiv war.",
      lastUpdated: "Zuletzt aktualisiert",
      questionLabel: "Frage {{index}}",
      answerLabelsBadge: "Antwortlabels",
      answerLabelsUsedFor: "Nur für Frage {{index}} verwendet",
      answerLabel: "Antwort {{index}}",
      saveQuestionSet: "Fragenset speichern",
      resetToSaved: "Auf Gespeichert zurücksetzen",
      plannerBadge: "Planer-Standards",
      plannerTitle: "Die lokale Tages-Simulation wird pro Testdatum gespeichert.",
      plannerText: "Im Morgenplaner das Testdatum wählen und dann Plan sowie Reflexionsantworten lokal für diesen Tag speichern."
    }
  },
  fr: {
    common: { close: "Fermer", cancel: "Annuler", save: "Enregistrer", reset: "Réinitialiser", add: "Ajouter" },
    locale: { label: "Langue", en: "Anglais", de: "Allemand", fr: "Français" },
    nav: { homeAria: "Accueil ADHD Coach", settingsAria: "Ouvrir les paramètres", profileAria: "Ouvrir le profil", logout: "Se déconnecter", sectionsAria: "Sections principales" },
    profile: {
      sectionLabel: "Profil",
      title: "Profil utilisateur",
      description: "Consulter les informations du compte, les préférences de coaching et le contexte d'activité.",
      closeAria: "Fermer la page de profil",
      badge: "Profil",
      scaffoldTitle: "Structure de page de profil",
      scaffoldText: "Ajouter ici un avatar, des champs d'identité et des actions spécifiques au profil."
    },
    settings: {
      sectionLabel: "Paramètres",
      title: "Paramètres de l'application",
      description: "Configurer le jeu de questions de débriefing et les valeurs par défaut du planning.",
      closeAria: "Fermer la page des paramètres",
      debriefBadge: "Questions de débriefing",
      versionLabel: "Version",
      questionSetHeading: "Modifier chaque question dans son propre onglet.",
      questionSetDescription: "Chaque onglet contrôle une question et son échelle de réponses. Les envois historiques conservent la version active au moment de l'enregistrement.",
      lastUpdated: "Dernière mise à jour",
      questionLabel: "Question {{index}}",
      answerLabelsBadge: "Libellés des réponses",
      answerLabelsUsedFor: "Utilisé uniquement pour la question {{index}}",
      answerLabel: "Réponse {{index}}",
      saveQuestionSet: "Enregistrer le jeu de questions",
      resetToSaved: "Revenir à la version enregistrée",
      plannerBadge: "Valeurs par défaut du planificateur",
      plannerTitle: "La simulation locale de la journée est enregistrée par date de test.",
      plannerText: "Utiliser le planificateur du matin pour choisir une date de test, puis enregistrer localement le plan et les réponses de débriefing pour cette journée."
    }
  }
};

const I18nStateProvider = ({ children }: PropsWithChildren) => {
  const { i18n: instance } = useTranslation();
  const { enabled: translationEnabled, setEnabled: setTranslationEnabled } = useTranslationEditMode();
  const locale = normalizeLocale(instance.resolvedLanguage ?? instance.language ?? "en");

  const setLocale = (nextLocale: Locale) => {
    void instance.changeLanguage(nextLocale);
  };

  const setTranslationValue = (targetLocale: Locale, path: string, value: string) => {
    updateI18nextResource(instance, targetLocale, "translation", path, value);
  };

  const copy = useMemo(() => ({ ...legacyCopyByLocale[locale], ui: getUiCopy(locale) }), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, copy, translationEnabled, setTranslationEnabled, setTranslationValue, translationOverrides: {} }),
    [copy, locale, setTranslationEnabled, translationEnabled]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const I18nProvider = ({ children }: PropsWithChildren) => {
  return (
    <I18nextProvider i18n={i18n}>
      <TranslationEditModeProvider>
        <I18nStateProvider>{children}</I18nStateProvider>
      </TranslationEditModeProvider>
    </I18nextProvider>
  );
};

export const useI18n = (): I18nValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
};

export { LOCALES };
export type { Locale } from "./locale";
export { EditableTranslation } from "./EditableTranslation";
export { TranslationListEditorModal } from "./TranslationListEditorModal";
export { TranslationEditToggle } from "./TranslationEditToggle";
export { useTranslationEditMode } from "./TranslationEditModeContext";





