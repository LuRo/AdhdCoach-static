import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n, { ensureBackendTranslationsLoaded } from "./i18n";
import { LOCALES, normalizeLocale, type Locale } from "./locale";
import { useTranslationEditMode, TranslationEditModeProvider } from "./TranslationEditModeContext";
import { updateI18nextResource } from "./updateI18nextResource";
import { loadUiCopyFromBackend } from "../api/loadUiCopyFromBackend";

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
    testModeBadge: string;
    testModeTitle: string;
    testModeDescription: string;
    testModeMasterLabel: string;
    testModeMasterHint: string;
    testModeMorningLabel: string;
    testModeMorningHint: string;
    testModeTodayLabel: string;
    testModeTodayHint: string;
    plannerBadge: string;
    plannerTitle: string;
    plannerText: string;
  };
  ui: Record<string, unknown>;
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
      testModeBadge: "Test mode",
      testModeTitle: "Enable local test controls",
      testModeDescription: "Choose whether test mode is enabled and which pages should show test-only controls.",
      testModeMasterLabel: "Enable test mode",
      testModeMasterHint: "When disabled, all test controls are hidden and live defaults are used.",
      testModeMorningLabel: "Morning page date override",
      testModeMorningHint: "Show manual date selection on Morning.",
      testModeTodayLabel: "Today page speed override",
      testModeTodayHint: "Show simulation speed controls on Today.",
      plannerBadge: "Planner defaults",
      plannerTitle: "Local day simulation is stored per test date.",
      plannerText: "Use the morning planner to select a test date, then save the plan and debrief answers locally for that day."
    }
  },
  de: {
    common: { close: "Schliessen", cancel: "Abbrechen", save: "Speichern", reset: "ZurÃ¼cksetzen", add: "HinzufÃ¼gen" },
    locale: { label: "Sprache", en: "English", de: "Deutsch", fr: "FranzÃ¶sisch" },
    nav: { homeAria: "ADHD Coach Startseite", settingsAria: "Einstellungen Ã¶ffnen", profileAria: "Profil Ã¶ffnen", logout: "Abmelden", sectionsAria: "Hauptbereiche" },
    profile: {
      sectionLabel: "Profil",
      title: "Benutzerprofil",
      description: "Kontodetails, Coaching-Einstellungen und den AktivitÃ¤tskontext prÃ¼fen.",
      closeAria: "Profilseite schliessen",
      badge: "Profil",
      scaffoldTitle: "Profilseite Platzhalter",
      scaffoldText: "Hier Avatar, IdentitÃ¤tsfelder und profilspezifische Aktionen hinzufÃ¼gen."
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
      answerLabelsUsedFor: "Nur fÃ¼r Frage {{index}} verwendet",
      answerLabel: "Antwort {{index}}",
      saveQuestionSet: "Fragenset speichern",
      resetToSaved: "Auf Gespeichert zurÃ¼cksetzen",
      testModeBadge: "Testmodus",
      testModeTitle: "Lokale Teststeuerung aktivieren",
      testModeDescription: "Lege fest, ob der Testmodus aktiv ist und auf welchen Seiten Test-Controls angezeigt werden.",
      testModeMasterLabel: "Testmodus aktivieren",
      testModeMasterHint: "Wenn deaktiviert, sind alle Test-Controls ausgeblendet und Live-Standards aktiv.",
      testModeMorningLabel: "Datums-Override auf Morgen",
      testModeMorningHint: "Manuelle Datumsauswahl auf der Morgen-Seite anzeigen.",
      testModeTodayLabel: "Geschwindigkeits-Override auf Heute",
      testModeTodayHint: "Simulations-Geschwindigkeitsregler auf der Heute-Seite anzeigen.",
      plannerBadge: "Planer-Standards",
      plannerTitle: "Die lokale Tages-Simulation wird pro Testdatum gespeichert.",
      plannerText: "Im Morgenplaner das Testdatum wÃ¤hlen und dann Plan sowie Reflexionsantworten lokal fÃ¼r diesen Tag speichern."
    }
  },
  fr: {
    common: { close: "Fermer", cancel: "Annuler", save: "Enregistrer", reset: "RÃ©initialiser", add: "Ajouter" },
    locale: { label: "Langue", en: "Anglais", de: "Allemand", fr: "FranÃ§ais" },
    nav: { homeAria: "Accueil ADHD Coach", settingsAria: "Ouvrir les paramÃ¨tres", profileAria: "Ouvrir le profil", logout: "Se dÃ©connecter", sectionsAria: "Sections principales" },
    profile: {
      sectionLabel: "Profil",
      title: "Profil utilisateur",
      description: "Consulter les informations du compte, les prÃ©fÃ©rences de coaching et le contexte d'activitÃ©.",
      closeAria: "Fermer la page de profil",
      badge: "Profil",
      scaffoldTitle: "Structure de page de profil",
      scaffoldText: "Ajouter ici un avatar, des champs d'identitÃ© et des actions spÃ©cifiques au profil."
    },
    settings: {
      sectionLabel: "ParamÃ¨tres",
      title: "ParamÃ¨tres de l'application",
      description: "Configurer le jeu de questions de dÃ©briefing et les valeurs par dÃ©faut du planning.",
      closeAria: "Fermer la page des paramÃ¨tres",
      debriefBadge: "Questions de dÃ©briefing",
      versionLabel: "Version",
      questionSetHeading: "Modifier chaque question dans son propre onglet.",
      questionSetDescription: "Chaque onglet contrÃ´le une question et son Ã©chelle de rÃ©ponses. Les envois historiques conservent la version active au moment de l'enregistrement.",
      lastUpdated: "DerniÃ¨re mise Ã  jour",
      questionLabel: "Question {{index}}",
      answerLabelsBadge: "LibellÃ©s des rÃ©ponses",
      answerLabelsUsedFor: "UtilisÃ© uniquement pour la question {{index}}",
      answerLabel: "RÃ©ponse {{index}}",
      saveQuestionSet: "Enregistrer le jeu de questions",
      resetToSaved: "Revenir Ã  la version enregistrÃ©e",
      testModeBadge: "Mode test",
      testModeTitle: "Activer les controles de test locaux",
      testModeDescription: "Definissez si le mode test est active et sur quelles pages les controles de test doivent apparaitre.",
      testModeMasterLabel: "Activer le mode test",
      testModeMasterHint: "Quand il est desactive, tous les controles de test sont masques et les valeurs normales sont utilisees.",
      testModeMorningLabel: "Surcharge de date sur Matin",
      testModeMorningHint: "Afficher la selection manuelle de la date sur Matin.",
      testModeTodayLabel: "Surcharge de vitesse sur Aujourd'hui",
      testModeTodayHint: "Afficher les controles de vitesse de simulation sur Aujourd'hui.",
      plannerBadge: "Valeurs par dÃ©faut du planificateur",
      plannerTitle: "La simulation locale de la journÃ©e est enregistrÃ©e par date de test.",
      plannerText: "Utiliser le planificateur du matin pour choisir une date de test, puis enregistrer localement le plan et les rÃ©ponses de dÃ©briefing pour cette journÃ©e."
    }
  }
};

const I18nStateProvider = ({ children }: PropsWithChildren) => {
  const { i18n: instance } = useTranslation();
  const { enabled: translationEnabled, setEnabled: setTranslationEnabled } = useTranslationEditMode();
  const locale = normalizeLocale(instance.resolvedLanguage ?? instance.language ?? "en");

  const setLocale = (nextLocale: Locale) => {
    void (async () => {
      await ensureBackendTranslationsLoaded(nextLocale);
      await instance.changeLanguage(nextLocale);
    })();
  };

  const setTranslationValue = (targetLocale: Locale, path: string, value: string) => {
    updateI18nextResource(instance, targetLocale, "translation", path, value);
  };

  const [uiCopy, setUiCopy] = useState<Record<string, unknown> | null>(null);
  const [uiCopyLoadError, setUiCopyLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadUiCopy = async () => {
      try {
        const nextUiCopy = await loadUiCopyFromBackend(locale);
        if (!cancelled) {
          setUiCopy(nextUiCopy);
          setUiCopyLoadError(null);
        }
      } catch {
        if (!cancelled) {
          setUiCopyLoadError("Failed to load UI translations from backend.");
          setUiCopy(null);
        }
      }
    };

    void loadUiCopy();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const copy = useMemo(() => ({ ...legacyCopyByLocale[locale], ui: uiCopy ?? {} }), [locale, uiCopy]);

  const value = useMemo(
    () => ({ locale, setLocale, copy, translationEnabled, setTranslationEnabled, setTranslationValue, translationOverrides: {} }),
    [copy, locale, setTranslationEnabled, translationEnabled]
  );

  if (uiCopyLoadError) {
    return <div>{uiCopyLoadError}</div>;
  }

  if (uiCopy === null) {
    return null;
  }

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

export const preloadAllTranslationsInBackground = () => {
  LOCALES.forEach((targetLocale) => {
    void ensureBackendTranslationsLoaded(targetLocale);
    void loadUiCopyFromBackend(targetLocale).catch(() => {
      // Ignore preload failures so the active locale still loads on demand.
    });
  });
};
export { LOCALES };
export type { Locale } from "./locale";
export { EditableTranslation } from "./EditableTranslation";
export { TranslationListEditorModal } from "./TranslationListEditorModal";
export { TranslationEditToggle } from "./TranslationEditToggle";
export { useTranslationEditMode } from "./TranslationEditModeContext";










