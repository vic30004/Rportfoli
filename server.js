const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// route files




// Load env

dotenv.config({ path: './config/config.env' });

// connect to db

connectDB();

// Routes
const projects = require('./routes/projects');
const auth = require('./routes/auth')

const app = express();

// set static folder

app.use(express.static(path.join(__dirname, 'public')));

// body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser())

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File Uploading
app.use(fileUpload());

// Mount routers

app.use('/api/portfolio/projects', projects);
app.use('/api/v1/auth',auth)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handle unhandled rejections

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // close server and exit
  server.close(() => process.exit(1));
});
