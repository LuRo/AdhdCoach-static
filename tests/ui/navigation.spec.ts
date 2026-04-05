import { expect, test } from "@playwright/test";
import { seedAppState } from "./test-state";

test("navigates between home, settings, and profile pages", async ({ page }) => {
  await seedAppState(page);

  await page.goto("/");

  await expect(page.getByTestId("morning-panel")).toBeVisible();

  await page.getByTestId("top-navigation-settings-button").click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByTestId("settings-page")).toBeVisible();

  await page.getByTestId("settings-close-button").click();
  await expect(page).toHaveURL(/\/morning$/);
  await expect(page.getByTestId("morning-panel")).toBeVisible();

  await page.getByTestId("top-navigation-profile-button").click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByTestId("profile-page")).toBeVisible();

  await page.getByTestId("profile-close-button").click();
  await expect(page).toHaveURL(/\/morning$/);
  await expect(page.getByTestId("morning-panel")).toBeVisible();

  await page.getByTestId("main-nav-tab-today").click();
  await expect(page).toHaveURL(/\/today$/);
  await expect(page.getByTestId("today-panel")).toBeVisible();
});
