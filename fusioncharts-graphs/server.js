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

function getTempData(responseObj){
  //use the find() API and pass an empty query object to retrieve all records
  

   dbObject.collection("rmonTempmin").find({}).toArray(function(err, docs){
    if ( err ) throw err;
    var timeArray = [];
    var value1 = [];
    var value2 = [];
    var value3 = [];
    var value4 = [];
    var value5 = [];
    //var dieselPrices = [];

    for ( index in docs){
      var doc = docs[index];
      //category array
      var time = doc[''];
      //series 1 values array
      var val1 = doc['value1'];
      var val2 = doc['value2'];
      var val3 = doc['value3'];
      var val4 = doc['value4'];
      var val5 = doc['value5'];
      //series 2 values array
      //var diesel = doc['diesel'];
      timeArray.push({"label": time});
      value1.push({"value" : val1});
      value2.push({"value" : val2});
      value3.push({"value" : val3});
      value4.push({"value" : val4});
      value5.push({"value" : val5});
      //dieselPrices.push({"value" : diesel});
    }

    var tempData = [
      {
        "seriesname" : "Temp 1",
        "data" : value1
      }
      ,
      {
        "seriesname" : "Temp 2",
        "data": value2
      }
      ,
      {
        "seriesname" : "Temp 3",
        "data": value3
      }
      ,
      {
        "seriesname" : "Temp 4",
        "data": value4
      }
      ,
      {
        "seriesname" : "Temp 5",
        "data": value5
      }
    ];

    var response2 = {
      "dataset" : tempData,
      "categories" : timeArray
    };
    responseObj.json(response2);
  });


}


function getMPUData(responseObj){
  //use the find() API and pass an empty query object to retrieve all records
  

   dbObject.collection("rmonMPUmin").find({}).toArray(function(err, docs){
    if ( err ) throw err;
    var timeArray = [];
    var value1 = [];
    var value2 = [];
    var value3 = [];
    //var dieselPrices = [];

    for ( index in docs){
      var doc = docs[index];
      //category array
      var time = doc[''];
      //series 1 values array
      var val1 = doc['value1'];
      var val2 = doc['value2'];
      var val3 = doc['value3'];
      //series 2 values array
      //var diesel = doc['diesel'];
      timeArray.push({"label": time});
      value1.push({"value" : val1});
      value2.push({"value" : val2});
      value3.push({"value" : val3});
      //dieselPrices.push({"value" : diesel});
    }

    var MPUData = [
      {
        "seriesname" : "MPU 1",
        "data" : value1
      }
      ,
      {
        "seriesname" : "MPU 2",
        "data": value2
      }
      ,
      {
        "seriesname" : "MPU 3",
        "data": value3
      }
    ];

    var response2 = {
      "dataset" : MPUData,
      "categories" : timeArray
    };
    responseObj.json(response2);
  });


}


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
app.get("/tempData", function(req, res1){
  getTempData(res1);
});

app.get("/MPUData", function(req, res1){
  getMPUData(res1);
});

app.get("/randomData", function(req, res1){
  getData(res1);
});

app.get("/", function(req, res){
  res.render("chart");
});

app.listen("3300", function(){
  console.log('Server up: http://localhost:3300');
});
