import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Taskmanager/);
});

test.describe('New Task', () => {
  test('should allow to create a task', async ({ page }) => {
    await page.goto('/tasks/new');

    const nameInput = page.getByLabel('Name');
    const dueDateInput = page.getByLabel('Due date');
    const assigneeInput = page.getByLabel('Assignee');

    const name = faker.lorem.words(5);
    await nameInput.fill(name);

    await dueDateInput.fill("03.07.2023");

    await assigneeInput.fill("Someone, somewhere");
    await assigneeInput.press("Enter");

    await page.waitForNavigation();

    await expect(page.getByTestId('task-name').filter({ hasText: name })).toContainText(name);
  });
});
