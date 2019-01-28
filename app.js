const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'VT' });

const db = require('./models')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser());
const log = require('./utils/logger');



let apiVersion = null

try {
  apiVersion = require('./package.json').version
} catch (e) {
  apiVersion = 'Unavailable'
}

app.all('*', (req, res, next) => {
  res.header('X-Api-Server-Version', apiVersion)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Origin,Accept')
  res.header('Access-Control-Expose-Headers', 'X-Result-Page-Limit, X-Result-Page-Size, X-Result-Start-Offset, X-Result-Total-Count, X-Result-Job-Id')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')
  res.header('Access-Control-Allow-Credentials', true)
  next()
})

app.use(function (req, res, next) {
  var logger = log.loggerInstance.child({
    id: req.id,
    body: req.body
  }, true)
  logger.info({ req: req })
  next();
});


app.use('/', require('./routes')(db, logger));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

const mapErrorStatus = (status) => {
  switch (status) {
    case 400: return 'Bad Request'
    case 403: return 'Forbidden'
    case 404: return 'Not Found'
    case 413: return 'Body too large'
    case 500: return 'Internal Server Error'
    case 501: return 'Method not implemented'
    default: return 'Error: ' + status
  }
}

// error handlers
if (app.get('env') !== 'production') {
  app.use((err, req, res, next) => {
    logger.error('Catch All Error Handler', req.originalUrl, err)
    res.status(err.status || 500).json('Something broke on server')
  })
} else {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
    })
  })
}


module.exports = app;
