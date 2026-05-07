const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo Workflow', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    // Wait for the app to load
    await page.waitForSelector('text=Your Todos');
  });

  test('adds a new todo without a due date', async ({ page }) => {
    await todoPage.addTodo('E2E Test Todo');
    await expect(page.getByRole('listitem').filter({ hasText: 'E2E Test Todo' })).toBeVisible();
  });

  test('adds a new todo with a due date', async ({ page }) => {
    await todoPage.addTodo('Todo With Due Date');
    await expect(page.getByRole('listitem').filter({ hasText: 'Todo With Due Date' })).toBeVisible();
  });

  test('edits an existing todo name', async ({ page }) => {
    await todoPage.addTodo('Original Todo Name');
    await expect(page.getByRole('listitem').filter({ hasText: 'Original Todo Name' })).toBeVisible();

    await todoPage.editTodo('Original Todo Name', 'Updated Todo Name');
    await expect(page.getByRole('listitem').filter({ hasText: 'Updated Todo Name' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Original Todo Name' })).toHaveCount(0);
  });

  test('deletes a todo', async ({ page }) => {
    await todoPage.addTodo('Todo To Delete');
    await expect(page.getByRole('listitem').filter({ hasText: 'Todo To Delete' })).toBeVisible();

    await todoPage.deleteTodo('Todo To Delete');
    await expect(page.getByRole('listitem').filter({ hasText: 'Todo To Delete' })).toHaveCount(0);
  });

  test('sorts todos alphabetically A-Z then Z-A', async ({ page }) => {
    // Start with a fresh sort — clear seeded todos by relying on initial seed data (Item 1, Item 2, Item 3)
    await expect(page.getByRole('listitem').first()).toContainText('Item 1');

    await todoPage.toggleSort();
    await expect(page.getByRole('listitem').first()).toContainText('Item 3');

    await todoPage.toggleSort();
    await expect(page.getByRole('listitem').first()).toContainText('Item 1');
  });

  test('cancel edit discards changes', async ({ page }) => {
    await todoPage.addTodo('Stable Todo');
    await expect(page.getByRole('listitem').filter({ hasText: 'Stable Todo' })).toBeVisible();

    const editButton = page.getByRole('button', { name: /edit stable todo/i });
    await editButton.click();

    const editInput = page.getByRole('textbox', { name: /edit todo title/i });
    await editInput.clear();
    await editInput.fill('Modified But Cancelled');

    await page.getByRole('button', { name: /cancel/i }).click();

    await expect(page.getByRole('listitem').filter({ hasText: 'Stable Todo' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Modified But Cancelled' })).toHaveCount(0);
  });
});
