import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import marketController from './controllers/marketController.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.get('/api/surface', marketController.getSurface);
app.post('/api/snapshot', marketController.saveSnapshot);
app.get('/api/snapshots', marketController.getSnapshots);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Node server running on port ${PORT}`));