import express from 'express';
import db from '../db.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require auth
router.use(auth);

// Get all todos for authenticated user
router.get('/', (req, res) => {
  try {
    const getTodos = db.prepare('SELECT id, task, completed FROM todos WHERE user_id = ? ORDER BY id DESC')
    const todos = getTodos.all(req.userId) || [];
    return res.json(todos.map(t => ({ ...t, completed: Boolean(t.completed) })));
  } catch (_err) {
    return res.status(503).json({ message: 'failed to fetch todos' });
  }
})

// Add a new todo
router.post('/', (req, res) => {
  const { task } = req.body;
  if (!task || String(task).trim().length === 0) {
    return res.status(400).json({ message: 'task is required' });
  }
  try {
    const result = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)')
      .run(req.userId, task);
    const created = db.prepare('SELECT id, task, completed FROM todos WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ ...created, completed: Boolean(created.completed) });
  } catch (err) {
    if (err.message.includes('FOREIGN KEY')) {
      return res.status(401).json({ message: 'User session expired. Please login again.' });
    }
    return res.status(503).json({ message: 'failed to create todo' });
  }
})

// Update a todo
router.put('/:id', (req, res) => {
  try {
    const { completed } = req.body;
    const { id } = req.params;

    // Validate input
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'completed must be a boolean value' });
    }

    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }

    const updateTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?');
    const result = updateTodo.run(completed ? 1 : 0, todoId, req.userId);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Todo not found or access denied' });
    }

    res.json({ message: 'todo updated' });
  } catch (err) {
    return res.status(503).json({ message: 'failed to update todo' });
  }
})


// Delete a todo
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }

    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
    const result = deleteTodo.run(todoId, req.userId);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Todo not found or access denied' });
    }

    res.json({ message: 'todo deleted' });
  } catch (err) {
    return res.status(503).json({ message: 'failed to delete todo' });
  }
})

export default router;