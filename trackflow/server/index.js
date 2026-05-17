require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',   require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/users',  require('./routes/users'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`TrackFlow server running on http://localhost:${PORT}`));
