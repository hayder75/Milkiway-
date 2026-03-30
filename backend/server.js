require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/milkyway')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

app.use('/api/systems', require('./routes/systems'));
app.use('/api/sellers', require('./routes/sellers'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/contacts', require('./routes/contacts'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Milkyway Systems API running' });
});

app.listen(PORT, () => {
  console.log(`Milkyway Systems Backend running on port ${PORT}`);
});
