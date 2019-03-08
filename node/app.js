var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var cors = require('cors');
var routes = require('./routes/index');


var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.options('*', cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/login', routes);
app.use('/getOrganization', routes);
app.use('/getDataDashboard', routes);
app.use('/getJIRADATA', routes);
app.use('/posts', routes);
app.use('/getTotalRecordsCount', routes);
app.use('/getRecordsPage', routes);
app.use('/saveinMongo', routes);
app.use('/getProductName', routes);
app.use('/getallProductbyorganization_id', routes);
app.use('/getProductEntitiesByProductId', routes);
app.use('/user_signup', routes);
app.use('/getVelocitData', routes);
app.use('/getSprintData', routes);
app.use('/getJiraProjects', routes);
app.use('/testcassandra', routes);
app.use('/insert_fakeform', routes);
app.use('/get_fakeform', routes);
app.use('/transafercounyrdata', routes);
app.use('/transaferproductdata', routes);
app.use('/inserttechnicaldebt', routes);
app.use('/insertsprintentities', routes);
app.use('/calculateleadtimeandvelocity', routes);
app.use('/getAllJiraProject', routes);
app.use('/insertsprintdata', routes);
app.use('/getvelocityofallclosedsprints', routes);
app.use('/getdeploymentpersprint', routes);
app.use('/gettechnicaldebtpersprint', routes);
app.use('/gettotalefforts', routes);
app.use('/kairosdbinsert', routes);
app.use('/kairosdbselect', routes);
app.use('/kairosdbdelete', routes);
app.use('/getLeadTimeCalculated', routes);
app.use('/getcycletimecalculated', routes);
app.use('/getTechnicalDebtByAPI', routes);
app.use('/getsprintwisevelocity', routes);
app.use('/downloadCSV', routes);
app.use('/getMenus', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(4002, function() {
    console.log('Ready on port %d', server.address().port);
});

module.exports = app;
