// To-do: Create a search bar for stocks (Probably won't be implemented in this version due to API limitations)
// To-do: Explore the 4 elements of network security mentioned at the Mini-Project Feedback Session

// To-do: Prevent code being sent as exectable code: By forcing the server to read it as characters on receive

// clientToken = crypto.randomBytes(20).toString('hex')
// ^Future implementation: Return client token on verify, pass token and verify it on every request


const express = require("express");
const mongoose = require("mongoose");
const app = express();
var axios = require("axios");
const bodyparse = require('body-parser')
var crypto = require("crypto");


// Database
mongoose.connect("mongodb+srv://exampleUser:twsmMiniproject!2022!@cluster0.flakl.mongodb.net/twsmProject", { useNewUrlParser: true}, {useUnifiedTopology: true})

let userData = new mongoose.Schema({
    email: {type: String},
    password: {type: String},
    Portfolio: {type: Array},
    serverSalt: {type: String},
})

const collection = mongoose.model("userData", userData)


/*
var options = {
    method: 'GET',
    url: 'https://alpha-vantage.p.rapidapi.com/query',
    params: {function: 'GLOBAL_QUOTE', symbol: 'MSFT', datatype: 'json'},
    headers: {
      'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com',
      'X-RapidAPI-Key': ''
    }
  };*/


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

                collection.findOneAndUpdate({email: req.body.userEmail}, {$set: {serverSalt: ""}}, (err, docs) => {
                    if (err){console.log(`Error finding email: ${req.body.userEmail} Error: ${err}`)}
                    else{
                        res.send({"status":"Login successful"})
                    }})
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
            collection.create({email: req.body.userEmail, password: req.body.userPassword, Portfolio: []});

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
    console.log("Ajax Input:",req)
    console.log("Query Input:",req.query)

    let data = `<?xml version="1.0" encoding="UTF-8"?>`
    data += `<table>
                <tr>
                    <th><p>Company</p></th>
                    <th><p>Ticker</p></th>
                    <th><p>Price</p></th>
                    <th><p>Amount</p></th>
                    <th><p>Date</p></th>
                </tr>`
    
    collection.findOne({email: req.query.email}, function (err, docs){
        if(err){console.log(err)}
        else{
            console.log("FullDocs:",docs)
            console.log("Found Portfolio:",docs.Portfolio)


            docs.Portfolio.forEach(function(Position){
                data+=`<tr>
                            <td>${Position.Company}</td>
                            <td>${Position.Ticker}</td>
                            <td>${Position.Price}</td>
                            <td>${Position.Amount}</td>
                            <td>${Position.Date}</td>
                        </tr>`
            })


            console.log("Sending Data:",data)
    
            data += `</table>`
            // console.log("AJAX Received")
            console.log("Sending AJAX Request")
            res.header('Content-Type', 'application/xml');
            res.status(200).send(data);
        }
    })



})

/*app.get("/requestData", function(req, res){
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
})*/

app.post("/addPosition", function(req, res){
    console.log("Body: ",req.body[0])

    collection.findOne({email: req.body[0].email}, function(err, docs){
        bData = req.body[0]    
        console.log("AddPosition: Found email - ",docs)
        var holdArr = docs.Portfolio

        holdArr.push({"Company":bData.companyInput, "Ticker":bData.tickerInput, "Price":bData.priceInput, "Amount":bData.amountInput, "Date":bData.dateInput})
        collection.findOneAndUpdate({email: req.body[0].email}, {$set: {Portfolio: holdArr}}, (err, docs)=>{
            if (err){
                console.log("Error on adding position. Err:",err)
            }
        })
    
})

})
