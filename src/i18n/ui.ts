import type { Locale } from "./locale";

const uiCopy = {
  en: {
    planner: {
      testDateLabel: "Test date",
      localStorageNote: "Plan and debrief data are stored locally for this date.",
      complexityWarning: "Total planned complexity is above the recommended threshold for a focused day.",
      morningSequence: "Morning sequence",
      morningTitle: "Build a plan that matches today's capacity",
      morningIntro: "Capture energy first, then shape the task load before making a commitment.",
      todayIs: "Today is the {{date}}",
      manualDayLabel: "Set current day manually"
    },
    complexitySummaryCard: {
      title: "Daily complexity",
      recalculateAria: "Recalculate daily complexity gauge",
      levels: {
        light: "Light",
        moderate: "Moderate",
        high: "High"
      },
      threshold: "Recommended threshold: 10 points",
      pointsLabel: "points"
    },
    energyStepSection: {
      title: "Set your energy baseline",
      description: "Choose the level that best reflects what you can realistically sustain this morning.",
      groupAria: "Energy selection"
    },
    tasksStepSection: {
      title: "Rank the task list",
      description: "Drag tasks into the right order, check complexity load, and open details or actions as needed.",
      addTaskAria: "Add new task",
      removeSelectedAria: "Remove selected tasks",
      help: "Help",
      confirm: "Confirm tasks and go to Today",
      removeModalTitle: "Remove selected tasks",
      removeModalBody: "Should selected tasks be completely deleted, or only removed from this planner and kept in backlog?",
      removeFromPlanner: "Remove from planner",
      deleteCompletely: "Delete completely"
    },
    addTaskModal: {
      ariaLabel: "Add task",
      backlogTitle: "Backlog",
      newTaskTitle: "Create a new task",
      intro: "Choose a task from backlog or create a completely new one.",
      emptyBacklog: "No backlog tasks available.",
      add: "Add",
      titleLabel: "Title",
      titlePlaceholder: "What needs to be done?",
      summaryLabel: "Subtext (optional)",
      summaryPlaceholder: "Helpful context for the task",
      complexityLabel: "Estimated complexity",
      calculateComplexity: "Calculate complexity",
      storeInBacklog: "Store in backlog",
      dueDateLabel: "Due date (optional)",
      duePrefix: "due",
      backToBacklog: "Back to backlog",
      close: "Close",
      createNewTask: "Create new task",
      saveToBacklog: "Save to backlog",
      addToToday: "Add to today"
    },
    taskDetailsModal: {
      defaultTitle: "Task details",
      primaryAction: "Mark ready"
    },
    step2HelpModal: {
      title: "Step 2 Help",
      intro: "Use this step to rank your tasks for today in a realistic order.",
      tips: [
        "Drag cards with the handle on the left to reorder priorities.",
        "Use the complexity marker to keep workload balanced.",
        "Use the details button to open context and available actions per task.",
        "When the order looks right, confirm tasks to move to Today."
      ]
    },
    placeholderPanel: {
      today: {
        badge: "Today",
        title: "Working view placeholder",
        text: "This section is ready for active tasks, timers, blockers, and in-progress checkpoints using the same component language."
      },
      debriefing: {
        badge: "Debriefing",
        title: "Day-close placeholder",
        text: "Use this space for reflection prompts, wins, unfinished tasks, and tomorrow prep after the workday ends."
      }
    },
    pomodoroOverlay: {
      ariaLabel: "Pomodoro timer overlay",
      title: "Pomodoro",
      cycle: "{{minutes}} minute cycle",
      close: "Close",
      start: "Start"
    },
    taskCard: {
      dragAria: "Drag to reorder",
      selectAria: "Select {{title}} for removal",
      complexityAria: "Complexity {{value}}",
      detailsAria: "Open task details and actions"
    },
    todayTaskCard: {
      blocked: "Blocked",
      tracking: "Tracking",
      markDoneAria: "Mark {{title}} as done",
      complexityAria: "Complexity {{value}}",
      play: "Play",
      block: "Block",
      openPomodoroAria: "Open Pomodoro",
      minutesSuffix: "m"
    },
    todayPanel: {
      eyebrow: "Today execution",
      title: "Work from your confirmed morning plan",
      intro: "Click the timer circle to open the Pomodoro overlay.",
      speedLabel: "Test day speed",
      speedAria: "Test day speed",
      simulationNote: "Simulation only. All running timers advance at the selected speed.",
      liveSpeedNote: "Today is running at live speed.",
      tasksTitle: "Today tasks",
      tasksDescription: "Only the top unblocked task can start. Block unlocks the next task.",
      allCompleted: "All planned tasks are completed.",
      achievedTitle: "Achieved goals of today",
      achievedDescription: "Completed items are moved here automatically.",
      noCompleted: "No completed goals yet."
    },
    debriefingPage: {
      heroBadge: "End-of-day debrief",
      heroEyebrow: "Append-only reflection trail",
      heroTitle: "Close the day without turning it into a scorecard.",
      heroLead: "Review the work, notice the friction honestly, and leave with one practical adjustment for tomorrow.",
      selectedDate: "Selected test date",
      summaryHeading: "Coaching-style summary",
      summaryLead: "One acknowledgment, one signal, one next move.",
      versionLabel: "Version",
      actualFocus: "Actual focus",
      actualFocusNote: "Planned break already removed",
      expectedBaseline: "Expected baseline",
      expectedBaselineNote: "medium complexity snapshot",
      timeRatio: "Time ratio",
      questionsHeading: "Questions from Settings",
      questionsLead: "These are read-only here. Answers are stored locally as numbers, while you see text labels.",
      storedValueHidden: "Stored value: hidden",
      questionLabel: "Question {{index}}",
      optionalNote: "Optional note",
      submit: "Submit debrief",
      historyHeading: "Submission history",
      historyLead: "Historical entries keep the question version that was active when they were submitted.",
      simulateCheckin: "Simulate check-in",
      submissionVersion: "Submission v{{version}}",
      noSubmissions: "No submissions yet for this test date.",
      interruptionHeading: "Interruption breakdown",
      interruptionTime: "Interrupted time",
      checkinsSummary: "Check-ins sent: {{sent}} | answered: {{answered}}",
      strategyHeading: "Heartbeat and check-in strategy",
      strategy: [
        "Foreground heartbeats are expected about every 90 seconds during active focus.",
        "Two missed heartbeats trigger a check-in; the channel prefers in-app first, then push.",
        "Mobile browsers can throttle background JavaScript, so resume pings matter when the page returns to foreground."
      ],
      eventLogHeading: "Event log",
      interruptionLabel: "{{kind}} interruption",
      checkinSentLabel: "Check-in sent",
      checkinAnsweredLabel: "Check-in answered",
      channelLabel: "Channel: {{channel}}",
      answerLabel: "Answer: {{answer}}",
      initialNote: "The first reset worked once messages were closed.",
      localeLabels: {
        submissions: "submissions",
        causes: {
          external: "external context switches",
          internal: "internal distractions"
        },
        kind: {
          internal: "internal",
          external: "external"
        },
        channel: {
          in_app: "in-app",
          push: "push"
        },
        answer: {
          yes_still_on_task: "yes, still on task",
          paused: "paused",
          switched: "switched"
        }
      },
      status: {
        onTrack: "On track",
        extraRunway: "Needed extra runway",
        highFriction: "High friction day"
      },
      coaching: {
        highInterruptions: {
          acknowledgment: "You kept momentum through a noisy day and still closed the loop.",
          insight: "Most friction came from {{dominantCause}}, with about {{minutes}} of interrupted time.",
          nextStep: "Tomorrow: start with one protected 20-minute sprint before checking messages."
        },
        extraRunway: {
          acknowledgment: "You held the work together without losing the thread.",
          insight: "Your pacing landed at {{ratio}} of the baseline, while interruptions stayed contained.",
          nextStep: "Tomorrow: split the opening step in half or move the task up one complexity level."
        },
        onTrack: {
          acknowledgment: "You matched the plan with steady follow-through.",
          insight: "The day finished on the expected rhythm, with no major recovery cost.",
          nextStep: "Tomorrow: repeat the same opening routine and keep the first sprint length unchanged."
        },
        default: {
          acknowledgment: "You kept moving even when the day pushed back.",
          insight: "The session landed in a {{status}} pattern at {{ratio}} of plan.",
          nextStep: "Tomorrow: add a short buffer before the first deep-work block."
        }
      }
    }
  },
  de: {
    planner: {
      testDateLabel: "Testdatum",
      localStorageNote: "Plan- und Debrief-Daten werden für dieses Datum lokal gespeichert.",
      complexityWarning: "Die gesamte geplante Komplexität liegt über dem empfohlenen Grenzwert für einen fokussierten Tag.",
      morningSequence: "Morgenablauf",
      morningTitle: "Erstelle einen Plan, der zur heutigen Kapazität passt",
      morningIntro: "Erfasse zuerst deine Energie und forme dann die Aufgabenlast, bevor du dich festlegst.",
      todayIs: "Heute ist der {{date}}",
      manualDayLabel: "Aktuellen Tag manuell setzen"
    },
    complexitySummaryCard: {
      title: "Tägliche Komplexität",
      recalculateAria: "Tägliche Komplexitätsanzeige neu berechnen",
      levels: {
        light: "Leicht",
        moderate: "Mittel",
        high: "Hoch"
      },
      threshold: "Empfohlener Grenzwert: 10 Punkte",
      pointsLabel: "Punkte"
    },
    energyStepSection: {
      title: "Energie-Basiswert festlegen",
      description: "Wähle das Niveau, das am besten widerspiegelt, was du heute Morgen realistisch halten kannst.",
      groupAria: "Energieauswahl"
    },
    tasksStepSection: {
      title: "Aufgabenliste priorisieren",
      description: "Ziehe Aufgaben in die richtige Reihenfolge, prüfe die Komplexitätslast und öffne bei Bedarf Details oder Aktionen.",
      addTaskAria: "Neue Aufgabe hinzufügen",
      removeSelectedAria: "Ausgewählte Aufgaben entfernen",
      help: "Hilfe",
      confirm: "Aufgaben bestätigen und zu Heute wechseln",
      removeModalTitle: "Ausgewählte Aufgaben entfernen",
      removeModalBody: "Sollen ausgewählte Aufgaben vollständig gelöscht oder nur aus diesem Planer entfernt und im Backlog behalten werden?",
      removeFromPlanner: "Aus dem Planer entfernen",
      deleteCompletely: "Vollständig löschen"
    },
    addTaskModal: {
      ariaLabel: "Aufgabe hinzufügen",
      backlogTitle: "Backlog",
      newTaskTitle: "Neue Aufgabe erstellen",
      intro: "Wähle eine Aufgabe aus dem Backlog oder erstelle eine komplett neue.",
      emptyBacklog: "Keine Backlog-Aufgaben verfügbar.",
      add: "Hinzufügen",
      titleLabel: "Titel",
      titlePlaceholder: "Was muss erledigt werden?",
      summaryLabel: "Untertext (optional)",
      summaryPlaceholder: "Hilfreicher Kontext für die Aufgabe",
      complexityLabel: "Geschätzte Komplexität",
      calculateComplexity: "Komplexität berechnen",
      storeInBacklog: "Im Backlog speichern",
      dueDateLabel: "Fälligkeitsdatum (optional)",
      duePrefix: "fällig am",
      backToBacklog: "Zurück zum Backlog",
      close: "Schließen",
      createNewTask: "Neue Aufgabe erstellen",
      saveToBacklog: "Im Backlog speichern",
      addToToday: "Zu heute hinzufügen"
    },
    taskDetailsModal: {
      defaultTitle: "Aufgabendetails",
      primaryAction: "Als bereit markieren"
    },
    step2HelpModal: {
      title: "Hilfe zu Schritt 2",
      intro: "Nutze diesen Schritt, um deine Aufgaben für heute in einer realistischen Reihenfolge zu ordnen.",
      tips: [
        "Ziehe Karten mit dem Griff links, um Prioritäten neu zu ordnen.",
        "Nutze den Komplexitätsmarker, um die Arbeitslast auszugleichen.",
        "Nutze die Detail-Schaltfläche, um Kontext und verfügbare Aktionen je Aufgabe zu öffnen.",
        "Wenn die Reihenfolge stimmt, bestätige die Aufgaben, um zu Heute zu wechseln."
      ]
    },
    placeholderPanel: {
      today: {
        badge: "Heute",
        title: "Platzhalter für die Arbeitsansicht",
        text: "Dieser Bereich ist bereit für aktive Aufgaben, Timer, Blockaden und laufende Kontrollpunkte mit derselben Komponentensprache."
      },
      debriefing: {
        badge: "Reflexion",
        title: "Platzhalter für den Tagesabschluss",
        text: "Nutze diesen Bereich für Reflexionsfragen, Erfolge, offene Aufgaben und die Vorbereitung auf morgen nach Feierabend."
      }
    },
    pomodoroOverlay: {
      ariaLabel: "Pomodoro-Timer-Overlay",
      title: "Pomodoro",
      cycle: "{{minutes}}-Minuten-Zyklus",
      close: "Schließen",
      start: "Starten"
    },
    taskCard: {
      dragAria: "Zum Neuordnen ziehen",
      selectAria: "{{title}} zum Entfernen auswählen",
      complexityAria: "Komplexität {{value}}",
      detailsAria: "Aufgabendetails und Aktionen öffnen"
    },
    todayTaskCard: {
      blocked: "Blockiert",
      tracking: "Tracking",
      markDoneAria: "{{title}} als erledigt markieren",
      complexityAria: "Komplexität {{value}}",
      play: "Start",
      block: "Blockieren",
      openPomodoroAria: "Pomodoro öffnen",
      minutesSuffix: "Min."
    },
    todayPanel: {
      eyebrow: "Heute ausführen",
      title: "Arbeite nach deinem bestätigten Morgenplan",
      intro: "Klicke auf den Timer-Kreis, um das Pomodoro-Overlay zu öffnen.",
      speedLabel: "Test-Tagesgeschwindigkeit",
      speedAria: "Test-Tagesgeschwindigkeit",
      simulationNote: "Nur Simulation. Alle laufenden Timer laufen mit der gewählten Geschwindigkeit weiter.",
      liveSpeedNote: "Heute läuft in Echtzeitgeschwindigkeit.",
      tasksTitle: "Aufgaben für heute",
      tasksDescription: "Nur die oberste nicht blockierte Aufgabe kann starten. Blockieren gibt die nächste Aufgabe frei.",
      allCompleted: "Alle geplanten Aufgaben sind erledigt.",
      achievedTitle: "Heutige erledigte Ziele",
      achievedDescription: "Erledigte Einträge werden hier automatisch verschoben.",
      noCompleted: "Noch keine erledigten Ziele."
    },
    debriefingPage: {
      heroBadge: "Tagesabschluss-Reflexion",
      heroEyebrow: "Nur anhängende Reflexionsspur",
      heroTitle: "Schliesse den Tag ab, ohne ihn zu einer Bewertung zu machen.",
      heroLead: "Prüfe die Arbeit, erkenne Reibung ehrlich an und gehe mit einer praktischen Anpassung für morgen weiter.",
      selectedDate: "Ausgewähltes Testdatum",
      summaryHeading: "Coaching-Zusammenfassung",
      summaryLead: "Eine Anerkennung, ein Signal, ein nächster Schritt.",
      versionLabel: "Version",
      actualFocus: "Tatsächlicher Fokus",
      actualFocusNote: "Geplante Pause bereits abgezogen",
      expectedBaseline: "Erwartete Basis",
      expectedBaselineNote: "Snapshot mittlerer Komplexität",
      timeRatio: "Zeitverhältnis",
      questionsHeading: "Fragen aus den Einstellungen",
      questionsLead: "Hier sind sie schreibgeschützt. Antworten werden lokal als Zahlen gespeichert, während du Textlabels siehst.",
      storedValueHidden: "Gespeicherter Wert: verborgen",
      questionLabel: "Frage {{index}}",
      optionalNote: "Optionale Notiz",
      submit: "Reflexion absenden",
      historyHeading: "Einreichungsverlauf",
      historyLead: "Historische Einträge behalten die Fragenversion bei, die beim Absenden aktiv war.",
      simulateCheckin: "Check-in simulieren",
      submissionVersion: "Einreichung v{{version}}",
      noSubmissions: "Für dieses Testdatum gibt es noch keine Einreichungen.",
      interruptionHeading: "Unterbrechungsübersicht",
      interruptionTime: "Unterbrochene Zeit",
      checkinsSummary: "Check-ins gesendet: {{sent}} | beantwortet: {{answered}}",
      strategyHeading: "Heartbeat- und Check-in-Strategie",
      strategy: [
        "Im Vordergrund werden während aktiver Fokusphasen etwa alle 90 Sekunden Heartbeats erwartet.",
        "Zwei verpasste Heartbeats lösen einen Check-in aus; bevorzugt wird zuerst In-App, dann Push.",
        "Mobile Browser drosseln JavaScript im Hintergrund, daher sind Wiederaufnahme-Pings wichtig, wenn die Seite wieder in den Vordergrund kommt."
      ],
      eventLogHeading: "Ereignisprotokoll",
      interruptionLabel: "{{kind}}-Unterbrechung",
      checkinSentLabel: "Check-in gesendet",
      checkinAnsweredLabel: "Check-in beantwortet",
      channelLabel: "Kanal: {{channel}}",
      answerLabel: "Antwort: {{answer}}",
      initialNote: "Der erste Neustart funktionierte, sobald die Nachrichten geschlossen waren.",
      localeLabels: {
        submissions: "Einreichungen",
        causes: {
          external: "externe Kontextwechsel",
          internal: "interne Ablenkungen"
        },
        kind: {
          internal: "intern",
          external: "extern"
        },
        channel: {
          in_app: "In-App",
          push: "Push"
        },
        answer: {
          yes_still_on_task: "ja, noch bei der Aufgabe",
          paused: "pausiert",
          switched: "gewechselt"
        }
      },
      status: {
        onTrack: "Im Plan",
        extraRunway: "Mehr Puffer nötig",
        highFriction: "Tag mit hoher Reibung"
      },
      coaching: {
        highInterruptions: {
          acknowledgment: "Du hast den Schwung durch einen lauten Tag gehalten und trotzdem den Kreis geschlossen.",
          insight: "Die meiste Reibung kam von {{dominantCause}}, mit etwa {{minutes}} unterbrochener Zeit.",
          nextStep: "Morgen: mit einem geschützten 20-Minuten-Sprint starten, bevor Nachrichten geprüft werden."
        },
        extraRunway: {
          acknowledgment: "Du hast die Arbeit zusammengehalten, ohne den Faden zu verlieren.",
          insight: "Dein Tempo lag bei {{ratio}} der Basis, während die Unterbrechungen begrenzt blieben.",
          nextStep: "Morgen: den ersten Schritt halbieren oder die Aufgabe eine Komplexitätsstufe nach oben verschieben."
        },
        onTrack: {
          acknowledgment: "Du hast den Plan mit ruhiger Konsequenz erfüllt.",
          insight: "Der Tag endete im erwarteten Rhythmus, ohne grosse Erholungskosten.",
          nextStep: "Morgen: dieselbe Einstiegsroutine wiederholen und die Länge des ersten Sprints beibehalten."
        },
        default: {
          acknowledgment: "Du bist weitergegangen, auch als der Tag sich gewehrt hat.",
          insight: "Die Sitzung landete in einem {{status}}-Muster bei {{ratio}} des Plans.",
          nextStep: "Morgen: einen kurzen Puffer vor dem ersten Deep-Work-Block einbauen."
        }
      }
    }
  },
  fr: {
    planner: {
      testDateLabel: "Date de test",
      localStorageNote: "Le plan et les données de débriefing sont stockés localement pour cette date.",
      complexityWarning: "La complexité totale prévue dépasse le seuil recommandé pour une journée de concentration.",
      morningSequence: "Séquence du matin",
      morningTitle: "Construis un plan qui correspond à la capacité d'aujourd'hui",
      morningIntro: "Commence par l'énergie, puis ajuste la charge des tâches avant de t'engager.",
      todayIs: "Nous sommes le {{date}}",
      manualDayLabel: "Définir manuellement le jour actuel"
    },
    complexitySummaryCard: {
      title: "Complexité du jour",
      recalculateAria: "Recalculer la jauge de complexité du jour",
      levels: {
        light: "Léger",
        moderate: "Modéré",
        high: "Élevé"
      },
      threshold: "Seuil recommandé : 10 points",
      pointsLabel: "points"
    },
    energyStepSection: {
      title: "Définir votre niveau d'énergie",
      description: "Choisissez le niveau qui reflète le mieux ce que vous pouvez réellement tenir ce matin.",
      groupAria: "Sélection de l'énergie"
    },
    tasksStepSection: {
      title: "Classer la liste de tâches",
      description: "Faites glisser les tâches dans le bon ordre, vérifiez la charge de complexité et ouvrez les détails ou actions si nécessaire.",
      addTaskAria: "Ajouter une tâche",
      removeSelectedAria: "Supprimer les tâches sélectionnées",
      help: "Aide",
      confirm: "Confirmer les tâches et passer à Aujourd'hui",
      removeModalTitle: "Supprimer les tâches sélectionnées",
      removeModalBody: "Les tâches sélectionnées doivent-elles être entièrement supprimées ou seulement retirées de ce planificateur et conservées dans le backlog ?",
      removeFromPlanner: "Retirer du planificateur",
      deleteCompletely: "Supprimer complètement"
    },
    addTaskModal: {
      ariaLabel: "Ajouter une tâche",
      backlogTitle: "Backlog",
      newTaskTitle: "Créer une nouvelle tâche",
      intro: "Choisissez une tâche depuis le backlog ou créez-en une totalement nouvelle.",
      emptyBacklog: "Aucune tâche de backlog disponible.",
      add: "Ajouter",
      titleLabel: "Titre",
      titlePlaceholder: "Qu'est-ce qu'il faut faire ?",
      summaryLabel: "Sous-texte (facultatif)",
      summaryPlaceholder: "Contexte utile pour la tâche",
      complexityLabel: "Complexité estimée",
      calculateComplexity: "Calculer la complexité",
      storeInBacklog: "Enregistrer dans le backlog",
      dueDateLabel: "Date d'échéance (facultative)",
      duePrefix: "échéance",
      backToBacklog: "Retour au backlog",
      close: "Fermer",
      createNewTask: "Créer une nouvelle tâche",
      saveToBacklog: "Enregistrer dans le backlog",
      addToToday: "Ajouter à Aujourd'hui"
    },
    taskDetailsModal: {
      defaultTitle: "Détails de la tâche",
      primaryAction: "Marquer comme prêt"
    },
    step2HelpModal: {
      title: "Aide à l'étape 2",
      intro: "Utilisez cette étape pour classer vos tâches du jour dans un ordre réaliste.",
      tips: [
        "Faites glisser les cartes avec la poignée à gauche pour réorganiser les priorités.",
        "Utilisez l'indicateur de complexité pour équilibrer la charge de travail.",
        "Utilisez le bouton des détails pour ouvrir le contexte et les actions disponibles pour chaque tâche.",
        "Quand l'ordre vous convient, confirmez les tâches pour passer à Aujourd'hui."
      ]
    },
    placeholderPanel: {
      today: {
        badge: "Aujourd'hui",
        title: "Espace réservé pour la vue de travail",
        text: "Cette section est prête pour les tâches actives, les minuteries, les blocages et les jalons en cours avec le même langage de composants."
      },
      debriefing: {
        badge: "Débriefing",
        title: "Espace réservé pour la clôture de journée",
        text: "Utilisez cet espace pour les questions de réflexion, les réussites, les tâches inachevées et la préparation de demain après la fin de la journée."
      }
    },
    pomodoroOverlay: {
      ariaLabel: "Fenêtre du minuteur Pomodoro",
      title: "Pomodoro",
      cycle: "Cycle de {{minutes}} minutes",
      close: "Fermer",
      start: "Démarrer"
    },
    taskCard: {
      dragAria: "Faire glisser pour réorganiser",
      selectAria: "Sélectionner {{title}} pour suppression",
      complexityAria: "Complexité {{value}}",
      detailsAria: "Ouvrir les détails et actions de la tâche"
    },
    todayTaskCard: {
      blocked: "Bloquée",
      tracking: "Suivi",
      markDoneAria: "Marquer {{title}} comme terminée",
      complexityAria: "Complexité {{value}}",
      play: "Lancer",
      block: "Bloquer",
      openPomodoroAria: "Ouvrir Pomodoro",
      minutesSuffix: "min"
    },
    todayPanel: {
      eyebrow: "Exécution du jour",
      title: "Travaillez à partir de votre plan du matin confirmé",
      intro: "Cliquez sur le cercle du minuteur pour ouvrir la fenêtre Pomodoro.",
      speedLabel: "Vitesse du jour de test",
      speedAria: "Vitesse du jour de test",
      simulationNote: "Simulation uniquement. Tous les minuteurs en cours avancent à la vitesse sélectionnée.",
      liveSpeedNote: "Aujourd'hui fonctionne à la vitesse réelle.",
      tasksTitle: "Tâches du jour",
      tasksDescription: "Seule la tâche supérieure non bloquée peut démarrer. Le blocage débloque la tâche suivante.",
      allCompleted: "Toutes les tâches prévues sont terminées.",
      achievedTitle: "Objectifs accomplis aujourd'hui",
      achievedDescription: "Les éléments terminés sont déplacés ici automatiquement.",
      noCompleted: "Aucun objectif terminé pour le moment."
    },
    debriefingPage: {
      heroBadge: "Débriefing de fin de journée",
      heroEyebrow: "Journal de réflexion en ajout seulement",
      heroTitle: "Clôturez la journée sans en faire une feuille de score.",
      heroLead: "Passez le travail en revue, constatez honnêtement les frictions et repartez avec un ajustement pratique pour demain.",
      selectedDate: "Date de test sélectionnée",
      summaryHeading: "Résumé de type coaching",
      summaryLead: "Une reconnaissance, un signal, un prochain mouvement.",
      versionLabel: "Version",
      actualFocus: "Concentration réelle",
      actualFocusNote: "Pause prévue déjà retirée",
      expectedBaseline: "Référence attendue",
      expectedBaselineNote: "instantané de complexité moyenne",
      timeRatio: "Ratio temporel",
      questionsHeading: "Questions depuis les paramètres",
      questionsLead: "Ici, elles sont en lecture seule. Les réponses sont stockées localement sous forme de nombres, tandis que vous voyez des libellés textuels.",
      storedValueHidden: "Valeur enregistrée : masquée",
      questionLabel: "Question {{index}}",
      optionalNote: "Note facultative",
      submit: "Soumettre le débrief",
      historyHeading: "Historique des envois",
      historyLead: "Les entrées historiques conservent la version des questions active au moment de l'envoi.",
      simulateCheckin: "Simuler un point de contrôle",
      submissionVersion: "Soumission v{{version}}",
      noSubmissions: "Aucune soumission pour cette date de test.",
      interruptionHeading: "Répartition des interruptions",
      interruptionTime: "Temps interrompu",
      checkinsSummary: "Points de contrôle envoyés : {{sent}} | répondus : {{answered}}",
      strategyHeading: "Stratégie de battement et de point de contrôle",
      strategy: [
        "Les battements en premier plan sont attendus environ toutes les 90 secondes pendant la concentration active.",
        "Deux battements manqués déclenchent un point de contrôle ; le canal privilégie d'abord l'application, puis les notifications push.",
        "Les navigateurs mobiles peuvent ralentir le JavaScript en arrière-plan, donc les signaux de reprise comptent quand la page revient au premier plan."
      ],
      eventLogHeading: "Journal des événements",
      interruptionLabel: "Interruption {{kind}}",
      checkinSentLabel: "Point de contrôle envoyé",
      checkinAnsweredLabel: "Point de contrôle répondu",
      channelLabel: "Canal : {{channel}}",
      answerLabel: "Réponse : {{answer}}",
      initialNote: "La première remise à zéro a fonctionné une fois les messages fermés.",
      localeLabels: {
        submissions: "soumissions",
        causes: {
          external: "changements de contexte externes",
          internal: "distractions internes"
        },
        kind: {
          internal: "interne",
          external: "externe"
        },
        channel: {
          in_app: "dans l'application",
          push: "push"
        },
        answer: {
          yes_still_on_task: "oui, toujours sur la tâche",
          paused: "en pause",
          switched: "changé"
        }
      },
      status: {
        onTrack: "Dans les temps",
        extraRunway: "Besoin de plus de marge",
        highFriction: "Journée à forte friction"
      },
      coaching: {
        highInterruptions: {
          acknowledgment: "Vous avez gardé l'élan malgré une journée bruyante et vous avez quand même bouclé la boucle.",
          insight: "La majeure partie de la friction venait de {{dominantCause}}, avec environ {{minutes}} de temps interrompu.",
          nextStep: "Demain : commencez par un sprint protégé de 20 minutes avant de consulter les messages."
        },
        extraRunway: {
          acknowledgment: "Vous avez maintenu le travail sans perdre le fil.",
          insight: "Votre rythme a atteint {{ratio}} de la base, tandis que les interruptions sont restées contenues.",
          nextStep: "Demain : divisez l'étape d'ouverture en deux ou faites monter la tâche d'un niveau de complexité."
        },
        onTrack: {
          acknowledgment: "Vous avez respecté le plan avec une régularité constante.",
          insight: "La journée s'est terminée au rythme attendu, sans coût majeur de récupération.",
          nextStep: "Demain : répétez la même routine d'ouverture et gardez la durée du premier sprint inchangée."
        },
        default: {
          acknowledgment: "Vous avez continué à avancer même quand la journée résistait.",
          insight: "La session s'est inscrite dans un schéma {{status}} à {{ratio}} du plan.",
          nextStep: "Demain : ajoutez une courte marge avant le premier bloc de travail profond."
        }
      }
    }
  }
} as const;

export type UiCopy = (typeof uiCopy)[Locale];

export const getUiCopy = (locale: Locale): UiCopy => uiCopy[locale];



