var express = require('express');
var user = express.Router();
var _model = require('../models/model');
var request = require('request');
var bodyParser = require('body-parser');
var async = require('async');
//user.use(bodyParser.urlencoded({ extended: true }));
var config = require('dotenv').config();
var moment = require('moment'); 
var wait = require("async-func");
const log = require('simple-node-logger').createSimpleLogger('project.log');
var Mail = require('../mail/mail.js');
var mysql = require('mysql');
var csv_export=require('csv-export');
var fs = require('fs');

var con = mysql.createConnection({
	host: process.env.MYSQL_IP,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database : process.env.KEYSPACE
});

con.connect(function(err) {
	if (err) throw err;
	// console.log("Connected to MySQL in index");
});

user.get('/abc', function(req, res, next) {
  res.send({"txt":"firstaaa"});
});

user.get('/getMenus', function(req, res, next) {
  res.send({"txt":"second"});
});

user.get('/getMenus1', function(req, res, next) {
  res.send({"txt":"secsssssssond"});
});


module.exports = user;
