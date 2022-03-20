// To-do: Implement Yahoo Fianance API
// To-do: Implement session key to verify connection

const express = require("express");
const mongoose = require("mongoose");
const app = express();
var axios = require("axios").default;


// Database
mongoose.connect("mongodb+srv://exampleUser:twsmMiniproject!2022!@cluster0.flakl.mongodb.net/twsmProject", { useNewUrlParser: true}, {useUnifiedTopology: true})

let userData = new mongoose.Schema({
    userName: {type: String},
    portfolio: {type: String}
})

const collection = mongoose.model("userData", userData)


// Finance API
// The next 8 lines of code are generated from the documentation at: https://rapidapi.com/lattice-data-lattice-data-default/api/stock-market-data/
var options = {
    method: 'GET',
    url: 'https://stock-market-data.p.rapidapi.com/stock/quote',
    params: {ticker_symbol: 'MSFT'},
    headers: {
      'x-rapidapi-host': 'stock-market-data.p.rapidapi.com',
      'x-rapidapi-key': '25f9e821c4msh4c2a74250c635d7p135234jsn8794cb0dff14'
    }
  };


app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:4200")
    next();
})

app.listen(6060, function(){
    console.log("Server. Port 6060");
})

app.get("/requestData", function(req, res){
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

app.get("/authenthicate", function(req, res){
    collection.find({userName: 'validUser'}, function (err, docs){
        console.log("Authenticating...")
    })
})

app.get("/apiTest", function(req, res){
    console.log("test");
    
})