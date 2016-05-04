//import express package
var express = require("express");

//import mongodb package
var mongodb = require("mongodb");

//MongoDB connection URL - mongodb://host:port/dbName
var dbHost = "mongodb://localhost:27017/analyticsDB";

//DB Object
var dbObject;

//get instance of MongoClient to establish connection
var MongoClient = mongodb.MongoClient;

//Connecting to the Mongodb instance.
//Make sure your mongodb daemon mongod is running on port 27017 on localhost
MongoClient.connect(dbHost, function(err, db){
  if ( err ) throw err;
  dbObject = db;
});

function getData(responseObj){
  //use the find() API and pass an empty query object to retrieve all records
  dbObject.collection("rmonRandommin").find({}).toArray(function(err, docs){
    if ( err ) throw err;
    var timeArray = [];
    var sensor = [];
    //var dieselPrices = [];

    for ( index in docs){
      var doc = docs[index];
      //category array
      var time = doc[''];
      //series 1 values array
      var value = doc['value1'];
      //series 2 values array
      //var diesel = doc['diesel'];
      timeArray.push({"label": time});
      sensor.push({"value" : value});
      //dieselPrices.push({"value" : diesel});
    }

    var dataset = [
      {
        "seriesname" : "Sensor Value",
        "data" : sensor
      }
    ];

    var response = {
      "dataset" : dataset,
      "categories" : timeArray
    };
    responseObj.json(response);
  });
}

//create express app
var app = express();

//NPM Module to integrate Handlerbars UI template engine with Express
var exphbs  = require('express-handlebars');

//Declaring Express to use Handlerbars template engine with main.handlebars as
//the default layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Defining middleware to serve static files
app.use('/public', express.static('public'));
app.get("/randomData", function(req, res){
  getData(res);
});
app.get("/", function(req, res){
  res.render("chart");
});

app.listen("3300", function(){
  console.log('Server up: http://localhost:3300');
});
