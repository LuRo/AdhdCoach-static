import { expect, test } from "@playwright/test";
import { seedAppState } from "./test-state";

test("settings controls translation state and exposes the local planner switches", async ({ page }) => {
  await seedAppState(page, {
    testModeSettings: {
      enabled: true,
      morningDateEnabled: true,
      todaySpeedEnabled: true
    }
  });

  await page.goto("/settings");

  const translationSwitch = page.locator("#translation-enabled");
  const localeSelect = page.locator('select[aria-label="Language"]');

  await expect(page.getByTestId("settings-page")).toBeVisible();
  await expect(translationSwitch).toBeChecked();
  await expect(localeSelect).toBeEnabled();

  await translationSwitch.uncheck();
  await expect(localeSelect).toBeDisabled();
  await expect(page.getByText("The UI stays in English until you turn translation back on.")).toBeVisible();

  await translationSwitch.check();
  await expect(localeSelect).toBeEnabled();

  await page.getByTestId("top-navigation-home-button").click();
  await expect(page).toHaveURL(/\/morning$/);
  await expect(page.getByTestId("morning-selected-date-input")).toBeVisible();

  await page.getByTestId("main-nav-tab-today").click();
  await expect(page.getByTestId("today-speed-group")).toBeVisible();
});

