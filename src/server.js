import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const app = express(); // invoking express to create an app instance
const PORT = process.env.PORT || 5000; // setting the port to either the environment variable PORT or 5000
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
// get the file path from th url of the current mudule
const __filename = fileURLToPath(import.meta.url);
// get the directory name from the file path
const __dirname = path.dirname(__filename);
//middleware
app.use(express.json());
// servers the html file that is in the public folder
//tells express to serve all files in the public folder as static assets/files.Any request to the css file will be resolved to the public folder
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
//routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // logging the server status
})