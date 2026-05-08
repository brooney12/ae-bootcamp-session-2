const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('Items CRUD Integration', () => {
  describe('Full item lifecycle: create → read → update → delete', () => {
    it('creates an item, verifies it appears in the list, updates it, then deletes it', async () => {
      // Create
      const createRes = await request(app)
        .post('/api/items')
        .send({ name: 'Lifecycle Item' })
        .set('Accept', 'application/json');
      expect(createRes.status).toBe(201);
      const itemId = createRes.body.id;
      expect(createRes.body.name).toBe('Lifecycle Item');

      // Read – confirm it appears in the list
      const listRes = await request(app).get('/api/items');
      expect(listRes.status).toBe(200);
      const found = listRes.body.find((i) => i.id === itemId);
      expect(found).toBeDefined();
      expect(found.name).toBe('Lifecycle Item');

      // Update
      const updateRes = await request(app)
        .put(`/api/items/${itemId}`)
        .send({ name: 'Lifecycle Item (updated)' })
        .set('Accept', 'application/json');
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.name).toBe('Lifecycle Item (updated)');

      // Verify update is reflected in the list
      const listAfterUpdate = await request(app).get('/api/items');
      const updatedItem = listAfterUpdate.body.find((i) => i.id === itemId);
      expect(updatedItem.name).toBe('Lifecycle Item (updated)');

      // Delete
      const deleteRes = await request(app).delete(`/api/items/${itemId}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toEqual({ message: 'Item deleted successfully', id: itemId });

      // Verify it no longer appears in the list
      const listAfterDelete = await request(app).get('/api/items');
      const deletedItem = listAfterDelete.body.find((i) => i.id === itemId);
      expect(deletedItem).toBeUndefined();
    });
  });

  describe('Due date lifecycle: set, update, and clear', () => {
    it('creates an item with a due date, updates it, then clears it', async () => {
      const createRes = await request(app)
        .post('/api/items')
        .send({ name: 'Due Date Item', due_date: '2026-06-01' })
        .set('Accept', 'application/json');
      expect(createRes.status).toBe(201);
      const itemId = createRes.body.id;
      expect(createRes.body.due_date).toBe('2026-06-01');

      // Update the due date
      const updateRes = await request(app)
        .put(`/api/items/${itemId}`)
        .send({ name: 'Due Date Item', due_date: '2026-12-31' })
        .set('Accept', 'application/json');
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.due_date).toBe('2026-12-31');

      // Clear the due date
      const clearRes = await request(app)
        .put(`/api/items/${itemId}`)
        .send({ name: 'Due Date Item', due_date: null })
        .set('Accept', 'application/json');
      expect(clearRes.status).toBe(200);
      expect(clearRes.body.due_date).toBeNull();

      // Cleanup
      await request(app).delete(`/api/items/${itemId}`);
    });
  });

  describe('Multiple items management', () => {
    it('creates several items and all appear in the list', async () => {
      const names = ['Multi Item A', 'Multi Item B', 'Multi Item C'];
      const createdIds = [];

      for (const name of names) {
        const res = await request(app)
          .post('/api/items')
          .send({ name })
          .set('Accept', 'application/json');
        expect(res.status).toBe(201);
        createdIds.push(res.body.id);
      }

      const listRes = await request(app).get('/api/items');
      expect(listRes.status).toBe(200);

      for (const id of createdIds) {
        expect(listRes.body.find((i) => i.id === id)).toBeDefined();
      }

      // Cleanup
      for (const id of createdIds) {
        await request(app).delete(`/api/items/${id}`);
      }
    });

    it('deleting one item does not affect the others', async () => {
      const resA = await request(app)
        .post('/api/items')
        .send({ name: 'Keep Item A' })
        .set('Accept', 'application/json');
      const resB = await request(app)
        .post('/api/items')
        .send({ name: 'Delete Item B' })
        .set('Accept', 'application/json');

      const keepId = resA.body.id;
      const deleteId = resB.body.id;

      await request(app).delete(`/api/items/${deleteId}`);

      const listRes = await request(app).get('/api/items');
      expect(listRes.body.find((i) => i.id === keepId)).toBeDefined();
      expect(listRes.body.find((i) => i.id === deleteId)).toBeUndefined();

      // Cleanup
      await request(app).delete(`/api/items/${keepId}`);
    });
  });

  describe('Validation across operations', () => {
    it('rejects an update with an empty name without affecting the stored item', async () => {
      const createRes = await request(app)
        .post('/api/items')
        .send({ name: 'Validation Target' })
        .set('Accept', 'application/json');
      const itemId = createRes.body.id;

      const badUpdateRes = await request(app)
        .put(`/api/items/${itemId}`)
        .send({ name: '' })
        .set('Accept', 'application/json');
      expect(badUpdateRes.status).toBe(400);

      // Confirm the item is unchanged
      const listRes = await request(app).get('/api/items');
      const item = listRes.body.find((i) => i.id === itemId);
      expect(item.name).toBe('Validation Target');

      // Cleanup
      await request(app).delete(`/api/items/${itemId}`);
    });

    it('returns 404 when updating or deleting a non-existent item', async () => {
      const nonExistentId = 999999;

      const updateRes = await request(app)
        .put(`/api/items/${nonExistentId}`)
        .send({ name: 'Ghost' })
        .set('Accept', 'application/json');
      expect(updateRes.status).toBe(404);

      const deleteRes = await request(app).delete(`/api/items/${nonExistentId}`);
      expect(deleteRes.status).toBe(404);
    });
  });
});
