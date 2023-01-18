const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const colors = require('colors');

dotenv.config();

const app = express();

// Set PORT
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

const folder = path.resolve();
app.use('/uploads', express.static(path.join(folder, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API running');
  });
}

// error handlers
app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_UI)
  .then(() => {
    app.listen(
      PORT,
      console.log(
        `MongoDB Connected | Server running on port ${PORT}`.cyan.bold
      )
    );
  })
  .catch((error) => {
    console.log(error);
  });
