import type { BacklogTask, NavTab, Task } from "../features/morning/types";
import type { DebriefQuestionSet } from "../features/morning/store";

export const LOCALES = ["en", "de", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

type Entry = {
  context: string;
  en: string;
  de: string;
  fr: string;
};

const entry = (context: string, en: string, de: string, fr: string): Entry => ({
  context,
  en,
  de,
  fr
});

const isEntry = (value: unknown): value is Entry => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Entry;
  return (
    typeof candidate.context === "string" &&
    typeof candidate.en === "string" &&
    typeof candidate.de === "string" &&
    typeof candidate.fr === "string"
  );
};

type SourceNode = Entry | SourceNode[] | { [key: string]: SourceNode };
type Resolved<T> = T extends Entry ? string : T extends readonly (infer U)[] ? Resolved<U>[] : T extends object ? { [K in keyof T]: Resolved<T[K]> } : never;

const resolve = <T>(source: T, locale: Locale): Resolved<T> => {
  if (isEntry(source)) {
    return source[locale] as Resolved<T>;
  }

  if (Array.isArray(source)) {
    return source.map((item) => resolve(item, locale)) as Resolved<T>;
  }

  if (source && typeof source === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
      result[key] = resolve(value, locale);
    }
    return result as Resolved<T>;
  }

  return source as Resolved<T>;
};

const flattenEntries = (node: unknown, path: string[] = [], output: Array<{ key: string; context: string; en: string; de: string; fr: string }> = []) => {
  if (isEntry(node)) {
    output.push({ key: path.join("."), context: node.context, en: node.en, de: node.de, fr: node.fr });
    return output;
  }

  if (Array.isArray(node)) {
    node.forEach((item, index) => flattenEntries(item, [...path, String(index)], output));
    return output;
  }

  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      flattenEntries(value, [...path, key], output);
    }
  }

  return output;
};

export const copySource = {
  common: {
    close: entry("Generic close button label.", "Close", "Schliessen", "Fermer"),
    cancel: entry("Generic cancel button label.", "Cancel", "Abbrechen", "Annuler"),
    save: entry("Generic save button label.", "Save", "Speichern", "Enregistrer"),
    reset: entry("Generic reset button label.", "Reset", "ZurÃƒÂ¼cksetzen", "RÃƒÂ©initialiser"),
    add: entry("Generic add button label.", "Add", "HinzufÃƒÂ¼gen", "Ajouter"),
    create: entry("Generic create button label.", "Create", "Erstellen", "CrÃƒÂ©er"),
    help: entry("Generic help button label.", "Help", "Hilfe", "Aide"),
    delete: entry("Generic delete action label.", "Delete", "LÃƒÂ¶schen", "Supprimer"),
    remove: entry("Generic remove action label.", "Remove", "Entfernen", "Retirer"),
    confirm: entry("Generic confirm button label.", "Confirm", "BestÃƒÂ¤tigen", "Confirmer")
  },
  locale: {
    label: entry("Label for the language selector.", "Language", "Sprache", "Langue"),
    en: entry("English language option.", "English", "English", "Anglais"),
    de: entry("German language option.", "Deutsch", "Deutsch", "Allemand"),
    fr: entry("French language option.", "French", "FranzÃƒÂ¶sisch", "FranÃƒÂ§ais")
  },
  nav: {
    homeAria: entry("Accessible label for the home button in the top navigation.", "ADHD Coach home", "ADHD Coach Startseite", "Accueil ADHD Coach"),
    settingsAria: entry("Accessible label for the settings button in the top navigation.", "Open settings", "Einstellungen ÃƒÂ¶ffnen", "Ouvrir les paramÃƒÂ¨tres"),
    profileAria: entry("Accessible label for the profile button in the top navigation.", "Open profile", "Profil ÃƒÂ¶ffnen", "Ouvrir le profil"),
    logout: entry("Top navigation logout label.", "Logout", "Abmelden", "Se dÃƒÂ©connecter"),
    sectionsAria: entry("ARIA label for the main sections nav.", "Main sections", "Hauptbereiche", "Sections principales"),
    tabsAria: entry("ARIA label for the main tablist.", "Main navigation tabs", "Hauptnavigation", "Onglets principaux")
  },
  pages: {
    morning: {
      title: entry("Top tab title for the planning view.", "Morning", "Morgen", "Matin"),
      subtitle: entry("Top tab subtitle for the planning view.", "Planning setup", "Planung vorbereiten", "PrÃƒÂ©paration du plan"),
      description: entry("Short summary for the planning view.", "Capture energy, prioritize tasks, and confirm the morning plan.", "Energie festhalten, Aufgaben priorisieren und den Morgenplan bestÃƒÂ¤tigen.", "Relever l'ÃƒÂ©nergie, prioriser les tÃƒÂ¢ches et confirmer le plan du matin.")
    },
    today: {
      title: entry("Top tab title for the execution view.", "Today", "Heute", "Aujourd'hui"),
      subtitle: entry("Top tab subtitle for the execution view.", "Work in progress", "In Arbeit", "Travail en cours"),
      description: entry("Short summary for the execution view.", "Execute the confirmed plan with timers, blockers, and completion tracking.", "Den bestÃƒÂ¤tigten Plan mit Timern, Blockaden und Fortschrittsanzeige umsetzen.", "ExÃƒÂ©cuter le plan confirmÃƒÂ© avec minuteries, blocages et suivi d'avancement.")
    },
    debriefing: {
      title: entry("Top tab title for the reflection view.", "Debriefing", "Reflexion", "DÃƒÂ©briefing"),
      subtitle: entry("Top tab subtitle for the reflection view.", "Close the day", "Tag abschliessen", "Clore la journÃƒÂ©e"),
      description: entry("Short summary for the reflection view.", "Review the day, capture interruption patterns, and leave with one next step.", "Den Tag prÃƒÂ¼fen, Unterbrechungsmuster erfassen und mit einem nÃƒÂ¤chsten Schritt abschliessen.", "Revoir la journÃƒÂ©e, repÃƒÂ©rer les interruptions et repartir avec une prochaine action.")
    }
  },
  profile: {
    sectionLabel: entry("Eyebrow label on the profile page.", "Profile", "Profil", "Profil"),
    title: entry("Main profile page heading.", "User profile", "Benutzerprofil", "Profil utilisateur"),
    description: entry("Profile page intro text.", "Review account details, coaching preferences, and activity context.", "Kontodetails, Coaching-Einstellungen und den AktivitÃƒÂ¤tskontext prÃƒÂ¼fen.", "Consulter les informations du compte, les prÃƒÂ©fÃƒÂ©rences de coaching et le contexte d'activitÃƒÂ©."),
    closeAria: entry("Accessible label for the profile close button.", "Close profile page", "Profilseite schliessen", "Fermer la page de profil"),
    badge: entry("Badge on the profile scaffold card.", "Profile", "Profil", "Profil"),
    scaffoldTitle: entry("Profile placeholder title.", "Profile page scaffold", "Profilseite Platzhalter", "Structure de page de profil"),
    scaffoldText: entry("Profile placeholder text.", "Add avatar, identity fields, and profile-specific actions here.", "Hier Avatar, IdentitÃƒÂ¤tsfelder und profilspezifische Aktionen hinzufÃƒÂ¼gen.", "Ajouter ici un avatar, des champs d'identitÃƒÂ© et des actions spÃƒÂ©cifiques au profil.")
  },
  settings: {
    sectionLabel: entry("Eyebrow label on the settings page.", "Settings", "Einstellungen", "ParamÃƒÂ¨tres"),
    title: entry("Main settings page heading.", "Application settings", "App-Einstellungen", "ParamÃƒÂ¨tres de l'application"),
    description: entry("Settings page intro text.", "Configure the debrief question set and the day-planning defaults.", "Das Reflexionsfragen-Set und die Planungs-Standards konfigurieren.", "Configurer le jeu de questions de dÃƒÂ©briefing et les valeurs par dÃƒÂ©faut du planning."),
    closeAria: entry("Accessible label for the settings close button.", "Close settings page", "Einstellungsseite schliessen", "Fermer la page des paramÃƒÂ¨tres"),
    testModeBadge: entry("Badge label for the master test mode card.", "Test mode", "Testmodus", "Mode test"),
    toggleOn: entry("Generic on state label.", "On", "Ein", "ActivÃ©"),
    toggleOff: entry("Generic off state label.", "Off", "Aus", "DÃ©sactivÃ©"),
    masterHeading: entry("Heading above the master test mode card.", "Master switch controls whether test options are available at all.", "Der Hauptschalter steuert, ob Testoptionen Ã¼berhaupt verfÃ¼gbar sind.", "L'interrupteur principal dÃ©termine si les options de test sont disponibles."),
    masterDescription: entry("Help text for the master test mode card.", "Turn it off and the individual modes are cleared and hidden everywhere.", "Schalte ihn aus und die einzelnen Modi werden Ã¼berall zurÃ¼ckgesetzt und ausgeblendet.", "DÃ©sactivez-le et les modes individuels sont effacÃ©s et masquÃ©s partout."),
    storedCurrentDay: entry("Label for the stored current day value.", "Stored current day", "Gespeicherter aktueller Tag", "Jour actuel enregistrÃ©"),
    masterSwitchTitle: entry("Title for the master test mode switch row.", "Master test mode", "Haupt-Testmodus", "Mode test principal"),
    masterSwitchDescription: entry("Description for the master test mode switch row.", "On enables the test controls below. Off clears them and hides them on every page.", "Ein blendet die Test-Steuerelemente unten ein. Aus entfernt sie und blendet sie auf allen Seiten aus.", "ActivÃ© affiche les contrÃ´les de test ci-dessous. DÃ©sactivÃ© les efface et les masque sur toutes les pages."),
    morningModeTitle: entry("Title for the morning date test mode row.", "Set current day manually", "Aktuellen Tag manuell setzen", "DÃ©finir la journÃ©e actuelle manuellement"),
    morningModeDescription: entry("Description for the morning date test mode row.", "Show the Morning date picker and store the selected day locally.", "Den DatumswÃ¤hler im Morgenbereich anzeigen und den gewÃ¤hlten Tag lokal speichern.", "Afficher le sÃ©lecteur de date du matin et enregistrer localement le jour choisi."),
    todaySpeedTitle: entry("Title for the today speed test mode row.", "Set live speed", "Live-Geschwindigkeit setzen", "DÃ©finir la vitesse en direct"),
    todaySpeedDescription: entry("Description for the today speed test mode row.", "Show the Today speed selector and simulate the timer multiplier.", "Den Heute-GeschwindigkeitswÃ¤hler anzeigen und den Zeitmultiplikator simulieren.", "Afficher le sÃ©lecteur de vitesse du jour et simuler le multiplicateur du minuteur."),
    activeSpeedLabel: entry("Label for the currently active speed value.", "Active speed", "Aktive Geschwindigkeit", "Vitesse active"),
    liveSpeed: entry("Fallback label for live speed.", "1x live speed", "1x Live-Geschwindigkeit", "Vitesse en direct 1x"),
    testOptionsHidden: entry("Message shown when test options are disabled.", "Test options are hidden while master test mode is off.", "Testoptionen sind ausgeblendet, solange der Haupt-Testmodus aus ist.", "Les options de test sont masquÃ©es tant que le mode test principal est dÃ©sactivÃ©."),
    questionSetHeading: entry("Heading for the debrief question-set editor.", "Edit each question in its own tab.", "Jede Frage in einem eigenen Tab bearbeiten.", "Modifier chaque question dans son propre onglet."),
    questionSetDescription: entry("Description for the debrief question-set editor.", "Each tab controls one prompt and its own answer scale. Historical submissions keep the version that was active when they were saved.", "Jeder Tab steuert eine Frage und ihre eigene Antwortskala. Historische Einreichungen behalten die Version, die beim Speichern aktiv war.", "Chaque onglet contrÃ´le une question et son Ã©chelle de rÃ©ponses. Les envois historiques conservent la version active au moment de l'enregistrement."),
    answerLabelsBadge: entry("Badge label for the answer-label editor section.", "Answer labels", "Antwortlabels", "LibellÃ©s des rÃ©ponses"),
    answerLabelsUsedFor: entry("Helper text for the answer label editor.", "Used only for Question {{index}}", "Nur fÃ¼r Frage {{index}} verwendet", "UtilisÃ© uniquement pour la question {{index}}"),
    answerLabel: entry("Label for each answer field.", "Answer {{index}}", "Antwort {{index}}", "RÃ©ponse {{index}}"),    debriefBadge: entry("Badge label for the question set card.", "Debrief questions", "Reflexionsfragen", "Questions de dÃƒÂ©briefing"),
    versionLabel: entry("Version label in settings.", "Version", "Version", "Version"),
    titleHint: entry("Heading above the editable questions.", "Move the question text here.", "Den Fragetext hierher verschieben.", "DÃƒÂ©placer le texte des questions ici."),
    helperText: entry("Helper text for the editable questions.", "The debrief page only answers these questions. Each save creates a new local version.", "Die Reflexionsseite beantwortet nur diese Fragen. Jeder Speichervorgang erzeugt eine neue lokale Version.", "La page de dÃƒÂ©briefing rÃƒÂ©pond uniquement ÃƒÂ  ces questions. Chaque enregistrement crÃƒÂ©e une nouvelle version locale."),
    lastUpdated: entry("Timestamp label in settings.", "Last updated", "Zuletzt aktualisiert", "DerniÃƒÂ¨re mise ÃƒÂ  jour"),
    questionLabel: entry("Label shown above each editable question input.", "Question {{index}}", "Frage {{index}}", "Question {{index}}"),
    saveQuestionSet: entry("Save question set button label.", "Save question set", "Fragenset speichern", "Enregistrer le jeu de questions"),
    resetToSaved: entry("Reset button label for the editable question set.", "Reset to saved", "Auf Gespeichert zurÃƒÂ¼cksetzen", "Revenir ÃƒÂ  la version enregistrÃƒÂ©e"),
    plannerBadge: entry("Badge label for planner defaults.", "Planner defaults", "Planer-Standards", "Valeurs par dÃƒÂ©faut du planificateur"),
    plannerTitle: entry("Planner defaults title.", "Local day simulation is stored per test date.", "Die lokale Tages-Simulation wird pro Testdatum gespeichert.", "La simulation locale de la journÃƒÂ©e est enregistrÃƒÂ©e par date de test."),
    plannerText: entry("Planner defaults helper text.", "Use the morning planner to select a test date, then save the plan and debrief answers locally for that day.", "Im Morgenplaner das Testdatum wÃƒÂ¤hlen und dann Plan sowie Reflexionsantworten lokal fÃƒÂ¼r diesen Tag speichern.", "Utiliser le planificateur du matin pour choisir une date de test, puis enregistrer localement le plan et les rÃƒÂ©ponses de dÃƒÂ©briefing pour cette journÃƒÂ©e.")
  }
} as const satisfies Record<string, SourceNode>;

export const getCopy = (locale: Locale) => resolve(copySource, locale);
export const getTranslationEntries = () => flattenEntries(copySource);

export const normalizeLocale = (value: string | null | undefined): Locale => {
  if (value === "de" || value === "fr" || value === "en") {
    return value;
  }

  return "en";
};

export const detectInitialLocale = (): Locale => {
  if (typeof window !== "undefined") {
    const stored = normalizeLocale(window.localStorage.getItem("adhd-coach-static-locale"));
    if (stored) {
      return stored;
    }

    const firstLanguage = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language || "";
    if (firstLanguage.toLowerCase().startsWith("de")) return "de";
    if (firstLanguage.toLowerCase().startsWith("fr")) return "fr";
  }

  return "en";
};

export const persistLocale = (locale: Locale) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("adhd-coach-static-locale", locale);
};

export const getNavTabs = (locale: Locale): NavTab[] => [
  {
    id: "morning",
    panelId: "morning-panel",
    title: getCopy(locale).pages.morning.title,
    subtitle: getCopy(locale).pages.morning.subtitle,
    iconClass: "bi bi-cup-hot"
  },
  {
    id: "today",
    panelId: "today-panel",
    title: getCopy(locale).pages.today.title,
    subtitle: getCopy(locale).pages.today.subtitle,
    iconClass: "bi bi-sun"
  },
  {
    id: "debriefing",
    panelId: "debriefing-panel",
    title: getCopy(locale).pages.debriefing.title,
    subtitle: getCopy(locale).pages.debriefing.subtitle,
    iconClass: "bi bi-chat-dots"
  }
];

export const getInitialTasks = (locale: Locale): Task[] => {
  const content =
    locale === "de"
      ? [
          {
            id: "inbox-cleanup",
            title: "Posteingang aufrÃ¤umen",
            summary: "Nachrichten sortieren und den Tag freimachen.",
            details: "Dringende Nachrichten lÃ¶schen, alles mit Antwortbedarf am selben Tag markieren und den Rest vor Mittag archivieren.",
            actions: ["Auf spÃ¤ter verschieben", "In Teilaufgaben zerlegen", "FÃ¼r heute streichen"]
          },
          {
            id: "client-proposal-revisions",
            title: "Ãœberarbeitung des Kundenangebots",
            summary: "Konzentriertes Schreiben und Entscheiden.",
            details: "Die Zusammenfassung schÃ¤rfen, Zeitannahmen anpassen und den Ã¼berarbeiteten Entwurf vor der NachmittagsprÃ¼fung an die Beteiligten senden.",
            actions: ["Fokusblock einplanen", "Recherchevorbereitung delegieren", "Umfang reduzieren"]
          },
          {
            id: "sprint-planning-check-in",
            title: "Sprint-Planungs-Check-in",
            summary: "Koordination und Abstimmung des Umfangs.",
            details: "Die KapazitÃ¤t des nÃ¤chsten Sprints bestÃ¤tigen, Blocker identifizieren und das Meeting mit klaren Verantwortlichen fÃ¼r jede offene AbhÃ¤ngigkeit verlassen.",
            actions: ["In Checkliste umwandeln", "Besprechungsnotizen anhÃ¤ngen", "Auf morgen verschieben"]
          }
        ]
      : locale === "fr"
        ? [
            {
              id: "inbox-cleanup",
              title: "Nettoyage de la boÃ®te de rÃ©ception",
              summary: "Trier les communications et dÃ©bloquer la journÃ©e.",
              details: "Traiter les messages urgents, signaler ce qui nÃ©cessite une rÃ©ponse le jour mÃªme et archiver le reste avant midi.",
              actions: ["Reporter plus tard", "DÃ©couper en sous-tÃ¢ches", "Retirer pour aujourd'hui"]
            },
            {
              id: "client-proposal-revisions",
              title: "RÃ©visions de la proposition client",
              summary: "RÃ©daction trÃ¨s concentrÃ©e et prise de dÃ©cision.",
              details: "Resserrer le rÃ©sumÃ©, ajuster les hypothÃ¨ses de calendrier et envoyer la version rÃ©visÃ©e aux parties prenantes avant la revue de l'aprÃ¨s-midi.",
              actions: ["Planifier un bloc de concentration", "DÃ©lÃ©guer la prÃ©paration de recherche", "RÃ©duire le pÃ©rimÃ¨tre"]
            },
            {
              id: "sprint-planning-check-in",
              title: "Point de contrÃ´le de planification du sprint",
              summary: "Coordination et alignement du pÃ©rimÃ¨tre.",
              details: "Confirmer la capacitÃ© du prochain sprint, identifier les blocages et quitter la rÃ©union avec un responsable clair pour chaque dÃ©pendance ouverte.",
              actions: ["Convertir en liste de contrÃ´le", "Joindre les notes de rÃ©union", "Reporter Ã  demain"]
            }
          ]
        : [
            {
              id: "inbox-cleanup",
              title: "Inbox cleanup",
              summary: "Triage communications and unblock the day.",
              details: "Clear urgent messages, flag anything that needs a same-day response, and archive the rest before noon.",
              actions: ["Move to later", "Break into subtasks", "Drop for today"]
            },
            {
              id: "client-proposal-revisions",
              title: "Client proposal revisions",
              summary: "High-focus writing and decision making.",
              details: "Tighten the summary, adjust timeline assumptions, and send the revised draft to stakeholders before the afternoon review.",
              actions: ["Schedule focus block", "Delegate research prep", "Reduce scope"]
            },
            {
              id: "sprint-planning-check-in",
              title: "Sprint planning check-in",
              summary: "Coordination and scope alignment.",
              details: "Confirm upcoming sprint capacity, identify blockers, and leave the meeting with a clear owner for each open dependency.",
              actions: ["Convert to checklist", "Attach meeting notes", "Push to tomorrow"]
            }
          ];

  return content.map((task) => ({
    ...task,
    complexity: task.id === "client-proposal-revisions" ? 5 : task.id === "sprint-planning-check-in" ? 3 : 1,
    selected: false,
    done: false
  }));
};

export const getInitialBacklogTasks = (locale: Locale): BacklogTask[] => {
  const content =
    locale === "de"
      ? [
          {
            id: "backlog-weekly-review",
            title: "Vorbereitung des WochenrÃ¼ckblicks",
            summary: "Offene Punkte vor der Planung der nÃ¤chsten Woche sammeln.",
            details: "Erfolge, Blocker und verschobene Punkte zusammenfassen, um den Planungsaufwand zu senken.",
            actions: ["In Teilaufgaben zerlegen", "Auf spÃ¤ter verschieben"],
            dueDate: null,
            complexity: 2
          },
          {
            id: "backlog-doc-cleanup",
            title: "Dokumentation bereinigen",
            summary: "Veraltete Prozessnotizen schÃ¤rfen.",
            details: "Dokumente mit aktueller ZustÃ¤ndigkeit, Links und Entscheidungshistorie aktualisieren.",
            actions: ["Umfang reduzieren", "Auf spÃ¤ter verschieben"],
            dueDate: null,
            complexity: 3
          }
        ]
      : locale === "fr"
        ? [
            {
              id: "backlog-weekly-review",
              title: "PrÃ©paration de la revue hebdomadaire",
              summary: "Rassembler les boucles ouvertes avant de planifier la semaine suivante.",
              details: "RÃ©sumer les rÃ©ussites, les blocages et les Ã©lÃ©ments reportÃ©s afin de rÃ©duire la charge de planification.",
              actions: ["DÃ©couper en sous-tÃ¢ches", "Reporter plus tard"],
              dueDate: null,
              complexity: 2
            },
            {
              id: "backlog-doc-cleanup",
              title: "Nettoyage de la documentation",
              summary: "Resserre les notes de processus obsolÃ¨tes.",
              details: "Actualiser les documents avec les responsabilitÃ©s, liens et historiques de dÃ©cision actuels.",
              actions: ["RÃ©duire le pÃ©rimÃ¨tre", "Reporter plus tard"],
              dueDate: null,
              complexity: 3
            }
          ]
        : [
            {
              id: "backlog-weekly-review",
              title: "Weekly review prep",
              summary: "Collect open loops before planning next week.",
              details: "Summarize wins, blockers, and deferred items to reduce planning overhead.",
              actions: ["Break into subtasks", "Move to later"],
              dueDate: null,
              complexity: 2
            },
            {
              id: "backlog-doc-cleanup",
              title: "Documentation cleanup",
              summary: "Tighten outdated process notes.",
              details: "Refresh docs with current ownership, links, and decision history.",
              actions: ["Reduce scope", "Move to later"],
              dueDate: null,
              complexity: 3
            }
          ];

  return content.map((task) => ({ ...task, selected: false, done: false }));
};

export const getDefaultQuestionSet = (locale: Locale): DebriefQuestionSet => ({
  version: 1,
  questions:
    locale === "de"
      ? [
          "Was hat dir geholfen, engagiert zu bleiben, als der Tag abzudriften begann?",
          "Wo fÃ¼hlte sich die Arbeit schwerer an als erwartet?",
          "Welche ErholungsmaÃŸnahme hat dir tatsÃ¤chlich geholfen, wieder an die Aufgabe zu kommen?"
        ]
      : locale === "fr"
        ? [
            "Qu'est-ce qui t'a aidÃ© Ã  rester engagÃ© quand la journÃ©e a commencÃ© Ã  dÃ©river ?",
            "OÃ¹ le travail s'est-il rÃ©vÃ©lÃ© plus lourd que prÃ©vu ?",
            "Quel geste de rÃ©cupÃ©ration t'a rÃ©ellement aidÃ© Ã  revenir Ã  la tÃ¢che ?"
          ]
        : [
            "What helped you stay engaged when the day started to drift?",
            "Where did the work feel heavier than expected?",
            "What recovery move actually helped you get back on task?"
          ],
    answerOptions:
      locale === "de"
        ? [
            ["Überhaupt nicht", "Ein wenig", "Etwas", "Grösstenteils", "Sehr stark"],
            ["Überhaupt nicht", "Ein wenig", "Etwas", "Grösstenteils", "Sehr stark"],
            ["Überhaupt nicht", "Ein wenig", "Etwas", "Grösstenteils", "Sehr stark"]
          ]
        : locale === "fr"
          ? [
              ["Pas du tout", "Un peu", "Assez", "Majoritairement", "Tout à fait"],
              ["Pas du tout", "Un peu", "Assez", "Majoritairement", "Tout à fait"],
              ["Pas du tout", "Un peu", "Assez", "Majoritairement", "Tout à fait"]
            ]
          : [
              ["Not at all", "A little", "Somewhat", "Mostly", "Very much"],
              ["Not at all", "A little", "Somewhat", "Mostly", "Very much"],
              ["Not at all", "A little", "Somewhat", "Mostly", "Very much"]
            ],
  updatedAt: new Date().toISOString()
});

export const getAnswerOptions = (locale: Locale) =>
  (locale === "de"
    ? ["Ãœberhaupt nicht", "Ein wenig", "Etwas", "GrÃ¶sstenteils", "Sehr stark"]
    : locale === "fr"
      ? ["Pas du tout", "Un peu", "Assez", "Majoritairement", "Tout Ã  fait"]
      : ["Not at all", "A little", "Somewhat", "Mostly", "Very much"]
  ).map((label, index) => ({ value: (index + 1) as 1 | 2 | 3 | 4 | 5, label }));


