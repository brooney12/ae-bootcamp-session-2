const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page) {
    this.page = page;
    this.titleInput = page.getByRole('textbox', { name: /todo title/i });
    this.addButton = page.getByRole('button', { name: /^add$/i });
    this.sortButton = page.getByRole('button', { name: /sort todos/i });
    this.todoList = page.getByRole('list');
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTodo(name, dueDate = null) {
    await this.titleInput.fill(name);
    if (dueDate) {
      const dateInput = this.page.getByLabel(/due date/i);
      await dateInput.fill(dueDate);
    }
    await this.addButton.click();
  }

  async editTodo(name, newName, newDueDate = null) {
    const editButton = this.page.getByRole('button', { name: new RegExp(`edit ${name}`, 'i') });
    await editButton.click();
    const editInput = this.page.getByRole('textbox', { name: /edit todo title/i });
    await editInput.clear();
    await editInput.fill(newName);
    if (newDueDate) {
      const dateInput = this.page.getByLabel(/due date/i).last();
      await dateInput.fill(newDueDate);
    }
    await this.page.getByRole('button', { name: /save/i }).click();
  }

  async deleteTodo(name) {
    await this.page.getByRole('button', { name: new RegExp(`delete ${name}`, 'i') }).click();
  }

  async toggleSort() {
    await this.sortButton.click();
  }

  async getTodoNames() {
    const items = await this.page.getByRole('listitem').all();
    return Promise.all(items.map((item) => item.textContent()));
  }

  async getTodoItem(name) {
    return this.page.getByRole('listitem').filter({ hasText: name });
  }
}

module.exports = { TodoPage };
