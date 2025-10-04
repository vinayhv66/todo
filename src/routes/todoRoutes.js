import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require auth
router.use(auth);

// Get all todos for authenticated user
router.get('/', async (req, res) => {
  try {
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    return res.status(500).json({ message: 'Failed to fetch todos' });
  }
})

// Add a new todo
router.post('/', async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ message: 'Task is required' });
  }

  try {
    const { data: todo, error } = await supabase
      .from('todos')
      .insert([{ task, user_id: req.userId }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.json(todo);
  } catch (err) {
    console.error('Error creating todo:', err);
    return res.status(500).json({ message: 'Failed to create todo' });
  }
})

// Update a todo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'Completed status must be a boolean' });
  }

  try {
    const { data: todo, error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return res.status(404).json({ message: 'Todo not found' });
      }
      throw error;
    }
    
    res.json(todo);
  } catch (err) {
    console.error('Error updating todo:', err);
    return res.status(500).json({ message: 'Failed to update todo' });
  }
})




// Delete a todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const { data: todo, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return res.status(404).json({ message: 'Todo not found' });
      }
      throw error;
    }
    
    res.json(todo);
  } catch (err) {
    console.error('Error deleting todo:', err);
    return res.status(500).json({ message: 'Failed to delete todo' });
  }
})

export default router;