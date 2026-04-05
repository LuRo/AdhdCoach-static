import type { Locale } from "./locale";

const uiCopy = {
  en: {
    planner: {
      testDateLabel: "Test date",
      localStorageNote: "Plan and debrief data are stored locally for this date.",
      complexityWarning: "Total planned complexity is above the recommended threshold for a focused day."
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
      localStorageNote: "Plan- und Debrief-Daten werden f�r dieses Datum lokal gespeichert.",
      complexityWarning: "Die gesamte geplante Komplexit�t liegt �ber dem empfohlenen Grenzwert f�r einen fokussierten Tag."
    },
    complexitySummaryCard: {
      title: "T�gliche Komplexit�t",
      recalculateAria: "T�gliche Komplexit�tsanzeige neu berechnen",
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
      description: "W�hle das Niveau, das am besten widerspiegelt, was du heute Morgen realistisch halten kannst.",
      groupAria: "Energieauswahl"
    },
    tasksStepSection: {
      title: "Aufgabenliste priorisieren",
      description: "Ziehe Aufgaben in die richtige Reihenfolge, pr�fe die Komplexit�tslast und �ffne bei Bedarf Details oder Aktionen.",
      addTaskAria: "Neue Aufgabe hinzuf�gen",
      removeSelectedAria: "Ausgew�hlte Aufgaben entfernen",
      help: "Hilfe",
      confirm: "Aufgaben best�tigen und zu Heute wechseln",
      removeModalTitle: "Ausgew�hlte Aufgaben entfernen",
      removeModalBody: "Sollen ausgew�hlte Aufgaben vollst�ndig gel�scht oder nur aus diesem Planer entfernt und im Backlog behalten werden?",
      removeFromPlanner: "Aus dem Planer entfernen",
      deleteCompletely: "Vollst�ndig l�schen"
    },
    addTaskModal: {
      ariaLabel: "Aufgabe hinzuf�gen",
      backlogTitle: "Backlog",
      newTaskTitle: "Neue Aufgabe erstellen",
      intro: "W�hle eine Aufgabe aus dem Backlog oder erstelle eine komplett neue.",
      emptyBacklog: "Keine Backlog-Aufgaben verf�gbar.",
      add: "Hinzuf�gen",
      titleLabel: "Titel",
      titlePlaceholder: "Was muss erledigt werden?",
      summaryLabel: "Untertext (optional)",
      summaryPlaceholder: "Hilfreicher Kontext f�r die Aufgabe",
      complexityLabel: "Gesch�tzte Komplexit�t",
      calculateComplexity: "Komplexit�t berechnen",
      storeInBacklog: "Im Backlog speichern",
      dueDateLabel: "F�lligkeitsdatum (optional)",
      duePrefix: "f�llig am",
      backToBacklog: "Zur�ck zum Backlog",
      close: "Schliessen",
      createNewTask: "Neue Aufgabe erstellen",
      saveToBacklog: "Im Backlog speichern",
      addToToday: "Zu heute hinzuf�gen"
    },
    taskDetailsModal: {
      defaultTitle: "Aufgabendetails",
      primaryAction: "Als bereit markieren"
    },
    step2HelpModal: {
      title: "Hilfe zu Schritt 2",
      intro: "Nutze diesen Schritt, um deine Aufgaben f�r heute in einer realistischen Reihenfolge zu ordnen.",
      tips: [
        "Ziehe Karten mit dem Griff links, um Priorit�ten neu zu ordnen.",
        "Nutze den Komplexit�tsmarker, um die Arbeitslast auszugleichen.",
        "Nutze die Detail-Schaltfl�che, um Kontext und verf�gbare Aktionen je Aufgabe zu �ffnen.",
        "Wenn die Reihenfolge stimmt, best�tige die Aufgaben, um zu Heute zu wechseln."
      ]
    },
    placeholderPanel: {
      today: {
        badge: "Heute",
        title: "Platzhalter f�r die Arbeitsansicht",
        text: "Dieser Bereich ist bereit f�r aktive Aufgaben, Timer, Blockaden und laufende Kontrollpunkte mit derselben Komponentensprache."
      },
      debriefing: {
        badge: "Reflexion",
        title: "Platzhalter f�r den Tagesabschluss",
        text: "Nutze diesen Bereich f�r Reflexionsfragen, Erfolge, offene Aufgaben und die Vorbereitung auf morgen nach Feierabend."
      }
    },
    pomodoroOverlay: {
      ariaLabel: "Pomodoro-Timer-Overlay",
      title: "Pomodoro",
      cycle: "{{minutes}}-Minuten-Zyklus",
      close: "Schliessen",
      start: "Starten"
    },
    taskCard: {
      dragAria: "Zum Neuordnen ziehen",
      selectAria: "{{title}} zum Entfernen ausw�hlen",
      complexityAria: "Komplexit�t {{value}}",
      detailsAria: "Aufgabendetails und Aktionen �ffnen"
    },
    todayTaskCard: {
      blocked: "Blockiert",
      tracking: "Tracking",
      markDoneAria: "{{title}} als erledigt markieren",
      complexityAria: "Komplexit�t {{value}}",
      play: "Start",
      block: "Blockieren",
      openPomodoroAria: "Pomodoro �ffnen",
      minutesSuffix: "Min."
    },
    todayPanel: {
      eyebrow: "Heute ausf�hren",
      title: "Arbeite nach deinem best�tigten Morgenplan",
      intro: "Klicke auf den Timer-Kreis, um das Pomodoro-Overlay zu �ffnen.",
      speedLabel: "Test-Tagesgeschwindigkeit",
      speedAria: "Test-Tagesgeschwindigkeit",
      simulationNote: "Nur Simulation. Alle laufenden Timer laufen mit der gew�hlten Geschwindigkeit weiter.",
      tasksTitle: "Aufgaben f�r heute",
      tasksDescription: "Nur die oberste nicht blockierte Aufgabe kann starten. Blockieren gibt die n�chste Aufgabe frei.",
      allCompleted: "Alle geplanten Aufgaben sind erledigt.",
      achievedTitle: "Heutige erledigte Ziele",
      achievedDescription: "Erledigte Eintr�ge werden hier automatisch verschoben.",
      noCompleted: "Noch keine erledigten Ziele."
    },
    debriefingPage: {
      heroBadge: "Tagesabschluss-Reflexion",
      heroEyebrow: "Nur anh�ngende Reflexionsspur",
      heroTitle: "Schliesse den Tag ab, ohne ihn zu einer Bewertung zu machen.",
      heroLead: "Pr�fe die Arbeit, erkenne Reibung ehrlich an und gehe mit einer praktischen Anpassung f�r morgen weiter.",
      selectedDate: "Ausgew�hltes Testdatum",
      summaryHeading: "Coaching-Zusammenfassung",
      summaryLead: "Eine Anerkennung, ein Signal, ein n�chster Schritt.",
      versionLabel: "Version",
      actualFocus: "Tats�chlicher Fokus",
      actualFocusNote: "Geplante Pause bereits abgezogen",
      expectedBaseline: "Erwartete Basis",
      expectedBaselineNote: "Snapshot mittlerer Komplexit�t",
      timeRatio: "Zeitverh�ltnis",
      questionsHeading: "Fragen aus den Einstellungen",
      questionsLead: "Hier sind sie schreibgesch�tzt. Antworten werden lokal als Zahlen gespeichert, w�hrend du Textlabels siehst.",
      storedValueHidden: "Gespeicherter Wert: verborgen",
      questionLabel: "Frage {{index}}",
      optionalNote: "Optionale Notiz",
      submit: "Reflexion absenden",
      historyHeading: "Einreichungsverlauf",
      historyLead: "Historische Eintr�ge behalten die Fragenversion bei, die beim Absenden aktiv war.",
      simulateCheckin: "Check-in simulieren",
      submissionVersion: "Einreichung v{{version}}",
      noSubmissions: "F�r dieses Testdatum gibt es noch keine Einreichungen.",
      interruptionHeading: "Unterbrechungs�bersicht",
      interruptionTime: "Unterbrochene Zeit",
      checkinsSummary: "Check-ins gesendet: {{sent}} | beantwortet: {{answered}}",
      strategyHeading: "Heartbeat- und Check-in-Strategie",
      strategy: [
        "Im Vordergrund werden w�hrend aktiver Fokusphasen etwa alle 90 Sekunden Heartbeats erwartet.",
        "Zwei verpasste Heartbeats l�sen einen Check-in aus; bevorzugt wird zuerst In-App, dann Push.",
        "Mobile Browser drosseln JavaScript im Hintergrund, daher sind Wiederaufnahme-Pings wichtig, wenn die Seite wieder in den Vordergrund kommt."
      ],
      eventLogHeading: "Ereignisprotokoll",
      interruptionLabel: "{{kind}}-Unterbrechung",
      checkinSentLabel: "Check-in gesendet",
      checkinAnsweredLabel: "Check-in beantwortet",
      channelLabel: "Kanal: {{channel}}",
      answerLabel: "Antwort: {{answer}}",
      status: {
        onTrack: "Im Plan",
        extraRunway: "Mehr Puffer n�tig",
        highFriction: "Tag mit hoher Reibung"
      },
      coaching: {
        highInterruptions: {
          acknowledgment: "Du hast den Schwung durch einen lauten Tag gehalten und trotzdem den Kreis geschlossen.",
          insight: "Die meiste Reibung kam von {{dominantCause}}, mit etwa {{minutes}} unterbrochener Zeit.",
          nextStep: "Morgen: mit einem gesch�tzten 20-Minuten-Sprint starten, bevor Nachrichten gepr�ft werden."
        },
        extraRunway: {
          acknowledgment: "Du hast die Arbeit zusammengehalten, ohne den Faden zu verlieren.",
          insight: "Dein Tempo lag bei {{ratio}} der Basis, w�hrend die Unterbrechungen begrenzt blieben.",
          nextStep: "Morgen: den ersten Schritt halbieren oder die Aufgabe eine Komplexit�tsstufe nach oben verschieben."
        },
        onTrack: {
          acknowledgment: "Du hast den Plan mit ruhiger Konsequenz erf�llt.",
          insight: "Der Tag endete im erwarteten Rhythmus, ohne grosse Erholungskosten.",
          nextStep: "Morgen: dieselbe Einstiegsroutine wiederholen und die L�nge des ersten Sprints beibehalten."
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
      localStorageNote: "Le plan et les donn�es de d�briefing sont stock�s localement pour cette date.",
      complexityWarning: "La complexit� totale pr�vue d�passe le seuil recommand� pour une journ�e de concentration."
    },
    complexitySummaryCard: {
      title: "Complexit� du jour",
      recalculateAria: "Recalculer la jauge de complexit� du jour",
      levels: {
        light: "L�ger",
        moderate: "Mod�r�",
        high: "�lev�"
      },
      threshold: "Seuil recommand� : 10 points",
      pointsLabel: "points"
    },
    energyStepSection: {
      title: "D�finir votre niveau d'�nergie",
      description: "Choisissez le niveau qui refl�te le mieux ce que vous pouvez r�ellement tenir ce matin.",
      groupAria: "S�lection de l'�nergie"
    },
    tasksStepSection: {
      title: "Classer la liste de t�ches",
      description: "Faites glisser les t�ches dans le bon ordre, v�rifiez la charge de complexit� et ouvrez les d�tails ou actions si n�cessaire.",
      addTaskAria: "Ajouter une t�che",
      removeSelectedAria: "Supprimer les t�ches s�lectionn�es",
      help: "Aide",
      confirm: "Confirmer les t�ches et passer � Aujourd'hui",
      removeModalTitle: "Supprimer les t�ches s�lectionn�es",
      removeModalBody: "Les t�ches s�lectionn�es doivent-elles �tre enti�rement supprim�es ou seulement retir�es de ce planificateur et conserv�es dans le backlog ?",
      removeFromPlanner: "Retirer du planificateur",
      deleteCompletely: "Supprimer compl�tement"
    },
    addTaskModal: {
      ariaLabel: "Ajouter une t�che",
      backlogTitle: "Backlog",
      newTaskTitle: "Cr�er une nouvelle t�che",
      intro: "Choisissez une t�che depuis le backlog ou cr�ez-en une totalement nouvelle.",
      emptyBacklog: "Aucune t�che de backlog disponible.",
      add: "Ajouter",
      titleLabel: "Titre",
      titlePlaceholder: "Qu'est-ce qu'il faut faire ?",
      summaryLabel: "Sous-texte (facultatif)",
      summaryPlaceholder: "Contexte utile pour la t�che",
      complexityLabel: "Complexit� estim�e",
      calculateComplexity: "Calculer la complexit�",
      storeInBacklog: "Enregistrer dans le backlog",
      dueDateLabel: "Date d'�ch�ance (facultative)",
      duePrefix: "�ch�ance",
      backToBacklog: "Retour au backlog",
      close: "Fermer",
      createNewTask: "Cr�er une nouvelle t�che",
      saveToBacklog: "Enregistrer dans le backlog",
      addToToday: "Ajouter � Aujourd'hui"
    },
    taskDetailsModal: {
      defaultTitle: "D�tails de la t�che",
      primaryAction: "Marquer comme pr�t"
    },
    step2HelpModal: {
      title: "Aide � l'�tape 2",
      intro: "Utilisez cette �tape pour classer vos t�ches du jour dans un ordre r�aliste.",
      tips: [
        "Faites glisser les cartes avec la poign�e � gauche pour r�organiser les priorit�s.",
        "Utilisez l'indicateur de complexit� pour �quilibrer la charge de travail.",
        "Utilisez le bouton des d�tails pour ouvrir le contexte et les actions disponibles pour chaque t�che.",
        "Quand l'ordre vous convient, confirmez les t�ches pour passer � Aujourd'hui."
      ]
    },
    placeholderPanel: {
      today: {
        badge: "Aujourd'hui",
        title: "Espace r�serv� pour la vue de travail",
        text: "Cette section est pr�te pour les t�ches actives, les minuteries, les blocages et les jalons en cours avec le m�me langage de composants."
      },
      debriefing: {
        badge: "D�briefing",
        title: "Espace r�serv� pour la cl�ture de journ�e",
        text: "Utilisez cet espace pour les questions de r�flexion, les r�ussites, les t�ches inachev�es et la pr�paration de demain apr�s la fin de la journ�e."
      }
    },
    pomodoroOverlay: {
      ariaLabel: "Fen�tre du minuteur Pomodoro",
      title: "Pomodoro",
      cycle: "Cycle de {{minutes}} minutes",
      close: "Fermer",
      start: "D�marrer"
    },
    taskCard: {
      dragAria: "Faire glisser pour r�organiser",
      selectAria: "S�lectionner {{title}} pour suppression",
      complexityAria: "Complexit� {{value}}",
      detailsAria: "Ouvrir les d�tails et actions de la t�che"
    },
    todayTaskCard: {
      blocked: "Bloqu�e",
      tracking: "Suivi",
      markDoneAria: "Marquer {{title}} comme termin�e",
      complexityAria: "Complexit� {{value}}",
      play: "Lancer",
      block: "Bloquer",
      openPomodoroAria: "Ouvrir Pomodoro",
      minutesSuffix: "min"
    },
    todayPanel: {
      eyebrow: "Ex�cution du jour",
      title: "Travaillez � partir de votre plan du matin confirm�",
      intro: "Cliquez sur le cercle du minuteur pour ouvrir la fen�tre Pomodoro.",
      speedLabel: "Vitesse du jour de test",
      speedAria: "Vitesse du jour de test",
      simulationNote: "Simulation uniquement. Tous les minuteurs en cours avancent � la vitesse s�lectionn�e.",
      tasksTitle: "T�ches du jour",
      tasksDescription: "Seule la t�che sup�rieure non bloqu�e peut d�marrer. Le blocage d�bloque la t�che suivante.",
      allCompleted: "Toutes les t�ches pr�vues sont termin�es.",
      achievedTitle: "Objectifs accomplis aujourd'hui",
      achievedDescription: "Les �l�ments termin�s sont d�plac�s ici automatiquement.",
      noCompleted: "Aucun objectif termin� pour le moment."
    },
    debriefingPage: {
      heroBadge: "D�briefing de fin de journ�e",
      heroEyebrow: "Journal de r�flexion en ajout seulement",
      heroTitle: "Cl�turez la journ�e sans en faire une feuille de score.",
      heroLead: "Passez le travail en revue, constatez honn�tement les frictions et repartez avec un ajustement pratique pour demain.",
      selectedDate: "Date de test s�lectionn�e",
      summaryHeading: "R�sum� de type coaching",
      summaryLead: "Une reconnaissance, un signal, un prochain mouvement.",
      versionLabel: "Version",
      actualFocus: "Concentration r�elle",
      actualFocusNote: "Pause pr�vue d�j� retir�e",
      expectedBaseline: "R�f�rence attendue",
      expectedBaselineNote: "instantan� de complexit� moyenne",
      timeRatio: "Ratio temporel",
      questionsHeading: "Questions depuis les param�tres",
      questionsLead: "Ici, elles sont en lecture seule. Les r�ponses sont stock�es localement sous forme de nombres, tandis que vous voyez des libell�s textuels.",
      storedValueHidden: "Valeur enregistr�e : masqu�e",
      questionLabel: "Question {{index}}",
      optionalNote: "Note facultative",
      submit: "Soumettre le d�brief",
      historyHeading: "Historique des envois",
      historyLead: "Les entr�es historiques conservent la version des questions active au moment de l'envoi.",
      simulateCheckin: "Simuler un point de contr�le",
      submissionVersion: "Soumission v{{version}}",
      noSubmissions: "Aucune soumission pour cette date de test.",
      interruptionHeading: "R�partition des interruptions",
      interruptionTime: "Temps interrompu",
      checkinsSummary: "Points de contr�le envoy�s : {{sent}} | r�pondus : {{answered}}",
      strategyHeading: "Strat�gie de battement et de point de contr�le",
      strategy: [
        "Les battements en premier plan sont attendus environ toutes les 90 secondes pendant la concentration active.",
        "Deux battements manqu�s d�clenchent un point de contr�le ; le canal privil�gie d'abord l'application, puis les notifications push.",
        "Les navigateurs mobiles peuvent ralentir le JavaScript en arri�re-plan, donc les signaux de reprise comptent quand la page revient au premier plan."
      ],
      eventLogHeading: "Journal des �v�nements",
      interruptionLabel: "Interruption {{kind}}",
      checkinSentLabel: "Point de contr�le envoy�",
      checkinAnsweredLabel: "Point de contr�le r�pondu",
      channelLabel: "Canal : {{channel}}",
      answerLabel: "R�ponse : {{answer}}",
      status: {
        onTrack: "Dans les temps",
        extraRunway: "Besoin de plus de marge",
        highFriction: "Journ�e � forte friction"
      },
      coaching: {
        highInterruptions: {
          acknowledgment: "Vous avez gard� l'�lan malgr� une journ�e bruyante et vous avez quand m�me boucl� la boucle.",
          insight: "La majeure partie de la friction venait de {{dominantCause}}, avec environ {{minutes}} de temps interrompu.",
          nextStep: "Demain : commencez par un sprint prot�g� de 20 minutes avant de consulter les messages."
        },
        extraRunway: {
          acknowledgment: "Vous avez maintenu le travail sans perdre le fil.",
          insight: "Votre rythme a atteint {{ratio}} de la base, tandis que les interruptions sont rest�es contenues.",
          nextStep: "Demain : divisez l'�tape d'ouverture en deux ou faites monter la t�che d'un niveau de complexit�."
        },
        onTrack: {
          acknowledgment: "Vous avez respect� le plan avec une r�gularit� constante.",
          insight: "La journ�e s'est termin�e au rythme attendu, sans co�t majeur de r�cup�ration.",
          nextStep: "Demain : r�p�tez la m�me routine d'ouverture et gardez la dur�e du premier sprint inchang�e."
        },
        default: {
          acknowledgment: "Vous avez continu� � avancer m�me quand la journ�e r�sistait.",
          insight: "La session s'est inscrite dans un sch�ma {{status}} � {{ratio}} du plan.",
          nextStep: "Demain : ajoutez une courte marge avant le premier bloc de travail profond."
        }
      }
    }
  }
} as const;

export type UiCopy = (typeof uiCopy)[Locale];

export const getUiCopy = (locale: Locale): UiCopy => uiCopy[locale];


