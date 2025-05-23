import express from 'express';
import cors from 'cors';
import { propertyRouter } from './routes/properties';
import { amenityRouter } from './routes/amenities';
import { locationDataRouter } from './routes/location-data';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/properties', propertyRouter);
app.use('/api/amenities', amenityRouter);
app.use('/api/location-data', locationDataRouter);

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});