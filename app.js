var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var jquery = require('jquery')
var cookie = require('cookie')

var app = express();
var mongo = require('mongodb');
var mongojs = require('mongojs');
// var MongoClient = require('mongodb').MongoClient;
// var monk = require('monk');
// var db = mongo.connect('mongodb://localhost:27017/PodStock');
var mongojs = require("mongojs")
var db = mongojs('mongodb://localhost:27017/PodStock')
// connect('mongodb://localhost:27017/PodStock', ["users","groups"]);
// var db = mongojs('PodStock')
// var users = db.createCollection('users',{})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/', (req, res) => {
  console.log(__dirname + "/public/authentication/login.html")
  res.sendFile(__dirname + "/public/authentication/login.html");
})
app.use(express.static(path.join(__dirname, 'public')));


//app.use(express.static('public/authentication/', {index: 'login.html'}))
// app.use(function(req, res){
//     res.sendFile(__dirname + '/public/authentication/login.html');
//
// });
// app.use(function(req,res,next){
//     req.db = db;
//     next();
// });

// app.use('/', index);
// app.use('/users', users);
// app.use('/login',login)


app.get('/login', (req, res) => {
  res.sendFile(__dirname + "/public/authentication/login.html");
})
app.get('/stockdata',(req,res) => {
  res.sendFile(__dirname + "/public/quotes.txt");
})
app.get('/signup', (req, res) => {
  req.db.users.find({},function(error,data){
    console.log(data)
  })
  res.sendFile(__dirname + "/public/authentication/signup.html");

})
app.get('/mypods',(req,res)=>{
  res.sendFile(__dirname + "/public/groups.html");
})
app.post('/login',(req,res) => {
  console.log(req.body.Username);
  console.log(req.body.Password);
  var nm = req.body.Username;
  var ps = req.body.Password;
  if(req.db.users.find("username: " + nm))
  {
    console.log("success")
    res.writeHead(200,{
      'Set-Cookie':'user=' + nm;
    },function(r){
        res.sendFile(__dirname + "/public/index.html");
    })


  }
  else {
    console.log("fail")
  }

})
app.post('/signup',(req,res) => {
  t_name = req.body.name;
  t_email = req.body.email;
  t_username = req.body.username;
  t_password = req.body.password;
  t_acct = req.body.account;
  console.log(t_name + " " + t_email + " " + t_username + " " + t_password + " " + t_acct)
  // req.db.users.insertOne({ name: t_name,email: t_email,username: t_username,password: t_password,capital_one: t_acct })
  req.db.users.insert({ name: t_name,email: t_email,username: t_username,password: t_password,capital_one: t_acct },function(err,users){
    console.log('error')
  })
  //console.log(req.db.users.insert)
  // var db= req.db.collection('users');
  // var users = req.db.collection("users")
  // req.db.collection("users").insert(
  //   { name: t_name,email: t_email,username: t_username,password: t_password,capital_one: t_acct }
  // )


  // req.db.open(function(){});

// req.db.collection('users', function(err,collection){
//     doc =   { name: t_name,email: t_email,username: t_username,password: t_password,capital_one: t_acct };
//     collection.insert(doc, function(){});
// });
  res.sendFile(__dirname + "/public/index.html")

})
// app.get('/login',(req,res)=> {
//   res.sendFile(__dirname + "/public/authentication/login.html");
// })
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
app.listen(3000, function() {
  console.log('listening on 3000')
})
module.exports = app;
