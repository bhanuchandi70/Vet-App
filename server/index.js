const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db/database');
const authRoutes = require('./routes/auth');
const vetRoutes = require('./routes/vets');
const appointmentRoutes = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 5000;

initializeDatabase();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vets', vetRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PawCare API running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`PawCare server running on http://localhost:${PORT}`);
});
