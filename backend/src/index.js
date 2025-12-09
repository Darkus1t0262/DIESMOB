const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const vehicleRoutes = require('./routes/vehicles');
const driverRoutes = require('./routes/drivers');
const stationRoutes = require('./routes/stations');
const fuelRoutes = require('./routes/fuelTransactions');
const aiRoutes = require('./routes/ai');
const reportRoutes = require('./routes/reports');
const { connectRedis } = require('./config/redis');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/fuel-transactions', fuelRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectRedis().catch(() => console.warn('Redis connection failed, continuing without cache'));

app.listen(PORT, () => {
  // Mensaje de arranque del servidor
  console.log(`API listening on port ${PORT}`);
});
