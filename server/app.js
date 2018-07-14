var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goods = require('./routes/goods')
var ejs = require('ejs');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('路径',路由文件)挂载，相当于把不同路由分离到文件中，文件里通过express.router()实现
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goods);
//登录拦截，登录状态通过cookie里有没有userId判断，很粗糙
app.use((req,res,next) => {
  if(req.cookies.userId) {
    next();
  } else {
    if( req.path==='/' ||req.originalUrl==='/users' || req.originalUrl==='/users/logout'|| req.path==='/goods') {
      next();
    } else {
      res.json({
        status:"10001",
        msg:"当前未登陆",
        result:""
      })
    }
  }
} );

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
