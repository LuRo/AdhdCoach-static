import { expect, test } from "@playwright/test";
import { seedAppState } from "./test-state";

test("supports task detail review, task creation, and confirmation into Today", async ({ page }) => {
  await seedAppState(page, {
    testModeSettings: {
      enabled: true,
      morningDateEnabled: true,
      todaySpeedEnabled: true
    }
  });

  await page.goto("/morning");

  await page.locator('label[for="energy-high"]').click();
  await expect(page.getByTestId("morning-tasks-list")).toBeVisible();

  const proposalTask = page.getByTestId("morning-tasks-task-item-client-proposal-revisions");
  await expect(proposalTask).toContainText("Client proposal revisions");
  await page.getByTestId("morning-tasks-task-item-client-proposal-revisions-details-button").click();

  await expect(page.getByTestId("task-details-modal")).toBeVisible();
  await expect(page.getByTestId("task-details-actions")).toContainText("Schedule focus block");
  await page.getByTestId("task-details-modal").locator('button[aria-label="Close"]').click();

  await page.getByTestId("morning-tasks-add-task-button").click();
  await page.getByTestId("morning-add-task-create-new-button").click();
  await page.getByTestId("morning-add-task-title-input").fill("Write weekly status summary");
  await page.getByTestId("morning-add-task-summary-input").fill("Capture blockers and next steps for the team.");
  await page.getByTestId("morning-add-task-calculate-complexity-button").click();
  await page.getByTestId("morning-add-task-submit-button").click();

  await expect(page.getByTestId("morning-tasks-list")).toContainText("Write weekly status summary");

  await page.getByTestId("morning-tasks-confirm-button").click();
  await page.getByTestId("main-nav-tab-today").click();
  await expect(page).toHaveURL(/\/today$/);
  await expect(page.getByTestId("today-panel")).toBeVisible();
  await expect(page.getByTestId("today-open-task-list")).toContainText("Write weekly status summary");
  await expect(page.getByTestId("today-speed-group")).toBeVisible();

  await page.getByTestId("today-open-task-item-inbox-cleanup-timer-visual").click();
  await expect(page.getByTestId("today-pomodoro-overlay")).toBeVisible();
  await page.getByTestId("today-pomodoro-duration-10-button").click();
  await page.getByTestId("today-pomodoro-start-button").click();
  await expect(page.getByTestId("today-pomodoro-overlay")).toBeVisible();
  await page.getByTestId("today-pomodoro-close-button").click();
  await expect(page.getByTestId("today-pomodoro-overlay")).toHaveCount(0);
});
