const express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  dataBaseConfig = require('./database/db'),
  app = express();

mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db, {
  useNewUrlParser: true
}).then(() => {
    console.log('Database connected sucessfully ')
  },
  error => {
    console.log('Could not connected to database : ' + error)
  }
)

const inventoryRoute = require('./routes/inventory.route')
const inventoryTypeRoute = require('./routes/inventoryType.route')
const inventorySubTypeRoute = require('./routes/inventorySubType.route')
const transactionRoute = require('./routes/transaction.route')
const borrowerRoute = require('./routes/borrower.route')
const incidentRoute = require('./routes/incident.route')
const accountRoute = require('./routes/account.route')
const auditRoute = require('./routes/audit.route')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

app.use(express.static(path.join(__dirname + '../../dist')));
app.get('/login', function(req, res, next) {
    res.sendFile('index.html', { root: __dirname + '../../dist' });
});
app.get('/forgot-password', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '../../dist' });
});
app.get('/staff-view', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '../../dist' });
});
app.get('/admin/dashboard', function(req, res, next) {
    res.sendFile('index.html', { root: __dirname + '../../dist' });
});
app.get('/admin/dashboard/account', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '../../dist' });
});
app.get('/admin/inventory', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '../../dist' });
});
app.get('/admin/inventory/inventoryConfig', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '../../dist' });
});
app.get('/admin/borrow-return', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '../../dist' });
});
app.get('/admin/borrower-info', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '../../dist' });
});
app.get('/admin/reports', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '../../dist' });
});

app.use('/inventory', inventoryRoute)
app.use('/inventoryType', inventoryTypeRoute)
app.use('/inventorySubType', inventorySubTypeRoute)
app.use('/transaction' , transactionRoute)
app.use('/borrower' , borrowerRoute)
app.use('/incident' , incidentRoute)
app.use('/account' , accountRoute)
app.use('/audit' , auditRoute)

const port = process.env.PORT || 8000;

app.listen(port, () => {
   console.log('Connected to port ' + port)
})

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
  res.sendStatus(err.status);
});
