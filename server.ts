import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database (in-memory for demo)
  const users: any[] = [];
  const meals: any[] = [];

  // API Routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Simple mock auth
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json({ success: true, user: { email: user.email, name: user.name } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const newUser = { email, password, name };
    users.push(newUser);
    res.json({ success: true, user: { email, name } });
  });

  app.get('/api/meals', (req, res) => {
    res.json(meals);
  });

  app.post('/api/meals', (req, res) => {
    const meal = { ...req.body, id: Date.now() };
    meals.push(meal);
    res.json(meal);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
