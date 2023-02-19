const express = require("express");
const mongoose = require("mongoose");
const app = express();
// var axios = require("axios");
const bodyparse = require('body-parser')
var crypto = require("crypto");


// Connect to database
mongoose.connect("", { useNewUrlParser: true}, {useUnifiedTopology: true})

let userData = new mongoose.Schema({
    email: {type: String},
    password: {type: String},
    Portfolio: {type: Array},
    serverSalt: {type: String},
})

// Define collection within database
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

// Sets the access to the server
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

// First function of login check. Checks if user exists and returns a server salt if true else return error message
app.post('/loginCheck', function(req, res){
    console.log("Received login request")
    
    collection.findOne({email: req.body.userEmail}, function (err, docs){
        if(err){console.log(err)}
            else{
                if(docs == null){
                    console.log("User does not exist in database");
                    res.send({"status":"User does not exist"})
                }
                else if (docs.email == req.body.userEmail){
                    var serverGenerateSalt = crypto.randomBytes(5).toString('hex');
                    console.log("User found. Returning server-generated salt "+serverGenerateSalt)
                    collection.findOneAndUpdate({email: req.body.userEmail}, {$set: {serverSalt: serverGenerateSalt}}, (err, docs) => {
                        if (err){console.log(err)}})
                    res.send({"status":"User exists", "randomSalt":serverGenerateSalt})
                }
                else{
                    res.send({"status":"Login credentials false"})
                }
        }
    })
})

// Last function of login check. Creates a hash with the password from the database with the client salt and user salt
app.post("/loginVerify", function(req, res){
    console.log("Login: Received last request of verification",req.body)

    collection.findOne({email: req.body.userEmail}, function (err, docs){
        if(err){console.log(err)}
        else{
            if(docs == null){
                console.log("User does not exist in database");
                res.send({"status":"User does not exist"})
            }
            else{
                hashedPasswordSalt = crypto.createHash('SHA256').update(docs.password+docs.serverSalt+req.body.clientSalt).digest('hex')
                console.log("Comparing Server:",hashedPasswordSalt)
                console.log("Comparing Client:",req.body.hashedPassword)
                if (req.body.hashedPassword == hashedPasswordSalt){
                    console.log("Login Successful: Server and client request match")
                    collection.findOneAndUpdate({email: req.body.userEmail}, {$set: {serverSalt: ""}}, (err, docs) => {
                        if (err){console.log(`Error finding email: ${req.body.userEmail} Error: ${err}`)}
                        else{
                            res.send({"status":"Login successful"})
                        }})
                }
                else{
                    console.log("Login Unsuccessful: Request did not match the servers")
                    res.send({"status":"Password incorrect"})
                }
            }
        }
    })

})

// Checks if email already exists in the database, if not create a new account
app.post("/signUp", (req, res) => {
    console.log("Sign-up: Received request")
    
    collection.find({email: req.body.userEmail}, function (err, docs){
        if(err){console.log(err)}
        else{
        if(docs.length == 0){
            console.log("MongoDB: No existing accounts with the email - Creating account")
            collection.create({email: req.body.userEmail, password: req.body.userPassword, Portfolio: []});
            res.send({"status":"Created account"})
        }
        else{
            console.log("MongoDB: Failed to create account - Email already exists")
            res.send({"status":"Email already linked to account"})
        }}
    })
})

// AJAX request: Iterates over the user's document within the database and returns it as a XML file with a table format
app.get("/ajaxPost", (req, res) => {
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
    
    if (req.query.email == 'null'){
        console.log("AJAX Response: Invalid email")
        res.header('Content-Type', 'application/xml');
        res.status(200).send(`<p>Something went wrong while loading the email`);
        return
    }
    collection.findOne({email: req.query.email}, function (err, docs){
        if(err){console.log(err)}
        else{
            console.log("AJAX Received")

            docs.Portfolio.forEach(function(Position){
                data+=`<tr>
                            <td>${Position.Company}</td>
                            <td>${Position.Ticker}</td>
                            <td>${Position.Price}</td>
                            <td>${Position.Amount}</td>
                            <td>${Position.Date}</td>
                        </tr>`
            })
    
            data += `</table>`
            console.log("Sending AJAX Request")
            res.header('Content-Type', 'application/xml');
            res.status(200).send(data);
        }
    })
})

/*
app.get("/tickerGet", function(req, res){
    console.log("Loading ticker data");

    options.params.symbol = 'AAPL'
    axios.request(options).then(function (response){
        console.log(response.data);
    }).catch(function (err){
        console.log("Error:",err);
    })
})*/

// Checks if the user exists in the database: if user exists append and replace the new position to the portfolio
app.post("/addPosition", function(req, res){
    console.log("Body: ",req.body[0])
    if (req.body[0].email == null){
        console.log("Error adding position: No email found in request")
        return;
    }

    collection.findOne({email: req.body[0].email}, function(err, docs){
        if(err){console.log(err)}
        else{
        bData = req.body[0]    
        console.log("AddPosition: Found email - ",docs)
        var holdArr = docs.Portfolio

        holdArr.push({"Company":bData.companyInput, "Ticker":bData.tickerInput, "Price":bData.priceInput, "Amount":bData.amountInput, "Date":bData.dateInput})
        collection.findOneAndUpdate({email: req.body[0].email}, {$set: {Portfolio: holdArr}}, (err, docs)=>{
            if (err){
                console.log("Error on adding position. Err:",err)
            }
        })
        }
    })
})
