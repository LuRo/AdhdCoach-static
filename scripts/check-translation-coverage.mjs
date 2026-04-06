import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const checks = [
  {
    file: "src/features/morning/components/TodayPanel.tsx",
    forbidden: [
      ">Today execution<",
      ">Work from your confirmed morning plan<",
      ">Click the timer circle to open the Pomodoro overlay.<",
      ">Test day speed<",
      ">Simulation only. All running timers advance at the selected speed.<",
      ">Today is running at live speed.<",
      ">Today tasks<",
      ">Only the top unblocked task can start. Block unlocks the next task.<",
      ">All planned tasks are completed.<",
      ">Achieved goals of today<",
      ">Completed items are moved here automatically.<",
      ">No completed goals yet.<"
    ]
  },
  {
    file: "src/features/morning/components/TodayTaskCard.tsx",
    forbidden: [
      '"Blocked"',
      '"Tracking"',
      '"Play"',
      '"Block"',
      '"Open Pomodoro"',
      '"Mark ${task.title} as done"',
      '"Complexity ${task.complexity}"'
    ]
  }
];

const failures = [];

for (const check of checks) {
  const fullPath = resolve(check.file);
  const source = readFileSync(fullPath, "utf8");

  for (const forbidden of check.forbidden) {
    if (source.includes(forbidden)) {
      failures.push(`${check.file} contains hardcoded label: ${forbidden}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Translation coverage check failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Translation coverage check passed.");
