import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../supabaseClient.js';
const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }
  
  // hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Insert user into Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{ username, password: hashedPassword }])
      .select()
      .single();

    if (userError) {
      if (userError.code === '23505') { // Unique constraint violation
        return res.status(409).json({ message: 'username already exists' });
      }
      throw userError;
    }

    // Create default todo
    const defaultTodo = 'Welcome to your todo list!';
    const { error: todoError } = await supabase
      .from('todos')
      .insert([{ task: defaultTodo, user_id: user.id }]);

    if (todoError) {
      console.error('Error creating default todo:', todoError);
    }

    // create a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: 86400
    });
    return res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(503).json({ message: 'registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }
  
  try {
    // Find user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ message: 'invalid credentials' });
    }
    
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'invalid credentials' });
    }
    
    // successful authentication
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: 86400 });
    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(503).json({ message: 'login failed' });
  }
})


export default router;