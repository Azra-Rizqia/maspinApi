const express = require('express');
const app = express();
const colors = require('colors');
require('dotenv').config();
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/pajak', require('./routes/pajakRoutes'));
app.use('/api/laporan', require('./routes/laporanRoutes'));

app.use(errorHandler);

connectDB();


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
