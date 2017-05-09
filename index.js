var express = require('express');
var mongojs = require('mongojs');
var path = require('path');
var dust = require('express-dustjs');
var bodyParser = require('body-parser');
var app = express();

dust._.optimizers.format = function (ctx, node) {
  return node
};
// Define custom Dustjs helper
dust._.helpers.demo = function (chk, ctx, bodies, params) {
  return chk.w('demo')
};

app.use(bodyParser.urlencoded({
	extended: false
}));

// Use Dustjs as Express view engine
app.engine('dust', dust.engine({
  // Use dustjs-helpers
  useHelpers: true
}));
app.set('view engine', 'dust');
app.set('views', path.resolve(__dirname, './views'));



app.use(express.static('public'));

var databaseUrl = 'dogFood';
var collections = ['dogFoodData'];

var db = mongojs(databaseUrl, collections);


db.on('error', function(err) {
  console.log('Database Error:', err);
});


app.get('/', function(req, res) {
  db.dogFoodData.find({},(error,response) => {
  	  var userData = {userData:response};
  	  res.render('main', userData);
  })
});

app.post('/submit', function(req, res) {
  var user = req.body.user;
  var product = req.body.product;
  var price = req.body.price;
  var stock = req.body.stock;
  	db.dogFoodData.insert({user:user,product:product,price:price,stock,stock},(error,response) => {
  		if(error){
  			console.log(error);
  		}else{
  			console.log('posted');
  			res.redirect('/');
  		}
  	});
});



// set app to run at port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});