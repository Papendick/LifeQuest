import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

// Load configuration from .env file
dotenv.config();

const app = express();
app.use(express.json());

// simple health check
app.get('/', (req, res) => {
  res.json({ message: 'LQL Backend läuft.' });
});

// user registration and login routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
