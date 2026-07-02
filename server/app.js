import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json({ limit: '50mb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ccms-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/complaints', complaintRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
