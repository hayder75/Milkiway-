require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const prisma = require('./lib/prisma');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/systems', require('./routes/systems'));
app.use('/api/sellers', require('./routes/sellers'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/features', require('./routes/features'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/payouts', require('./routes/payouts'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/creative-requests', require('./routes/creativeRequests'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Milkyway Systems API running' });
});

app.listen(PORT, () => {
  console.log(`Milkyway Systems Backend running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
