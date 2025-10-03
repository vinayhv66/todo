import express from 'express';
import prisma from '../prismaClient.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require auth
router.use(auth);

// Get all todos for authenticated user
router.get('/', async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: req.userId
    }
  });
  return res.json(todos);
   
})

// Add a new todo
router.post('/', async (req, res) => {
  const { task } = req.body;

  const todo = await prisma.todo.create({
    data: {
      task,
      userId: req.userId
    }
  });
  res.json(todo);
  
})

// Update a todo
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const todo = await prisma.todo.update({
      where: { id: parseInt(id),
      userId: req.userId
    },
    data: { 
      completed: completed 
    }
  })
    res.json(todo)

})




// Delete a todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const todo = await prisma.todo.delete({
    where: { 
      id: parseInt(id),
    userId
    }
  })
  res.json(todo)
  }
)

export default router;