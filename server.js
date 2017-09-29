var express = require("express");
var app = express();
var port = 3000;
var mongoose = require("mongoose");
var MongoClient = require('mongodb').MongoClient;
mongoose.Promise = global.Promise;
/*mongoose.connect("mongodb://localhost:27017/beatbox", function(err, db) {
  if (err) throw err;
  console.log("Database created!");  
});*/

mongoose.connect("mongodb://beatbox:beatbox123@ds161471.mlab.com:61471/sod", function(err, db) {
  if (err) throw err;
  console.log("Database created!");  
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
//Needs to be exported
var beatboxSchema = new mongoose.Schema({
    name: String,
    email: String,
    specialty: Array,
    password: String
    
});
//Needs to be exported
var beatboxLoginSchema = new mongoose.Schema({
    email: String,
    password: String
    
});

var User = mongoose.model("User", beatboxSchema);
var Login = mongoose.model("Login", beatboxLoginSchema);

/*******User Sign Up Routers *******************************
********* var User = mongoose.model("User", beatboxSchema);
***********************************************************/
//Home Page
app.get("/", (req, res) => {
 res.sendFile(__dirname + "/index.html");
});

//Registration Form
app.get("/register", (req, res) => {
 res.sendFile(__dirname + "/public/signin.html");
});

app.get("/thanks", (req, res) => {
User.find({ 'name': 'Jack' }, 'name', function (err, name) {
    res.render('thanks', {message: name[0].name})
    console.log(name[0].name + ' WInning');
  if (err) return handleError(err);  
  });
});

//Registration Form After Submit
app.post("/register", (req, res) => {
 var myData = new User(req.body);
 console.log(req.body.email);
    myData.save()
        .then(item => {
           res.redirect("/thanks");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

//Thank You Page 
app.get("/thanks", (req, res) => {
User.find({ 'name': 'Jack' }, 'name', function (err, name) {
    res.render('thanks', {message: name[0].name})
    console.log(name[0].name + ' WInning');
  if (err) return handleError(err);  
  });
});
/*********Login Form Routers*******************************
**********var Login = mongoose.model("Login", beatboxLoginSchema);
***********************************************************/
app.get("/login", (req, res) => {

    res.render('login')
  

});

app.post('/login', (req, res, next)=>{
const email = req.body.email;
const password = req.body.password;

User.findOne({email: email, password: password}, function(err, user) {
  if(err){console.log(err)}


if(!user) {
  return res.status(404).send();
}
console.log(user.name)
res.render('index', {name:user.name});
});
});


app.listen(port, () => {
 console.log("Server listening on port " + port);
});