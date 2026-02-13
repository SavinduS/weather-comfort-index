const express = require('express');
const cors = require('cors');
require('dotenv').config();
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', weatherRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));