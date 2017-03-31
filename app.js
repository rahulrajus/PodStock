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
var Cookies = require('cookie')

var app = express();
var mongo = require('mongodb');
var mongojs = require('mongojs');
var jsdom = require('jsdom')
var fs = require('fs')
// var MongoClient = require('mongodb').MongoClient;
// var monk = require('monk');
// var db = mongo.connect('mongodb://localhost:27017/PodStock');
var mongojs = require("mongojs")
//var db = mongojs('mongodb://podstock:Podstock123@ds139959.mlab.com:39959/podstock',['users','groups'])

var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');
var url = "mongodb://podstock:Podstock123@ds139959.mlab.com:39959/podstock"
var db = MongoClient.connect('mongodb://podstock:Podstock123@ds139959.mlab.com:39959/podstock')
app.use(function(req,res,next){
    req.db = db;
    //console.log("test",db.users.findOne({email:"rahulrajan@gmail.com"}))
    next();
  //   var cookies = new Cookies( req, res, { "keys": keys } )
  // , username
});
//mongodb://<dbuser>:<dbpassword>@ds139959.mlab.com:39959/podstock

// connect('mongodb://localhost:27017/PodStock', ["users","groups"]);
// var db = mongojs('PodStock')
// var users = db.createCollection('users',{})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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
  res.sendFile(__dirname + "/public/quotes.txt")
})
app.get('/stockdata1',(req,res) => {
  res.sendFile(__dirname + "/public/aapl.csv");
})
app.get('/stockdata2',(req,res) => {
  res.sendFile(__dirname + "/public/tsla.csv");
})
app.get('/signup', (req, res) => {
  req.db.collection("users").find({},function(error,data){
    console.log(data)
  })
  res.sendFile(__dirname + "/public/authentication/signup.html");

})
app.get('/home', (req,res) =>{
  res.sendFile(__dirname + "/public/index.html")
})
function parseCookies (request) { //http://stackoverflow.com/questions/3393854/get-and-set-a-single-cookie-with-node-js-http-server
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function call_jsdom(source, callback) {
       jsdom.env(
           source,
           [ 'jquery-1.7.1.min.js' ],  // (*)
           function(errors, window) {  // (**)
               process.nextTick(
                   function () {
                       if (errors) {
                           throw new Error("There were errors: "+errors);
                       }
                       callback(window);
                   }
               );
           }
       );
   }
   function documentToSource(doc) {
    // The non-standard window.document.outerHTML also exists,
    // but currently does not preserve source code structure as well

    // The following two operations are non-standard
    return doc.doctype.toString()+doc.innerHTML;
}
app.get('/mypods',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
      console.log(db.collection('users').find({"username": "rahulrajus"}))

  console.log(db.collection('users').find({"username": "rahulrajus"}))
  var htmlSource = fs.readFileSync(__dirname + "/public/groups.html", "utf8");

    // console.log(data.length)
    call_jsdom(htmlSource, function (window) {
        var $ = require('jquery')(window)
        var cookies = parseCookies(req);
        var usrname = cookies["user"]
        console.log(cookies)
           console.log("OK",usrname)

  db.collection('users').find({"username": ""+usrname}).toArray(function(err,data){
       console.log(data.length)
      //  data.forEach(function(err,doc){
         var grplst = data[0]["groups"]
         console.log(data[0])
         console.log("OK",grplst)
         console.log(grplst.length)
         for(var i = 0;i<grplst.length;i++)
         {
           console.log(i)
           $("#shwpod").append("<p id=\"m_name\"><button type=\"submit\" onclick=\"document.shwpod.submit();\" class=\"btn btn-outline-success my-2 my-sm-0\">View</button>" +  grplst[i] + "</p>")
         }
      //  })
        //  console.log(k)
         res.send($("html")[0].outerHTML)

     })

    });


  // db.close();
})


})
app.post('/showpod',(req,res) =>{
  // res.sendFile(__dirname + "/public/test.html")

})
app.get('/showpod',(req,res) =>{
  res.sendFile(__dirname + "/public/groupDetails.html")

})
app.post('/addpod',(req,res)=>{

  group_json = {}
  group_json["name"] = req.body.name;
  people = req.body.users;
  people_lst = people.split(",");
  group_json["people"] = people_lst;
  group_json["stocks"] = []
   console.log("OK " + group_json)
 MongoClient.connect(url, function(err,db){
   db.collection('groups').insert(group_json)
   db.close();
 })
  // req.db.createCollection("groups")
  // console.log("hello",req.db.groups)
  // var groupsCollection = db.collection('groups');
  // var userCollection = db= mongo.createCollection('groups');


      MongoClient.connect(url, function(err, db) {
  for(var i = 0;i<people_lst.length;i++)
  {
    console.log("ok",people_lst[i])
    obj = {"email":people_lst[i]}
    // console.log("k",req.db.users.find())
    // console.log("okk",req.db.users.find({"email":"rahulrajan@gmail.com"}));

    // req.db.users.find({"email":("" + people_lst[i])},function(err,usrs){
    //   console.log(err)
    //   console.log(usrs)
    //   usrs.forEach(function(usr){
    //     console.log(usr)
    //     usr.insert(req.body.name)
    //   })
    // })

  //   db.collection("users").findAndModify(
  //
  //     {query: {"email":people_lst[i]},update: {$addToSet : {groups: req.body.name}}}, function(err,doc,lastErrorObject)
  //     {
  //       console.log(doc)
  //     }
  //
  //
  // );
  db.collection("users").updateOne({"email":people_lst[i]},{$addToSet : {groups: req.body.name}},function(err,result){
    assert.equal(err, null);
  //  assert.equal(1, result.result.n);
    //console.log("Updated the document with the field a equal to 2");
    // callback(result);
    console.log(result)
  })
  // db.collection("groups").updateOne({})


        res.sendFile(__dirname + "/public/groupDetails.html");
    // .forEach(function(d){
    //   // d.createCollection("groups")
    //   // if(d)
    //   d.groups.insert(req.body.name)
    // })
  }
  })

})

app.get('/myinvestments',(req,res)=>{
  res.sendFile(__dirname + "/public/investments.html");
})
app.get('/market',(req,res)=>{
  res.sendFile(__dirname + "/public/market.html")
})
app.get('/recs',(req,res)=>{
  res.sendFile(__dirname + "/public/recs.html")
})

// app.get('/mypods',(req,res)=>{
//   res.sendFile(__dirname + "/public/groups.html");
// })
app.post('/login',(req,res) => {
  console.log(req.body.username);
  console.log(req.body.password);
  var nm = req.body.username;
  var ps = req.body.password;
  // req.db.users.find("username: " + nm,function(err,doc){
  //   console.log("error: ", err)
  // })
  MongoClient.connect(url, function(err, db) {
      console.log(db.collection('users').find({"username": "" + nm}))

  console.log(db.collection('users').find({"username": "" + nm}))
  db.collection('users').find({"username": "" + nm}).toArray(function(err,data){
    console.log(data.length)
    if(data.length > 0)
    {
      console.log("success")
      // res.writeHead(200,{
      //   'Set-Cookie':'user=' + nm
      // },function(r){
      //     res.sendFile(__dirname + "/public/index.html");
      //
      // })
      res.cookie('user',nm)
       res.sendFile(__dirname + "/public/index.html");
    }
    else {
      console.log("fail")
      res.send("fail");
    }
  })
  // db.close();
})

  // if(req.db.users.find({"username": "" + nm}).hasNext())
  // {
  //   console.log("success")
  //   // res.writeHead(200,{
  //   //   'Set-Cookie':'user=' + nm
  //   // },function(r){
  //   //     res.sendFile(__dirname + "/public/index.html");
  //   //
  //   // })
  //   res.cookie('user',nm)
  //    res.sendFile(__dirname + "/public/index.html");
  //
  //
  // }
  // else {
  //   console.log("fail")
  //   res.send("fail");
  // }

})
app.post('/signup',(req,res) => {
  t_name = req.body.name;
  t_email = req.body.email;
  t_username = req.body.username;
  t_password = req.body.password;
  t_acct = req.body.account;
  console.log(t_name + " " + t_email + " " + t_username + " " + t_password + " " + t_acct)
  // req.db.users.insertOne({ name: t_name,email: t_email,username: t_username,password: t_password,capital_one: t_acct })
  MongoClient.connect(url, function(err, db) {
  db.collection('users').insert({ name: t_name,email: t_email,username: t_username,password: t_password,capital_one: t_acct },function(err,users){
    console.log('error')
    db.close();
  })

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
