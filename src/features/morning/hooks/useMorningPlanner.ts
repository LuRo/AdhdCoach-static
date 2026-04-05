import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COMPLEXITY_MAX, COMPLEXITY_THRESHOLD } from "../constants";
import { getInitialBacklogTasks, getInitialTasks, type Locale } from "../../../i18n/copy";
import { getPlannerSnapshot, getSelectedTestDate, savePlannerSnapshot, setSelectedTestDate } from "../store";
import type {
  BacklogTask,
  ComplexitySnapshot,
  CreateTaskInput,
  DaySpeedMultiplier,
  EnergyLevel,
  PomodoroMinutes,
  RemoveSelectedMode,
  StepId,
  TabId,
  Task,
  TodayTask
} from "../types";

interface GaugeAnimation {
  angle: number;
  transition: string;
}

const reorder = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

const getComplexitySnapshot = (tasks: Task[]): ComplexitySnapshot => {
  const total = tasks.reduce((sum, task) => sum + task.complexity, 0);
  const status = total > COMPLEXITY_THRESHOLD ? "Overloaded" : total >= 6 ? "Moderate" : "Light";
  const ratio = Math.min(total / COMPLEXITY_MAX, 1);
  const angle = -180 + ratio * 180;

  return { total, status, angle };
};

const toTodayTask = (task: Task): TodayTask => ({
  ...task,
  selected: false,
  done: false,
  pomodoroMinutes: 5,
  timerRemainingSeconds: 5 * 60,
  timerRunning: false,
  blocked: false,
  workElapsedSeconds: 0,
  workTimerRunning: false
});

const cloneForToday = (tasks: Task[]): TodayTask[] => tasks.map((task) => toTodayTask(task));

export const useMorningPlanner = (locale: Locale = "en") => {
  const [activeTab, setActiveTab] = useState<TabId>("morning");
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>("Medium");
  const [tasks, setTasks] = useState<Task[]>(() => getInitialTasks(locale));
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>([]);
  const [backlogTasks, setBacklogTasks] = useState<BacklogTask[]>(() => getInitialBacklogTasks(locale));
  const [taskDetailsTaskId, setTaskDetailsTaskId] = useState<string | null>(null);
  const [pomodoroOverlayTaskId, setPomodoroOverlayTaskId] = useState<string | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [tasksLocked, setTasksLocked] = useState(false);
  const [testDaySpeed, setTestDaySpeed] = useState<DaySpeedMultiplier>(1);
  const [gauge, setGauge] = useState<GaugeAnimation>({
    angle: -180,
    transition: "transform 420ms ease-out"
  });
  const [selectedTestDate, setSelectedTestDateState] = useState(() => getSelectedTestDate());

  const timers = useRef<number[]>([]);

  const complexity = useMemo(() => getComplexitySnapshot(tasks), [tasks]);
  const hasTaskSelection = useMemo(() => tasks.some((task) => task.selected), [tasks]);
  const activeTodayTaskId = useMemo(() => {
    const firstUnblocked = todayTasks.find((task) => !task.done && !task.blocked);
    if (firstUnblocked) {
      return firstUnblocked.id;
    }

    const firstBlocked = todayTasks.find((task) => !task.done && task.blocked);
    return firstBlocked?.id ?? null;
  }, [todayTasks]);
  const selectedTask = useMemo(
    () =>
      tasks.find((task) => task.id === taskDetailsTaskId) ??
      todayTasks.find((task) => task.id === taskDetailsTaskId) ??
      null,
    [taskDetailsTaskId, tasks, todayTasks]
  );

  const pomodoroOverlayTask = useMemo(
    () => todayTasks.find((task) => task.id === pomodoroOverlayTaskId) ?? null,
    [pomodoroOverlayTaskId, todayTasks]
  );

  const clearTimers = useCallback(() => {
    timers.current.forEach((timerId) => window.clearTimeout(timerId));
    timers.current = [];
  }, []);

  const setGaugeAngle = useCallback((angle: number, transition: string) => {
    setGauge({ angle, transition });
  }, []);

  const updateGaugeFromTasks = useCallback(() => {
    const snapshot = getComplexitySnapshot(tasks);
    setGaugeAngle(snapshot.angle, "transform 420ms ease-out");
  }, [setGaugeAngle, tasks]);

  const animateGaugeRecalculation = useCallback(() => {
    const snapshot = getComplexitySnapshot(tasks);

    clearTimers();
    setGaugeAngle(-180, "transform 180ms ease-out");

    const timerA = window.setTimeout(() => {
      setGaugeAngle(0, "transform 320ms ease-in-out");

      const timerB = window.setTimeout(() => {
        setGaugeAngle(snapshot.angle, "transform 420ms ease-out");
      }, 340);

      timers.current.push(timerB);
    }, 180);

    timers.current.push(timerA);
  }, [clearTimers, setGaugeAngle, tasks]);

  const setActiveTabFromPanel = useCallback((panelId: string) => {
    const nextTab = panelId.replace("-panel", "") as TabId;
    setActiveTab(nextTab);
  }, []);

  const openStep = useCallback((step: StepId) => {
    setCurrentStep(step);
  }, []);

  const chooseEnergy = useCallback((level: EnergyLevel) => {
    setSelectedEnergy(level);
    setCurrentStep(2);
  }, []);

  const toggleTaskSelected = useCallback((taskId: string, checked: boolean) => {
    setTasks((previous) =>
      previous.map((task) => (task.id === taskId ? { ...task, selected: checked } : task))
    );
  }, []);

  const toggleTodayTaskDone = useCallback((taskId: string, checked: boolean) => {
    setTodayTasks((previous) =>
      previous.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          done: checked,
          blocked: checked ? task.blocked : false,
          timerRunning: false,
          workTimerRunning: false,
          timerRemainingSeconds: checked ? task.timerRemainingSeconds : task.pomodoroMinutes * 60
        };
      })
    );
  }, []);

  const startTodayTaskPomodoro = useCallback(
    (taskId: string, minutes: PomodoroMinutes) => {
      setTodayTasks((previous) =>
        previous.map((task) => {
          if (task.id !== taskId || task.done || task.id !== activeTodayTaskId) {
            return task;
          }

          return {
            ...task,
            pomodoroMinutes: minutes,
            timerRemainingSeconds: minutes * 60,
            timerRunning: true,
            blocked: false
          };
        })
      );
    },
    [activeTodayTaskId]
  );

  const stopTodayTaskPomodoro = useCallback((taskId: string) => {
    setTodayTasks((previous) =>
      previous.map((task) => {
        if (task.id !== taskId || task.done) {
          return task;
        }

        return {
          ...task,
          timerRunning: false
        };
      })
    );
  }, []);

  const startTodayTaskWorkTimer = useCallback(
    (taskId: string) => {
      setTodayTasks((previous) =>
        previous.map((task) => {
          if (task.id !== taskId || task.done || task.id !== activeTodayTaskId) {
            return task;
          }

          return {
            ...task,
            workTimerRunning: true,
            blocked: false
          };
        })
      );
    },
    [activeTodayTaskId]
  );

  const blockTodayTask = useCallback(
    (taskId: string) => {
      setTodayTasks((previous) =>
        previous.map((task) => {
          if (task.id !== taskId || task.done || task.id !== activeTodayTaskId) {
            return task;
          }

          return {
            ...task,
            blocked: true,
            timerRunning: false,
            workTimerRunning: false
          };
        })
      );
    },
    [activeTodayTaskId]
  );

  const openPomodoroOverlay = useCallback((taskId: string) => {
    setPomodoroOverlayTaskId(taskId);
  }, []);

  const closePomodoroOverlay = useCallback(() => {
    setPomodoroOverlayTaskId(null);
  }, []);

  const removeSelectedTasks = useCallback((mode: RemoveSelectedMode) => {
    setTasks((previous) => {
      const selectedTasks = previous.filter((task) => task.selected);
      const remainingTasks = previous.filter((task) => !task.selected);

      if (mode === "remove" && selectedTasks.length > 0) {
        setBacklogTasks((previousBacklog) => [
          ...previousBacklog,
          ...selectedTasks.map((task, index) => ({
            ...task,
            id: `backlog-restored-${Date.now()}-${index}`,
            selected: false,
            done: false
          }))
        ]);
      }

      return remainingTasks;
    });
  }, []);

  const moveTask = useCallback((fromIndex: number, toIndex: number) => {
    setTasks((previous) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= previous.length ||
        toIndex >= previous.length ||
        fromIndex === toIndex
      ) {
        return previous;
      }

      return reorder(previous, fromIndex, toIndex);
    });
  }, []);

  const openAddTaskModal = useCallback(() => {
    setIsAddTaskModalOpen(true);
  }, []);

  const closeAddTaskModal = useCallback(() => {
    setIsAddTaskModalOpen(false);
  }, []);

  const addTaskFromBacklog = useCallback(
    (backlogTaskId: string) => {
      setBacklogTasks((previousBacklog) => {
        const selected = previousBacklog.find((item) => item.id === backlogTaskId);
        if (!selected) {
          return previousBacklog;
        }

        if (activeTab === "today") {
          setTodayTasks((previousTasks) => [
            ...previousTasks,
            toTodayTask({
              ...selected,
              id: `today-task-${Date.now()}-${previousTasks.length + 1}`,
              selected: false,
              done: false
            })
          ]);
        } else {
          setTasks((previousTasks) => [
            ...previousTasks,
            {
              ...selected,
              id: `task-${Date.now()}-${previousTasks.length + 1}`,
              selected: false,
              done: false
            }
          ]);
        }

        return previousBacklog.filter((item) => item.id !== backlogTaskId);
      });
    },
    [activeTab]
  );

  const createTask = useCallback(
    (input: CreateTaskInput) => {
      const normalizedTitle = input.title.trim();
      if (!normalizedTitle) return;

      const normalizedSummary = input.summary?.trim() || "No summary yet.";
      const normalizedDueDate = input.storeInBacklog ? input.dueDate ?? null : null;

      const baseTask: BacklogTask = {
        id: `custom-task-${Date.now()}`,
        title: normalizedTitle,
        summary: normalizedSummary,
        details:
          "Review this custom task and define the first action before committing the final execution order.",
        actions: ["Break into subtasks", "Reduce scope", "Move to later"],
        complexity: input.complexity,
        selected: false,
        done: false,
        dueDate: normalizedDueDate
      };

      if (input.storeInBacklog) {
        setBacklogTasks((previous) => [...previous, baseTask]);
      } else if (activeTab === "today") {
        setTodayTasks((previous) => [
          ...previous,
          toTodayTask({
            ...baseTask,
            id: `today-custom-task-${Date.now()}-${previous.length + 1}`
          })
        ]);
      } else {
        setTasks((previous) => [...previous, { ...baseTask }]);
      }

      setIsAddTaskModalOpen(false);
    },
    [activeTab]
  );

  const openTaskDetails = useCallback((taskId: string) => {
    setTaskDetailsTaskId(taskId);
  }, []);

  const closeTaskDetails = useCallback(() => {
    setTaskDetailsTaskId(null);
  }, []);

  const confirmTasks = useCallback(() => {
    setTasksLocked(true);
    setTodayTasks(cloneForToday(tasks));
    setActiveTab("today");
    setCurrentStep(2);
    setTaskDetailsTaskId(null);
    setIsHelpOpen(false);
  }, [tasks]);

  useEffect(() => {
    const snapshot = getPlannerSnapshot(selectedTestDate);

    if (snapshot) {
      setTasks(snapshot.tasks);
      setTodayTasks(snapshot.todayTasks);
      setBacklogTasks(snapshot.backlogTasks);
      setSelectedEnergy(snapshot.selectedEnergy);
      setCurrentStep(snapshot.currentStep);
      setTasksLocked(snapshot.tasksLocked);
      setTestDaySpeed(snapshot.testDaySpeed ?? 1);
    } else {
      setTasks(getInitialTasks(locale));
      setTodayTasks([]);
      setBacklogTasks(getInitialBacklogTasks(locale));
      setSelectedEnergy("Medium");
      setCurrentStep(1);
      setTasksLocked(false);
      setTestDaySpeed(1);
    }

    setTaskDetailsTaskId(null);
    setPomodoroOverlayTaskId(null);
    setIsAddTaskModalOpen(false);
    setIsHelpOpen(false);
  }, [selectedTestDate]);

  useEffect(() => {
    setSelectedTestDate(selectedTestDate);
  }, [selectedTestDate]);

  useEffect(() => {
    savePlannerSnapshot(selectedTestDate, {
      tasks,
      todayTasks,
      backlogTasks,
      selectedEnergy,
      currentStep,
      tasksLocked,
      testDaySpeed
    });
  }, [backlogTasks, currentStep, selectedEnergy, selectedTestDate, tasks, tasksLocked, testDaySpeed, todayTasks]);

  useEffect(() => {
    updateGaugeFromTasks();
  }, [updateGaugeFromTasks]);

  useEffect(() => {
    animateGaugeRecalculation();

    return () => {
      clearTimers();
    };
  }, [animateGaugeRecalculation, clearTimers]);

  useEffect(() => {
    if (!pomodoroOverlayTaskId) {
      return;
    }

    const exists = todayTasks.some((task) => task.id === pomodoroOverlayTaskId);
    if (!exists) {
      setPomodoroOverlayTaskId(null);
    }
  }, [pomodoroOverlayTaskId, todayTasks]);

  useEffect(() => {
    const hasActiveTimers = todayTasks.some(
      (task) => !task.done && !task.blocked && (task.timerRunning || task.workTimerRunning)
    );

    if (!hasActiveTimers) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTodayTasks((previous) =>
        previous.map((task) => {
          if (task.done || task.blocked) {
            return task;
          }

          const nextPomodoro = task.timerRunning
            ? Math.max(task.timerRemainingSeconds - testDaySpeed, 0)
            : task.timerRemainingSeconds;
          const nextPomodoroRunning = task.timerRunning && nextPomodoro > 0;
          const nextElapsed = task.workTimerRunning
            ? task.workElapsedSeconds + testDaySpeed
            : task.workElapsedSeconds;

          return {
            ...task,
            timerRemainingSeconds: nextPomodoro,
            timerRunning: nextPomodoroRunning,
            workElapsedSeconds: nextElapsed
          };
        })
      );
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [testDaySpeed, todayTasks]);

  return {
    activeTab,
    activeTodayTaskId,
    addTaskFromBacklog,
    backlogTasks,
    blockTodayTask,
    closeAddTaskModal,
    closePomodoroOverlay,
    createTask,
    chooseEnergy,
    closeTaskDetails,
    complexity,
    confirmTasks,
    currentStep,
    gauge,
    hasTaskSelection,
    isAddTaskModalOpen,
    isHelpOpen,
    moveTask,
    openAddTaskModal,
    openPomodoroOverlay,
    openStep,
    openTaskDetails,
    pomodoroOverlayTask,
    removeSelectedTasks,
    selectedTestDate,
    selectedEnergy,
    selectedTask,
    setActiveTabFromPanel,
    setIsHelpOpen,
    setSelectedTestDate: setSelectedTestDateState,
    setTestDaySpeed,
    startTodayTaskPomodoro,
    stopTodayTaskPomodoro,
    startTodayTaskWorkTimer,
    tasks,
    tasksLocked,
    testDaySpeed,
    todayTasks,
    toggleTaskSelected,
    toggleTodayTaskDone,
    triggerGaugeRecalculation: animateGaugeRecalculation
  };
};


