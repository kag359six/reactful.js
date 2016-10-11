var express = require('express');
var app = express();
var reactful = require('../index');

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/test_components'));

app.use(reactful({
  file: __dirname + '/reactful-config.js',
  universal: ['ComponentA']
}));

app.get('/', function(req, res) {
  res.components.use(['ComponentB']);
  res.components.render('index');
});

app.listen(3333);
