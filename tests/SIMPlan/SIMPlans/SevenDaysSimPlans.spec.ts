import { test, expect } from '@playwright/test';
import { SevenDaysSimPlansPage } from "../../../pages/SIMPlan/SIMPlans/SevenDaysSimPlansPage";

test("partial 7-day plan test - open page and click checkout", async ({ page }) => {
  const sevenPlanTest = new SevenDaysSimPlansPage(page);
  await sevenPlanTest.openPlanPage();
  await sevenPlanTest.buySevenDayPlan();
  await sevenPlanTest.checkOutPlan();
  await sevenPlanTest.userDetails();
  await sevenPlanTest.rejectPayment();
});