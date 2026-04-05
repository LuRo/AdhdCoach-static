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
    reset: entry("Generic reset button label.", "Reset", "ZurÃ¼cksetzen", "RÃ©initialiser"),
    add: entry("Generic add button label.", "Add", "HinzufÃ¼gen", "Ajouter"),
    create: entry("Generic create button label.", "Create", "Erstellen", "CrÃ©er"),
    help: entry("Generic help button label.", "Help", "Hilfe", "Aide"),
    delete: entry("Generic delete action label.", "Delete", "LÃ¶schen", "Supprimer"),
    remove: entry("Generic remove action label.", "Remove", "Entfernen", "Retirer"),
    confirm: entry("Generic confirm button label.", "Confirm", "BestÃ¤tigen", "Confirmer")
  },
  locale: {
    label: entry("Label for the language selector.", "Language", "Sprache", "Langue"),
    en: entry("English language option.", "English", "English", "Anglais"),
    de: entry("German language option.", "Deutsch", "Deutsch", "Allemand"),
    fr: entry("French language option.", "French", "FranzÃ¶sisch", "FranÃ§ais")
  },
  nav: {
    homeAria: entry("Accessible label for the home button in the top navigation.", "ADHD Coach home", "ADHD Coach Startseite", "Accueil ADHD Coach"),
    settingsAria: entry("Accessible label for the settings button in the top navigation.", "Open settings", "Einstellungen Ã¶ffnen", "Ouvrir les paramÃ¨tres"),
    profileAria: entry("Accessible label for the profile button in the top navigation.", "Open profile", "Profil Ã¶ffnen", "Ouvrir le profil"),
    logout: entry("Top navigation logout label.", "Logout", "Abmelden", "Se dÃ©connecter"),
    sectionsAria: entry("ARIA label for the main sections nav.", "Main sections", "Hauptbereiche", "Sections principales"),
    tabsAria: entry("ARIA label for the main tablist.", "Main navigation tabs", "Hauptnavigation", "Onglets principaux")
  },
  pages: {
    morning: {
      title: entry("Top tab title for the planning view.", "Morning", "Morgen", "Matin"),
      subtitle: entry("Top tab subtitle for the planning view.", "Planning setup", "Planung vorbereiten", "PrÃ©paration du plan"),
      description: entry("Short summary for the planning view.", "Capture energy, prioritize tasks, and confirm the morning plan.", "Energie festhalten, Aufgaben priorisieren und den Morgenplan bestÃ¤tigen.", "Relever l'Ã©nergie, prioriser les tÃ¢ches et confirmer le plan du matin.")
    },
    today: {
      title: entry("Top tab title for the execution view.", "Today", "Heute", "Aujourd'hui"),
      subtitle: entry("Top tab subtitle for the execution view.", "Work in progress", "In Arbeit", "Travail en cours"),
      description: entry("Short summary for the execution view.", "Execute the confirmed plan with timers, blockers, and completion tracking.", "Den bestÃ¤tigten Plan mit Timern, Blockaden und Fortschrittsanzeige umsetzen.", "ExÃ©cuter le plan confirmÃ© avec minuteries, blocages et suivi d'avancement.")
    },
    debriefing: {
      title: entry("Top tab title for the reflection view.", "Debriefing", "Reflexion", "DÃ©briefing"),
      subtitle: entry("Top tab subtitle for the reflection view.", "Close the day", "Tag abschliessen", "Clore la journÃ©e"),
      description: entry("Short summary for the reflection view.", "Review the day, capture interruption patterns, and leave with one next step.", "Den Tag prÃ¼fen, Unterbrechungsmuster erfassen und mit einem nÃ¤chsten Schritt abschliessen.", "Revoir la journÃ©e, repÃ©rer les interruptions et repartir avec une prochaine action.")
    }
  },
  profile: {
    sectionLabel: entry("Eyebrow label on the profile page.", "Profile", "Profil", "Profil"),
    title: entry("Main profile page heading.", "User profile", "Benutzerprofil", "Profil utilisateur"),
    description: entry("Profile page intro text.", "Review account details, coaching preferences, and activity context.", "Kontodetails, Coaching-Einstellungen und den AktivitÃ¤tskontext prÃ¼fen.", "Consulter les informations du compte, les prÃ©fÃ©rences de coaching et le contexte d'activitÃ©."),
    closeAria: entry("Accessible label for the profile close button.", "Close profile page", "Profilseite schliessen", "Fermer la page de profil"),
    badge: entry("Badge on the profile scaffold card.", "Profile", "Profil", "Profil"),
    scaffoldTitle: entry("Profile placeholder title.", "Profile page scaffold", "Profilseite Platzhalter", "Structure de page de profil"),
    scaffoldText: entry("Profile placeholder text.", "Add avatar, identity fields, and profile-specific actions here.", "Hier Avatar, IdentitÃ¤tsfelder und profilspezifische Aktionen hinzufÃ¼gen.", "Ajouter ici un avatar, des champs d'identitÃ© et des actions spÃ©cifiques au profil.")
  },
  settings: {
    sectionLabel: entry("Eyebrow label on the settings page.", "Settings", "Einstellungen", "ParamÃ¨tres"),
    title: entry("Main settings page heading.", "Application settings", "App-Einstellungen", "ParamÃ¨tres de l'application"),
    description: entry("Settings page intro text.", "Configure the debrief question set and the day-planning defaults.", "Das Reflexionsfragen-Set und die Planungs-Standards konfigurieren.", "Configurer le jeu de questions de dÃ©briefing et les valeurs par dÃ©faut du planning."),
    closeAria: entry("Accessible label for the settings close button.", "Close settings page", "Einstellungsseite schliessen", "Fermer la page des paramÃ¨tres"),
    debriefBadge: entry("Badge label for the question set card.", "Debrief questions", "Reflexionsfragen", "Questions de dÃ©briefing"),
    versionLabel: entry("Version label in settings.", "Version", "Version", "Version"),
    titleHint: entry("Heading above the editable questions.", "Move the question text here.", "Den Fragetext hierher verschieben.", "DÃ©placer le texte des questions ici."),
    helperText: entry("Helper text for the editable questions.", "The debrief page only answers these questions. Each save creates a new local version.", "Die Reflexionsseite beantwortet nur diese Fragen. Jeder Speichervorgang erzeugt eine neue lokale Version.", "La page de dÃ©briefing rÃ©pond uniquement Ã  ces questions. Chaque enregistrement crÃ©e une nouvelle version locale."),
    lastUpdated: entry("Timestamp label in settings.", "Last updated", "Zuletzt aktualisiert", "DerniÃ¨re mise Ã  jour"),
    questionLabel: entry("Label shown above each editable question input.", "Question {{index}}", "Frage {{index}}", "Question {{index}}"),
    saveQuestionSet: entry("Save question set button label.", "Save question set", "Fragenset speichern", "Enregistrer le jeu de questions"),
    resetToSaved: entry("Reset button label for the editable question set.", "Reset to saved", "Auf Gespeichert zurÃ¼cksetzen", "Revenir Ã  la version enregistrÃ©e"),
    plannerBadge: entry("Badge label for planner defaults.", "Planner defaults", "Planer-Standards", "Valeurs par dÃ©faut du planificateur"),
    plannerTitle: entry("Planner defaults title.", "Local day simulation is stored per test date.", "Die lokale Tages-Simulation wird pro Testdatum gespeichert.", "La simulation locale de la journÃ©e est enregistrÃ©e par date de test."),
    plannerText: entry("Planner defaults helper text.", "Use the morning planner to select a test date, then save the plan and debrief answers locally for that day.", "Im Morgenplaner das Testdatum wÃ¤hlen und dann Plan sowie Reflexionsantworten lokal fÃ¼r diesen Tag speichern.", "Utiliser le planificateur du matin pour choisir une date de test, puis enregistrer localement le plan et les rÃ©ponses de dÃ©briefing pour cette journÃ©e.")
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
            title: "Posteingang aufräumen",
            summary: "Nachrichten sortieren und den Tag freimachen.",
            details: "Dringende Nachrichten löschen, alles mit Antwortbedarf am selben Tag markieren und den Rest vor Mittag archivieren.",
            actions: ["Auf später verschieben", "In Teilaufgaben zerlegen", "Für heute streichen"]
          },
          {
            id: "client-proposal-revisions",
            title: "Überarbeitung des Kundenangebots",
            summary: "Konzentriertes Schreiben und Entscheiden.",
            details: "Die Zusammenfassung schärfen, Zeitannahmen anpassen und den überarbeiteten Entwurf vor der Nachmittagsprüfung an die Beteiligten senden.",
            actions: ["Fokusblock einplanen", "Recherchevorbereitung delegieren", "Umfang reduzieren"]
          },
          {
            id: "sprint-planning-check-in",
            title: "Sprint-Planungs-Check-in",
            summary: "Koordination und Abstimmung des Umfangs.",
            details: "Die Kapazität des nächsten Sprints bestätigen, Blocker identifizieren und das Meeting mit klaren Verantwortlichen für jede offene Abhängigkeit verlassen.",
            actions: ["In Checkliste umwandeln", "Besprechungsnotizen anhängen", "Auf morgen verschieben"]
          }
        ]
      : locale === "fr"
        ? [
            {
              id: "inbox-cleanup",
              title: "Nettoyage de la boîte de réception",
              summary: "Trier les communications et débloquer la journée.",
              details: "Traiter les messages urgents, signaler ce qui nécessite une réponse le jour même et archiver le reste avant midi.",
              actions: ["Reporter plus tard", "Découper en sous-tâches", "Retirer pour aujourd'hui"]
            },
            {
              id: "client-proposal-revisions",
              title: "Révisions de la proposition client",
              summary: "Rédaction très concentrée et prise de décision.",
              details: "Resserrer le résumé, ajuster les hypothèses de calendrier et envoyer la version révisée aux parties prenantes avant la revue de l'après-midi.",
              actions: ["Planifier un bloc de concentration", "Déléguer la préparation de recherche", "Réduire le périmètre"]
            },
            {
              id: "sprint-planning-check-in",
              title: "Point de contrôle de planification du sprint",
              summary: "Coordination et alignement du périmètre.",
              details: "Confirmer la capacité du prochain sprint, identifier les blocages et quitter la réunion avec un responsable clair pour chaque dépendance ouverte.",
              actions: ["Convertir en liste de contrôle", "Joindre les notes de réunion", "Reporter à demain"]
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
            title: "Vorbereitung des Wochenrückblicks",
            summary: "Offene Punkte vor der Planung der nächsten Woche sammeln.",
            details: "Erfolge, Blocker und verschobene Punkte zusammenfassen, um den Planungsaufwand zu senken.",
            actions: ["In Teilaufgaben zerlegen", "Auf später verschieben"],
            dueDate: null,
            complexity: 2
          },
          {
            id: "backlog-doc-cleanup",
            title: "Dokumentation bereinigen",
            summary: "Veraltete Prozessnotizen schärfen.",
            details: "Dokumente mit aktueller Zuständigkeit, Links und Entscheidungshistorie aktualisieren.",
            actions: ["Umfang reduzieren", "Auf später verschieben"],
            dueDate: null,
            complexity: 3
          }
        ]
      : locale === "fr"
        ? [
            {
              id: "backlog-weekly-review",
              title: "Préparation de la revue hebdomadaire",
              summary: "Rassembler les boucles ouvertes avant de planifier la semaine suivante.",
              details: "Résumer les réussites, les blocages et les éléments reportés afin de réduire la charge de planification.",
              actions: ["Découper en sous-tâches", "Reporter plus tard"],
              dueDate: null,
              complexity: 2
            },
            {
              id: "backlog-doc-cleanup",
              title: "Nettoyage de la documentation",
              summary: "Resserre les notes de processus obsolètes.",
              details: "Actualiser les documents avec les responsabilités, liens et historiques de décision actuels.",
              actions: ["Réduire le périmètre", "Reporter plus tard"],
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
          "Wo fühlte sich die Arbeit schwerer an als erwartet?",
          "Welche Erholungsmaßnahme hat dir tatsächlich geholfen, wieder an die Aufgabe zu kommen?"
        ]
      : locale === "fr"
        ? [
            "Qu'est-ce qui t'a aidé à rester engagé quand la journée a commencé à dériver ?",
            "Où le travail s'est-il révélé plus lourd que prévu ?",
            "Quel geste de récupération t'a réellement aidé à revenir à la tâche ?"
          ]
        : [
            "What helped you stay engaged when the day started to drift?",
            "Where did the work feel heavier than expected?",
            "What recovery move actually helped you get back on task?"
          ],
  updatedAt: new Date().toISOString()
});

export const getAnswerOptions = (locale: Locale) =>
  (locale === "de"
    ? ["Überhaupt nicht", "Ein wenig", "Etwas", "Grösstenteils", "Sehr stark"]
    : locale === "fr"
      ? ["Pas du tout", "Un peu", "Assez", "Majoritairement", "Tout à fait"]
      : ["Not at all", "A little", "Somewhat", "Mostly", "Very much"]
  ).map((label, index) => ({ value: (index + 1) as 1 | 2 | 3 | 4 | 5, label }));


