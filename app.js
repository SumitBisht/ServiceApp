
/**
 * Module dependencies.
 */

var express = require('express')
  // , routes = require('./routes')
  , tasks = require('./routes/tasks');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', tasks.dataList);
app.get('/task', tasks.list);
app.get('/task/new', tasks.new);
app.get('/task/view/:id', tasks.view)
app.post('/task/add', tasks.add);
app.get('/task/remove/:id', tasks.remove);
app.get('/task/edit/:id', tasks.change);
app.post('/task/update/:id', tasks.update);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
