const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport')

const { auth, verifyUser } = require('./authenticate')
const config = require('./config')

const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(
  () => console.log('Connected correctly to server'), 
  err => console.log(err)
);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const noteRouter = require('./routes/noteRouter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('anything'));

// app.use(session({
//   name: 'session-id',
//   secret: config.SECRET_KEY,
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }))

app.use(passport.initialize())
// app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/notes', verifyUser, noteRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
