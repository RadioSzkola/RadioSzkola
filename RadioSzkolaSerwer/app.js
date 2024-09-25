var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var elementsRouter = require('./routes/elements');
var spotifyRouter = require('./routes/nowplaying');
var mongoRouter = require('./routes/spotifynmongodb');

var app = express();

app.use(cors({
  origin: ['http://localhost:8080', 'http://192.168.55.119:8080', 'http://192.168.68.131:8080']
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/elements', elementsRouter);
app.use('/spotify', spotifyRouter);
app.use('/tracks', mongoRouter)

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
