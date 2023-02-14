//jshint esversion:6
require("dotenv").config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
// var encrypt = require('mongoose-encryption');
const md5=require('md5');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

//database
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://0.0.0.0:27017/userDB");
const userSchema =new mongoose.Schema({
    email:String,
    password:String


})

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

// userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['age'] });
const User=mongoose.model("User",userSchema);


// const user1=new User({
//     email:"shake@111.com",
//     password:"shaker"
// });
// user1.save();




app.get('/', (req, res) => {
    res.render("home");
})

app.get('/login', (req, res) => {
    res.render("login");
})


app.post('/login', (req, res) => {

    User.findOne({email:req.body.username},function(err, user) {
      if(!err){
        if(user.password===md5(req.body.password)){
            res.render("secrets");
        }
        else{
            console.log("wrong password");
        }

      }
      else{
        console.log(err);
      }
    });

})

app.get('/register', (req, res) => {
    res.render("register");
})

app.post('/register', (req, res) => {
    const user=new User({
        email:req.body.username,
        password:md5(req.body.password)
    });

    user.save();
})


app.listen("3000",function(req,res) {
  console.log("Srever started succesfully at port 3000");
});