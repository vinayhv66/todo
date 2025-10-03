import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
const router = express.Router();

// User registration
router.post('/register',  async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }
  // hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });
     const defaultTodo = 'Welcome to your todo list!';
     await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id
      }
     });

   
    // create a token
    const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: 86400
    });
    return res.status(201).json({ token });
  } catch (err) {
    if (/(UNIQUE|unique)/i.test(err.message)) {
      return res.status(409).json({ message: 'username already exists' });
    }
    return res.status(503).json({ message: 'registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        username : username
      }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'invalid credentials' });
    }
    console.log(user)
    // successful authentication
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: 86400 });
    return res.json({ token });
  } catch (err) {
    return res.status(503).json({ message: 'login failed' });
  }
})


export default router;