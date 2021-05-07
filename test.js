var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
const sqlites = require('./accessdb.js');
app.use(express.json());
app.use(express.static('public'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

sqlites.createLeaderBoardTable();
//sqlites.insertPlayer(100,'Player1');
sqlites.createAccountsTable();

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});



app.post('/newuser', function (req, res) {
  var username = req.body.create_username;
  var password = req.body.create_password;

  sqlites.insertAccount(1,username,password);
  res.redirect('/');
});


app.post('/name', function (req, res) {
  const course = {
    score:req.body.score,
    name:req.body.name
  };
  sqlites.insertPlayer(req.body.score,req.body.name);
  res.send(course);
});

app.get('/logout', function(request, response){
  request.session.loggedin = false;
  request.session.username = undefined;
  response.redirect('/');
});

//FINISH THIS
app.put('/update',function(request,response){
  var name = request.session.username;
  sqlites.getScore(name).then((value) => {
    
    var newscore =value[0]+1;
    console.log(newscore);
    sqlites.updatePlayer(newscore,name);
  });

  
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
  if (username && password) {
    sqlites.selectAccounts(username,password).then((value)=>{
      console.log(value);
      if (value.length>0){
        request.session.loggedin = true;
        request.session.username = username;
        response.redirect('/');
        
      }
      else {
        response.send('Incorrect Username and/or Password!');
      }	
      response.end();
    });
  }
  else {
		response.send('Please enter Username and Password!');
		response.end();
	}
  
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send(request.session.username);
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/name', function(req, res){
  //console.log(JSON.stringify(courses));
  sqlites.selectPlayers().then((value) => {
    res.send(JSON.stringify(value));
  });
});

console.log(__dirname);

app.listen(process.env.PORT || 5000);


