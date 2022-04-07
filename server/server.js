// To-do: Implement session key to verify connection
// To-do: Display API data with AJAX
// To-do: Hash and salt user data
// To-do: Create a search bar for stocks (Probably won't be implemented in this version due to API limitations)
// To-do: Explore the 4 elements of network security mentioned at the Mini-Project Feedback Session

// To-do: Login function -> User Post Request -> Server Verify on Database -> Return response and set login to true
// To-do: Sign-up function -> Encode user credentials -> Store on database -> Return response status. Check if already exists.
// To-do: Create portfolio management -> Add positions (Ticker, amount, date, price) -> Remove positions -> Edit positions

// To-do: Prevent code being sent as exectable code: By forcing the server to read it as characters on receive

const express = require("express");
const mongoose = require("mongoose");
const app = express();
var axios = require("axios");
const xml = require("xml");
const bodyparse = require('body-parser')
var crypto = require("crypto");


// Database
mongoose.connect("mongodb+srv://exampleUser:twsmMiniproject!2022!@cluster0.flakl.mongodb.net/twsmProject", { useNewUrlParser: true}, {useUnifiedTopology: true})

let userData = new mongoose.Schema({
    email: {type: String},
    password: {type: String},
    serverSalt: {type: String}
})

const collection = mongoose.model("userData", userData)


// Finance API
// The next 8 lines of code are generated from the API documentation at: https://rapidapi.com/alphavantage/api/alpha-vantage/
var options = {
    method: 'GET',
    url: 'https://alpha-vantage.p.rapidapi.com/query',
    params: {function: 'GLOBAL_QUOTE', symbol: 'MSFT', datatype: 'json'},
    headers: {
      'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com',
      'X-RapidAPI-Key': '25f9e821c4msh4c2a74250c635d7p135234jsn8794cb0dff14'
    }
  };


app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:4200")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next();
})

app.use(bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true}))

app.listen(6060, function(){
    console.log("Server. Port 6060");
})

app.post('/loginCheck', function(req, res){
    console.log("Login: Checking if user exists",req.body)
    
    collection.findOne({email: req.body.userEmail}, function (err, docs){
        console.log(docs)
        if(docs == null){
            console.log("User does not exist in database");
            res.send({"status":"User does not exist"})
        }
        else if (docs.email == req.body.userEmail){
            console.log("True. Returning salt")
            var serverGenerateSalt = crypto.randomBytes(5).toString('hex');
            collection.findOneAndUpdate({email: req.body.userEmail}, {$set: {serverSalt: serverGenerateSalt}}, (err, docs) => {
                if (err){console.log(err)}})
            res.send({"status":"User exists", "randomSalt":serverGenerateSalt})
        }
        else{
            res.send({"status":"Login credentials false"})
        }
    })
})

app.post("/loginVerify", function(req, res){
    console.log("Login: Received request",req.body)

    collection.findOne({email: req.body.userEmail}, function (err, docs){
        if(docs == null){
            console.log("User does not exist in database");
            res.send({"status":"User does not exist"})
        }
        else{
            hashedPasswordSalt = crypto.createHash('SHA256').update(docs.password+docs.serverSalt+req.body.clientSalt).digest('hex')
            console.log("Comparing Server:",hashedPasswordSalt)
            console.log("Comparing Client:",req.body.hashedPassword)
            if (req.body.hashedPassword == hashedPasswordSalt){
                collection.findOneAndUpdate({email: req.body.userEmail}, {$set: {serverSalt: ""}}, (errf, docsf) => {
                    if (errf){console.log(errf)}})
                res.send({"status":"Login successful"})
            }
            else{
                res.send({"status":"Password incorrect"})
            }
        }
    })

})

app.post("/signUp", (req, res) => {
    console.log("Sign-up: Received request")
    
    collection.find({email: req.body.userEmail}, function (err, docs){
        if(docs.length == 0){
            console.log("MongoDB: No existing accounts with the email - Creating account")
            collection.create({email: req.body.userEmail, password: req.body.userPassword});

            res.send({"status":"Created account"})
        }
        else{
            console.log("MongoDB: Failed to create account - Email already exists")

            res.send({"status":"Email already linked to account"})
        }
    })
})


app.get("/ajaxPost", (req, res, next) => {
    // Load MongoDB Data + fetch with finance API ticker data

    let data = `<?xml version="1.0" encoding"UTF-8"?>`;
    data += "<h1>Hi!</h1>"

    var dataTest = [{h2: 'Hello World!'}]

    console.log("AJAX Received")
    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml(dataTest));
})

app.get("/requestData", function(req, res){
    // AJAX Request => Append positions to client

    console.log("Received request");
    collection.find({userName: 'testUser'}, function (err, docs){
        console.log("Printing:",err, docs)
        axios.request(options).then(function (response){
            console.log(response.data);
        }).catch(function (err){
            console.log("Error:",err);
        })

        res.send(docs);
    });
})

app.get("/tickerGet", function(req, res){
    console.log("Loading ticker data");

    options.params.symbol = 'AAPL'
    axios.request(options).then(function (response){
        console.log(response.data);
    }).catch(function (err){
        console.log("Error:",err);
    })
})