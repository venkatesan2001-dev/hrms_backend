import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import usersRouter from './routes/users.js';
import payrollRouter from './routes/payroll.js';
import payrunRouter from './routes/payrun.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://venkatesan2001official:v7ycpdMNzurgBQEu@cluster0.we3z6ih.mongodb.net/';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, { dbName: 'hrms_db' })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'hrms-server' });
});

app.use('/api/users', usersRouter);
app.use('/api/payroll', payrollRouter);
app.use('/api/payrun', payrunRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


