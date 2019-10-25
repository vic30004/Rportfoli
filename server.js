const path = require('path');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// route files
const PORT = 5000;



// Load env

dotenv.config({ path: './config/config.env' });

// connect to db

connectDB();

// Routes
const projects = require('./routes/projects');
const auth = require('./routes/auth')
const users = require('./routes/users')

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

// Sanitize Data
app.use(mongoSanitize());

// Set security headers
app.use(helmet())

// Prevent xss attacks
app.use(xss());

// Rate limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10min
  max: 100
});

app.use(limiter);

// prevent http param pollution
app.use(hpp())

// Mount routers

app.use('/api/portfolio/projects', projects);
app.use('/api/v1/auth',auth)
app.use('/api/v1/users',users)
app.use(errorHandler);

app.listen(process.env || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

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
