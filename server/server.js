const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb+srv://exampleUser:twsmMiniproject!2022!@cluster0.flakl.mongodb.net/twsmProject", { useNewUrlParser: true}, {useUnifiedTopology: true})

let userData = new mongoose.Schema({
    userName: {type: String},
    portfolio: {type: String}
})

const collection = mongoose.model("userData", userData)

app.listen(6060, function(){
    console.log("Server. Port 6060");
})

app.get("/", function(req, res){
    collection.find({userName: 'testUser'}, function (err, docs){
        console.log("Printing:",err, docs)
        res.send(docs);
    });
})

