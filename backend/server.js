const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const meterRoutes = require('./routes/meters');
const alarmRoutes = require('./routes/alarms');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meters', meterRoutes);
app.use('/api/alarms', alarmRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SCADA Backend çalışıyor!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});