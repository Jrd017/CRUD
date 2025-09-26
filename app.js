var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

// Import routes
var usersRouter = require('./routes/users');
var employeesRouter = require('./routes/employees');

var app = express();

// MongoDB connection
var mongoose = require('mongoose');

// Parse URL-encoded bodies (form data)
app.use(bodyParser.urlencoded({ extended: false }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.redirect('/employees');
});
app.use('/users', usersRouter);
app.use('/employees', employeesRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// MongoDB connection configuration
const uri = "mongodb+srv://jaredoxales017_db_user:I2ispQQwCfk2vLox@expressdb.srrsoji.mongodb.net/?retryWrites=true&w=majority&appName=expressdb";

async function connectToMongoDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Connect to database
connectToMongoDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Access the app at: http://localhost:${PORT}/employees`);
});

module.exports = app;