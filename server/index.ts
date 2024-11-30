import express from 'express';
import cors from 'cors';
import { propertyRouter } from './routes/properties';
import { initializeDatabase } from './database';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize the in-memory database with mock data
initializeDatabase();

// Routes
app.use('/api/properties', propertyRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});