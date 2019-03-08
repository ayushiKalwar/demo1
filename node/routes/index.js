var express = require('express');
var router = express.Router();
var _model = require('../models/model');
//var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://test:test@172.16.159.13:27017/stp_db";//"mongodb://127.0.0.1:27017/";
var request = require('request');
var bodyParser = require('body-parser');
var async = require('async');
router.use(bodyParser.urlencoded({ extended: true }));
//var ObjectId = require('mongodb').ObjectID;
var config = require('dotenv').config();
//const mongoose = require('mongoose');
var moment = require('moment'); 
var wait = require("async-func");
const log = require('simple-node-logger').createSimpleLogger('project.log');
//var models = require('express-cassandra');
var Mail = require('../mail/mail.js');
var mysql = require('mysql');
var csv_export=require('csv-export');
var fs = require('fs');
var _ = require('underscore');
var con = mysql.createConnection({
	host: process.env.SQL_HOSTNAME,
	user: process.env.SQL_USER,
	password: process.env.SQL_PWD,
	database : process.env.KEYSPACE
});

con.connect(function(err) {
	if (err) throw err;
	// console.log("Connected To DB");
});

router.get('/kairosdbinsert', function(req, res, next){
	let data = [];
	var velocityofclosedsprints = _model.getAllsprintByPKEY('NEX');
	velocityofclosedsprints
	.then(function(object){
		for(var i=0; i<object.length;i++){
			if(object[i].state=="closed") {
			// console.log(new Date().getTime());
				data.push({"name":"velocitydemo_NEX","timestamp":new Date().getTime()+i, "value":object[i].velocity, "tags":{"productname":"NEX", "entityname":"velocity", "sprintid":object[i].sprint_id, "sprintname":(object[i].sprint_name).replace(/'/g, "\\'")}});
			}
		}
		return(data);
	})
	.then(function(object){
		_model.sendtokairos(JSON.parse(JSON.stringify(object)), function(data){
			res.send(data);
		});
	});
});

router.get('/kairosdbinsertloc_changed', function(req, res, next){
	let data = [];
	var velocityofclosedsprints = _model.getAlltechnical_debtloc_changedByPKEY('NEX');
	velocityofclosedsprints
	.then(function(object){
		for(var i=0; i<object.length;i++){
			if(object[i].state=="closed") {
			// console.log(new Date().getTime());
				data.push({"name":"locchanged_NEX","timestamp":new Date().getTime()+i, "value":object[i].delta_loc, "tags":{"productname":"NEX", "entityname":"delta_loc", "sprintid":object[i].sprint_id, "sprintname":(object[i].sprint_name).replace(/'/g, "\\'")}});
			}
		}
		return(data);
	})
	.then(function(object){
		_model.sendtokairos(JSON.parse(JSON.stringify(object)), function(data){
			res.send(data);
		});
	});
});

router.get('/kairosdbinsert_leadtime', function(req, res, next){
	let data = [];
	var velocityofclosedsprints = _model.getAllsprintByPKEY('NEX');
	velocityofclosedsprints
	.then(function(object){
		for(var i=0; i<object.length;i++){
			if(object[i].state=="closed") {
			// console.log(new Date().getTime());
				data.push({"name":"leadtime_NEX","timestamp":new Date().getTime()+i, "value":object[i].lead_time, "tags":{"productname":"NEX", "entityname":"delta_loc", "sprintid":object[i].sprint_id, "sprintname":(object[i].sprint_name).replace(/'/g, "\\'")}});
			}
		}
		return(data);
	})
	.then(function(object){
		_model.sendtokairos(JSON.parse(JSON.stringify(object)), function(data){
			res.send(data);
		});
	});
});

router.get('/kairosdbinsert_wipcount', function(req, res, next){
	let data = [];
	var velocityofclosedsprints = _model.getAllsprintByPKEY('NEX');
	velocityofclosedsprints
	.then(function(object){
		for(var i=0; i<object.length;i++){
			if(object[i].state=="closed") {
			// console.log(new Date().getTime());
				data.push({"name":"wip_count_NEX","timestamp":new Date().getTime()+i, "value":object[i].wip_count, "tags":{"productname":"NEX", "entityname":"wip_count", "sprintid":object[i].sprint_id, "sprintname":(object[i].sprint_name).replace(/'/g, "\\'")}});
			}
		}
		return(data);
	})
	.then(function(object){
		_model.sendtokairos(JSON.parse(JSON.stringify(object)), function(data){
			res.send(data);
		});
	});
});

router.get('/kairosdbinsert_cycle_time', function(req, res, next){
	let data = [];
	var velocityofclosedsprints = _model.getAllsprintByPKEY('NEX');
	velocityofclosedsprints
	.then(function(object){
		for(var i=0; i<object.length;i++){
			if(object[i].state=="closed") {
			// console.log(new Date().getTime());
				data.push({"name":"cycle_time_NEX","timestamp":new Date().getTime()+i, "value":object[i].cycle_time, "tags":{"productname":"NEX", "entityname":"cycle_time", "sprintid":object[i].sprint_id, "sprintname":(object[i].sprint_name).replace(/'/g, "\\'")}});
			}
		}
		return(data);
	})
	.then(function(object){
		_model.sendtokairos(JSON.parse(JSON.stringify(object)), function(data){
			res.send(data);
		});
	});
});

router.get('/kairosdbinsert_violation', function(req, res, next){
	let data = [];
	var velocityofclosedsprints = _model.getAlltechnical_debtloc_changedByPKEY('NEX');
	velocityofclosedsprints
	.then(function(object){
		for(var i=0; i<object.length;i++){
			if(object[i].state=="closed") {
			// console.log(new Date().getTime());
				data.push({"name":"violation_NEX","timestamp":new Date().getTime()+i, "value":(object[i].violation), "tags":{"productname":"NEX", "entityname":"technical_debt", "sprintid":object[i].sprint_id, "sprintname":(object[i].sprint_name).replace(/'/g, "\\'")}});
			}
		}
		return(data);
	})
	.then(function(object){
		_model.sendtokairos(JSON.parse(JSON.stringify(object)), function(data){
			res.send(data);
		});
	});
});


router.get('/kairosdbinsert_efforts', function(req, res, next){
	let data = [];
	var velocityofclosedsprints = _model.getAlltechnical_debtloc_changedByPKEY('NEX');
	velocityofclosedsprints
	.then(function(object){
		for(var i=0; i<object.length;i++){
			if(object[i].state=="closed") {
			// console.log(new Date().getTime());
				data.push({"name":"efforts_NEX","timestamp":new Date().getTime()+i, "value":(object[i].effort)/60, "tags":{"productname":"NEX", "entityname":"effort", "sprintid":object[i].sprint_id, "sprintname":(object[i].sprint_name).replace(/'/g, "\\'")}});
			}
		}
		return(data);
	})
	.then(function(object){
		_model.sendtokairos(JSON.parse(JSON.stringify(object)), function(data){
			res.send(data);
		});
	});
});


router.get('/kairosdbselect/:entityname/:projectKey', function(req, res, next){
	// console.log('dgfdgfdfjkdskhfsdhf = '+'http://'+process.env.KAIROSDB_IP+':'+process.env.KAIROS_PORT+'/api/v1/datapoints/query');
	var query = {
					"start_absolute": 895905901000,
					"align_sampling": true,
					"align_start_time": true,
					"align_end_time": false,
					"end_relative ": {"value":2,"unit":"HOURS"},
					"metrics": [{
					"name": req.params.entityname+'_'+req.params.projectKey,
					"tags": {"productname":"NEX"},
					"aggregators": [
									{
										"name": "avg",
										"sampling": {
										   "value": 1,
										   "unit": "minutes"
										}
									}
								 ]

					}]
				};
		request.post(
		{
			url: 'http://'+process.env.KAIROSDB_IP+':'+process.env.KAIROS_PORT+'/api/v1/datapoints/query',
			body: query,
			json: true
		}, function (error, response, body) {
			if(error) console.log(error);
			res.send(body);
		});
});


router.get('/leaaokairose/:forwhat/:aggregate', function(req, res, next){
	// console.log('dstkhjksdfhksdjhsdk = '+req.params.forwhat);
	var query = {
					"start_absolute": 895905901000,
					"align_sampling": true,
					"align_start_time": true,
					"align_end_time": false,
					"end_relative ": {"value":2,"unit":"HOURS"},
					"metrics": [{
					"name": req.params.forwhat,
					"tags": {"productname":"NEX"},
					"aggregators": [
									{
										"name": req.params.aggregate,
										"sampling": {
										   "value": 1,
										   "unit": "minutes"
										}
									}
								 ]

					}]
				};
		request.post(
		{
			url: 'http://'+process.env.KAIROSDB_IP+':'+process.env.KAIROS_PORT+'/api/v1/datapoints/query',
			body: query,
			json: true
		}, function (error, response, body) {
			if(error) console.log(error);
			res.send(body);
		});
});


router.get('/getdaviation/:forwhat', function(req, res, next){
	// console.log('dstkhjksdfhksdjhsdk = '+req.params.forwhat);
	var query = {
					"start_absolute": 895905901000,
					"align_sampling": true,
					"align_start_time": true,
					"align_end_time": false,
					"end_relative ": {"value":200000000000000,"unit":"HOURS"},
					"metrics": [{
					"name": req.params.forwhat,
					"tags": {"productname":"NEX"},
					"aggregators": [
									{
										"name": "dev",
										"sampling": {
										   "value": 1,
										   "unit": "minutes"
										}
									}
								 ]

					}]
				};
		request.post(
		{
			url: 'http://'+process.env.KAIROSDB_IP+':'+process.env.KAIROS_PORT+'/api/v1/datapoints/query',
			body: query,
			json: true
		}, function (error, response, body) {
			if(error) console.log(error);
			res.send(body);
		});
});



router.get('/kairosdbdelete', function(req, res, next){
	request.delete(
	{
		url: 'http://'+process.env.KAIROSDB_IP+':'+process.env.KAIROS_PORT+'/api/v1/metric/violation_NEX',
	}, function (error, response, body) {
		if(error) reject(error);
		res.send(body);
	});
});



router.get('/getsprintwisevelocity', function(req, res, next){
	let data = [];
	var velocityofclosedsprints = _model.getsprintwisevelocity();
	velocityofclosedsprints
	.then(function(object){
		for(var i=0; i<object.length;i++){
			//var techdebt = (object[i].technicalDebtViolation);
			// console.log(new Date().getTime());
			if(object[i].status=="closed") {
				data.push({"name":"for_average_velocity","timestamp":new Date().getTime()+i, "value":object[i].VelocityOfSprint, "tags":{"productname":"NEX", "entityname":"velocity_sprint_wise", "sprintid":object[i].sprintId, "sprintname":object[i].sprintName}});
			}
		}
		return(data);
	})
	.then(function(object){
		// console.log(object);
		_model.sendtokairos(JSON.parse(JSON.stringify(object)), function(data){
			res.send(data);
		});
	});
});

router.get('/getAvgVelocityFrom', function(req, res, next){
	var query = {
					"start_absolute": 895905901000,
					"align_sampling": true,
					"align_start_time": true,
					"align_end_time": false,
					"metrics": [{
					"name": "for_average_velocity",
					"tags": {"productname":"NEX"},
					"aggregators": [
									{
										"name": "avg",
										"sampling": {
										   "value": 1,
										   "unit": "minutes"
										}
									}
								 ]

					}]
				};
		request.post(
		{
			url: 'http://172.16.13.164:8081/api/v1/datapoints/query',
			body: query,
			json: true
		}, function (error, response, body) {
			if(error) reject(error);
			res.send(body);
		});
});


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Home' });
});

router.get('/login',function(req, res, next){
	res.json({"data":"abcd"});
});

router.get('/testcassandra',function(req, res, next){
	con.query("select * from products", function(err, result) {
	  res.json({"data":result});
	});
});


/* Get Countries data from mysql to cqlsh */
router.get('/transafercounyrdata',function(req, res, next){
	var countryrec = _model.getcountrydatafrommongo();
	countryrec
	.then(function(object){
		//insert into cassandra
		_model.insertintocassandra(object,function(result){
			// console.log.log(result);
		});
	})
});


/* Product details apis */
router.get('/getvelocityofallclosedsprints/:product_id', function(req, res, next){
	var velocityofclosedsprints = _model.getVelocityoflastsprints(req.params.product_id);
	velocityofclosedsprints
	.then(function(object){
		// console.log(object);
		return (object);
	})
	.then(function(object){
		var lastelementV = object[0].velocity;
		return ({"object": object, "velocity":lastelementV});
	})
	.then(function(object){
		var velocities = [];
		for(var i = 0; i<object.object.length; i++){
			if(object.object[i].state == "closed")
			velocities.push(object.object[i].velocity);
		}
		var sum = velocities.reduce((a, b) => a + b, 0);
		var average = parseInt(sum)/velocities.length;
		// console.log(average);
		var meaned = [];
		for(var j = 0; j<velocities.length; j++){
			meaned.push((velocities[j]-average) * (velocities[j]-average));
		}
		// console.log(meaned);
		var meanedsum = meaned.reduce((a, b) => a + b, 0);
		var meanedaverage = meanedsum/(meaned.length-1);
		var sqrt = Math.sqrt(meanedaverage);
		var velocitydeviation = sqrt.toFixed(3);
		return ({"object": object, "velocitydeviation":velocitydeviation});
	})
	.then(function(object){
		// console.log(object);
		res.send(object);
	})
});

router.get('/getdeploymentpersprint/:product_id', function(req, res, next){
	// console.log("aaya");
	var deployment = _model.getLatestClosedSprintdeployment(req.params.product_id);
	deployment
	.then(function(object){
		return object;
	})
	.then(function(object){
		var lastestclosedsprint = [];
		var allclosedsprintdeployment = [];
		var allsprintname = [];
		for(var i=(object.length-1); i>=0; i--){
			if(object[i].state=="closed"){
				allclosedsprintdeployment.push(moment(object[i].deploymentdate).format('DD-MM-YYYY HH:MM:s'));
				allsprintname.push(object[i].name);
			}
			if(lastestclosedsprint.length==0 && object[i].state=="closed") {
				lastestclosedsprint.push(object[i]);
			}
		}
		res.send({"deploymentps": moment(lastestclosedsprint[0].deploymentdate).format('DD-MM-YYYY HH:MM:s'), "allclosedsprintdeployment":allclosedsprintdeployment, "allsprintname":allsprintname});
	})
});

router.get('/getallthisproduct/:product_id', function(req, res, next){
	var allproject = [];
	var latestent = [];
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		allproject.push({"project_detail":object});
		return allproject;
	})
	.then(function(object){
		_model.getAllsprints(object[0].project_detail[0].project_key, function(data){
			// console.log(data);
			if(data.length>0) {    
				allproject.push({"sprints_detail":data});
				//Now calculate everything latest closed;
				latestent.push({"bug_count":allproject[1].sprints_detail[0].bug_count});
				latestent.push({"complete_date":allproject[1].sprints_detail[0].complete_date});
				latestent.push({"cycle_time":allproject[1].sprints_detail[0].cycle_time});
				latestent.push({"end_date":allproject[1].sprints_detail[0].end_date});
				latestent.push({"lead_time":allproject[1].sprints_detail[0].lead_time});
				latestent.push({"sprint_id":allproject[1].sprints_detail[0].sprint_id});
				latestent.push({"sprint_name":allproject[1].sprints_detail[0].sprint_name});
				latestent.push({"start_date":allproject[1].sprints_detail[0].start_date});
				latestent.push({"state":allproject[1].sprints_detail[0].state});
				latestent.push({"velocity":allproject[1].sprints_detail[0].velocity});
				latestent.push({"wip_count":allproject[1].sprints_detail[0].wip_count});
				latestent.push({"project_detail":allproject[0].project_detail[0]});
				latestent.push({"sprints_detail":data});
				latestent.push({"allobject":object});
				// latestent.push({"allproject":allproject});
				res.send( latestent );
			} else {
				res.send( latestent );
			}
		})
	})
});

router.get('/gettechnical_debt/:product_id', function(req, res, next){
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		var project_key = object[0].project_key;
		return(project_key);
	})
	.then(function(object){
		//get technical_debt record
		return _model.gettechnical_debt(object);
	})
	.then(function(object){
		// console.log('getTech');
		// console.log(object);
		//_model.getColorCoding(object,(response)=> {
			// console.log(response);
			if(object.length>0 && object[0].state=="closed"){
				res.send({"effort":object[0].effort, "inserted_ts":object[0].inserted_ts, "id":object[0].id, "loc":object[0].loc, "delta_loc":object[0].delta_loc, "project_key":object[0].project_key, "sprint_name":object[0].sonar_project_name, "sprint_id":object[0].sprint_id, "voilation":object[0].violation, "allobject":object});
			}
		//});
	})
});


router.get('/gettechnical_debt_as/:product_id', function(req, res, next){
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		var project_key = object[0].project_key;
		return(project_key);
	})
	.then(function(object){
		//get technical_debt record
		return _model.gettechnical_debtR(object);
	})
	.then(function(object){
		if(object.length>0 && object[0].state=="active" && object[0].index_sp=="-1"){
			res.send({"effort":object[0].effort, "inserted_ts":object[0].inserted_ts, "id":object[0].id, "loc":object[0].loc, "delta_loc":object[0].delta_loc,"project_key":object[0].project_key, "sprint_name":object[0].sonar_project_name, "sprint_id":object[0].sprint_id, "voilation":object[0].violation});
		}
	})
});

router.get('/all_deployment_data/:product_id', function(req, res, next){
    var allData = [];
    var pr = _model.getallaboutproject(req.params.product_id);
    pr
    .then(function(object){
        var project_key = object[0].project_key;
        return(project_key);
    })
    .then(function(object){
        return _model.get_deployment(object);
    })
    .then(function(object){
        // console.log("all_deployment_data");
        allData.push({"deploymentData": object});
        // console.log(allData);
        res.send(allData);
    }, function() {
        res.send('completed');
    });
});

router.get('/deployment_data/:product_id', function(req, res, next){
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		return object[0].project_key;
	})
	.then(function(object){
		_model.getAllsprints(object, function(data){
			console.log("latesclosedsprint");
			console.log(data[0]);
			if(data.length==0){
				res.send([]);
			} else {
			var latesclosedsprint = data[0];
			//now getting the deployment of sprint
			var pr1 = _model.getDeploymentData(latesclosedsprint.id);
			pr1
			.then(function(object){
				return(object);
			})
			.then(function(object){
				// get failure and success deployment and all count 
				var i = 1;
				var successde = [];
				var failurede = [];
				var duration = [];
				async.forEach(object, function (item, callback){ 
					duration.push(parseInt(item['duration']));
					if(item['status']=="SUCCESS") {
						successde.push(item);
					} else if(item['status']=="FAILURE"){
						failurede.push(item);
					}
					if(i==object.length){
						var sum = duration.reduce((a, b) => a + b, 0);
						var avgduration = sum/duration.length;
						res.send({"successde":successde, "failurede":failurede, "totalde": object.length, "duration":avgduration});
					}
					i++;
				}, function() {
					res.send(object);
				});
			})
			}
		});
	})
});







router.get('/deployment_data_active/:product_id', function(req, res, next){
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		return object[0].project_key;
	})
	.then(function(object){
		_model.getAllsprintsR(object, function(data){
			if(data.length==0){
				res.send([]);
			} else {
			var activesprint = data[0];
			//now getting the deployment of sprint
			pr1 = _model.getDeploymentData(activesprint.id);
			pr1
			.then(function(object){
				return(object);
			})
			.then(function(object){
				// get failure and success deployment and all count 
				var i = 1;
				var successde = [];
				var failurede = [];
				var duration = [];
				async.forEach(object, function (item, callback){ 
					duration.push(parseInt(item['duration']));
					if(item['status']=="SUCCESS") {
						successde.push(item);
					} else if(item['status']=="FAILURE"){
						failurede.push(item);
					}
					
					if(i==object.length){
						var sum = duration.reduce((a, b) => a + b, 0);
						var avgduration = sum/duration.length;
						res.send({"successde":successde, "failurede":failurede, "totalde": object.length, "duration":avgduration});
					}
					i++;
				}, function() {
					res.send(object);
				});
			})
		}
		});
	})
});

router.get('/getactivesprint_gettechnical_debt/:product_id', function(req, res, next){
	var latestent = [];
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		return object;
	})
	.then(function(object){
		_model.getAllsprintsR(object[0].project_key, function(data){
			if(data.length > 0 && data[0].index_sp=="-1"){
				//var activesp = data[0];
				latestent.push({"bug_count":data[0].bug_count});
				latestent.push({"complete_date":data[0].complete_date});
				latestent.push({"cycle_time":data[0].cycle_time});
				latestent.push({"end_date":data[0].end_date});
				latestent.push({"lead_time":data[0].lead_time});
				latestent.push({"sprint_id":data[0].sprint_id});
				latestent.push({"sprint_name":data[0].sprint_name});
				latestent.push({"start_date":data[0].start_date});
				latestent.push({"state":data[0].state});
				latestent.push({"velocity":data[0].velocity});
				latestent.push({"wip_count":data[0].wip_count});
				latestent.push({"project_detail":object});
				res.send( latestent );			
			} else {				
				res.send('notfound');
			}
		});
	})
});




router.get('/getlatestrecord_sprint/:product_id', function(req, res, next){
	//var latestent = [];
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		return object;
	})
	.then(function(object){
		_model.getAllsprintsR(object[0].project_key, function(data){
			var latestclosed = (data[0]);
			//check latest first
			var getSprints = _model.checklatestsprint(data[0].sprint_id,data[0].project_key);
			getSprints
			.then(function(object){
				return _model.reverseJSON(JSON.parse(object));
			})
			.then(function(object){
				if(object[0].id!=data[0].sprint_id) {
					// console.log("Updated sprint details");
					res.send({"status":"sprint_updated"});
				}
				else {
					res.send(object[0]);
				}
			})
		});
	})
});

router.get('/getParticularSprint/:sprintid/:projectKey/:productid', function(req, res, next){
	_model.getAllsprintsR(req.params.projectKey, function(data){
		var latestclosed = (data[0]);
		var getSprints = _model.getSameSprint(req.params.sprintid,req.params.projectKey);
		getSprints
		.then(function(object){
			var sprintrec = JSON.parse(object);
			_model.updateSprint(latestclosed.id, sprintrec[0][0]);
			return latestclosed.id;
		})
		.then(function(sprintid){
			//get technical debt primary key from sprint id
			var tdrecord = _model.getTechnicalDebtPK(latestclosed.sprint_id,req.params.projectKey);
			return tdrecord;
		})
		/*
		.then(function(object){
			// console.log("upar wale se");
			// console.log(object)
			_model.deleteThisTechnicalDebt(object);
			return (object);
		})
		*/
		.then(function(object){
			_model.getTechnicalDebtForThisSprint(object, function(data){
				var intd = _model.updateTechnicalDebtForActiveSprint(object[0].id,data);
				intd
				.then(function(obj){
					//res.sendStatus(200).send(obj);
					//update deployment table
					return _model.getRecordFromDeploymentOfSameProjectKey(object[0].sprint_id);
				})
				.then(function(obj){
					if(obj.length>0){
						_model.deleteAllDeploymentById(obj, function(msg){
							//insert this sprint id records into deployment
							_model.getdeploymentforsprint(object[0].sprint_name, function(data1){
								// console.log(data1);
							});
						});
					}
					//insert this sprint id records into deployment
					_model.getdeploymentforsprint(object[0].sprint_name, function(data){
						// console.log(data);
						_model.insertdeployment(data, object[0].sprint_name, object[0].sprint_id, object[0].id, object[0].project_key, function(result){
							res.send({"status":"true"});
						});
					});
					
				})
				.catch((err) => {
				  // console.log({"status":"something_went_wrong", "error":err});
				});
			});
		})
		.catch((err) => {
		  // console.log({"status":"something_went_wrong", "error":err});
		});
	});
});

router.get('/getProjectKeyFromId/:project_id', function(req,res,next){
	var project_key = "";
	var project_name = "";
	pr = _model.getallaboutproject(req.params.project_id);
	pr
	.then(function(object){
		project_key = object[0].project_key;
		project_name = object[0].project_name;
		return _model.getPkIdFromSprintByKey(project_key);
	})
	.then(function(object){
		if(object.length>0) {
			async.forEach(object, function (item, callback){ 
				_model.deleteProjectRecordFromSprintById(item.id);
			});
		}
		var prsub = _model.getSprintDetailAPIByProjectKey(project_key);
		prsub
		.then(function(object){
			return _model.insertSprintsForSpecificProject(object,project_key, function(success){
				if(success=="done"){
					//delete all technical debt record of this project key
					var technical_debt_project_key_records = _model.getTechnicalDebtProjectKeyRecords(project_key);
					technical_debt_project_key_records
					.then(function(object){
						//log.info("deleteProjectRecordFromTechnicalDebtById");
						async.forEach(object, function (item, callback1){ 
							_model.deleteProjectRecordFromTechnicalDebtById(item.id);
							callback1();
						}, function() {
							//now get sprints names
							//log.info("getAllSprintsOfSameProjectKey");
							_model.getAllSprintsOfSameProjectKey(project_key, function(allsprints){
								//log.info("insertechnicaldebt");
								async.forEach(allsprints, function (item, callback){ 
									_model.gettechnicaldebtforsprint(item.sprint_name, function(data){
										_model.insertechnicaldebt(data, item.sprint_name, item.sprint_id, item.id, item.index_sp, item.project_key, item.state, function(result){
											callback();
										});
									});
								});
							});
						});
						return {};
					})
					.then(function(object){
						//log.info("getAllDeploymentRecordByProjectKey");
						var prsub = _model.getAllDeploymentRecordByProjectKey(project_key);
						prsub
						.then(function(object){
							//log.info("deleteDeploymentOfSameId");
							async.forEach(object, function (item, callback2){ 
								_model.deleteDeploymentOfSameId(item.id, function(success){
									callback2();
								});
							});
							return;
						})
						.then(function(object){
							//log.info("getAllSprintsOfSameProjectKey");
							_model.getAllSprintsOfSameProjectKey(project_key, function(allsprints){
								//log.info("insertdeployment");
								async.forEach(allsprints, function (item, callback){ 
									_model.getdeploymentforsprint(item.sprint_name, function(data){
										_model.insertdeployment(data, item.sprint_name, item.sprint_id, item.id, item.project_key, function(result){
											callback();
										});
									});
								});
							});
							res.send("ALL_DATA_UPDATED");
						})
					})
				}
			});
		})
	})
	//_model.getProducts((projects)=>{
		//async.forEach(projects, function (initem, incallback){ 
			//getting project key from project id
			/* var project_key = "";
			var project_name = "";
			pr = _model.getallaboutproject(req.params.project_id);
			pr
			.then(function(object){
				project_key = object[0].project_key;
				project_name = object[0].project_name;
				return _model.getPkIdFromSprintByKey(project_key);
			})
			.then(function(object){
				if(object.length>0) {
					async.forEach(object, function (item, callback){ 
						_model.deleteProjectRecordFromSprintById(item.id);
					});
					log.info("Deleted All Sprints");
				}
				var prsub = _model.getSprintDetailAPIByProjectKey(project_key);
				prsub
				.then(function(object){
					return _model.insertSprintsForSpecificProject(object,project_key, function(success){
						if(success=="done"){
							//delete all technical debt record of this project key
							var technical_debt_project_key_records = _model.getTechnicalDebtProjectKeyRecords(project_key);
							technical_debt_project_key_records
							.then(function(object){
								log.info("deleteProjectRecordFromTechnicalDebtById");
								async.forEach(object, function (item, callback1){ 
									_model.deleteProjectRecordFromTechnicalDebtById(item.id);
									callback1();
								}, function() {
									//now get sprints names
									log.info("getAllSprintsOfSameProjectKey");
									_model.getAllSprintsOfSameProjectKey(project_key, function(allsprints){
										async.forEach(allsprints, function (item, callback){ 
											_model.gettechnicaldebtforsprint(item.sprint_name, function(data){
												log.info("inserting technicaldebt");
												_model.insertechnicaldebt(data, item.sprint_name, item.sprint_id, item.id, item.index_sp, item.project_key, item.state, function(result){
													callback();
												});
											});
										});
									});
								});
								return {};
							})
							.then(function(object){
								log.info("getAllDeploymentRecordByProjectKey");
								var prsub = _model.getAllDeploymentRecordByProjectKey(project_key);
								prsub
								.then(function(object){
									log.info("deleteDeploymentOfSameId");
									async.forEach(object, function (item, callback2){ 
										//_model.deleteDeploymentOfSameId(item.id, function(success){
										_model.deleteDeploymentOfSameId(item.id);
										callback2();
										//});
									});
									log.info("Deleted All Deployment Record");
									return;
								})
								.then(function(object){
									 log.info("getAllSprintsOfSameProjectKey");
									_model.getAllSprintsOfSameProjectKey(project_key, function(allsprints){
										var sprintco = allsprints.length;
										log.info("inserting deployment");
										async.forEach(allsprints, function (item, callback){ 
											_model.getdeploymentforsprint(item.sprint_name, function(data){
												_model.insertdeployment(data, item.sprint_name, item.sprint_id, item.id, item.project_key, function(result){
													callback();
												});
											});
										}, function(){
											log.info("Inserted ALL data");
											res.send("ALL_DATA_UPDATED");
										});
									});
									
								})
							})
						}
					});
				});
			}); */
		//incallback();
	//});
	//});
});


router.get('/getlocpersprint/:product_id', function(req, res, next){
	var data = _model.getLatestClosedSprint(req.params.product_id);
	data
	.then(function(object){
		var lastestclosedsprint = [];
		var allclosedsprintidname = [];
		for(var i=(object.length-1); i>=0; i--){
			if(lastestclosedsprint.length==0 && object[i].state=="closed")
			lastestclosedsprint.push(object[i]);
			if(object[i].state=="closed"){
				allclosedsprintidname.push([object[i].name, object[i].id]);
			}
		}
		return({"sprintid":lastestclosedsprint[0].id, "allclosedsprintidname":allclosedsprintidname})
	})
	.then(function(object){
		var allloc = [];
		//var allsprintname = [];
		var i = 0;
		async.forEach(object.allclosedsprintidname, function (item, callback){ 
			var sprintname = (item[0]);
			var sprintid = (item[1]);
			var fn = _model.getlocvaluenp(sprintid);
			fn
			.then(function(data){
				allloc.push([data.attribute_value, sprintname, sprintid]);
				if((i+1)==(object.allclosedsprintidname).length)
				callback(allloc);
				i++;
			});
		}, function(obj) {
			res.send(obj.sort(_model.compareSecondColumn));
		});
	})
});	


router.get('/getcycletimecalculated/:product_id', function(req, res, next){
	var data = _model.getLatestClosedSprint(req.params.product_id);
	data
	.then(function(object){
		var lastestclosedsprint = [];
		var allclosedsprintidname = [];
		for(var i=(object.length-1); i>=0; i--){
			if(lastestclosedsprint.length==0 && object[i].state=="closed")
			lastestclosedsprint.push(object[i]);
			if(object[i].state=="closed"){
				allclosedsprintidname.push([object[i].name, object[i].id]);
			}
		}
		return({"sprintid":lastestclosedsprint[0].id, "allclosedsprintidname":allclosedsprintidname})
	})
	.then(function(object){
		var allloc = [];
		//var allsprintname = [];
		var i = 0;
		async.forEach(object.allclosedsprintidname, function (item, callback){ 
			var sprintname = (item[0]);
			var sprintid = (item[1]);
			var fn = _model.getlocvaluecycletime(sprintid);
			fn
			.then(function(data){
				allloc.push([data.attribute_value, sprintname, sprintid]);
				if((i+1)==(object.allclosedsprintidname).length)
				callback(allloc);
				i++;
			});
		}, function(obj) {
			res.send(obj.sort(_model.compareSecondColumn));
		});
	})
});	

router.get('/getLeadTimeCalculated/:product_id', function(req, res, next){
	var data = _model.getLatestClosedSprint(req.params.product_id);
	data
	.then(function(object){
		var lastestclosedsprint = [];
		var allclosedsprintidname = [];
		for(var i=(object.length-1); i>=0; i--){
			if(lastestclosedsprint.length==0 && object[i].state=="closed")
			lastestclosedsprint.push(object[i]);
			if(object[i].state=="closed"){
				allclosedsprintidname.push([object[i].id, object[i].name, moment(object[i].deploymentdate).format('DD-MM-YYYY HH:MM:s'), moment(object[i].startDate).format('DD-MM-YYYY HH:MM:s'), (moment(object[i].deploymentdate).diff(moment(object[i].startDate), 'days', true)).toFixed(3)]);
			}
		}
		return(allclosedsprintidname)
	})
	.then(function(object){
		res.send(object.sort(_model.compareSecondColumn));
	})
});

router.get('/getTechnicalDebtByAPI1/:product_id', function(req, res, next){
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		var sprint = _model.getAllsprints(object[0].project_key, function(object1){			
			var sprintArr = _.sortBy(object1,'index_sp').reverse();
			var technicalDebt = _model.getTechnicalDebtProjectKeyRecords(object[0].project_key);
			technicalDebt
			.then(function(object2){
				var techDebtArr = _.sortBy(object2,'index_sp').reverse();
				var data = [], index = 0;
				async.forEach(techDebtArr, function (item, callback){ 
					data.push({
						"technicalDebtViolation": item.violation,
						"sprintVelocity": sprintArr[index].velocity,
						"technicalDebtEffortInHours": item.effort/60,
						"sprintName" : item.sprint_name,
						"avgIndex": sprintArr[index].avgindex,
						"state" : item.state
					});
					index++
					callback();
				}, function() {
					res.send(data);
				});
			});
		});
	});
});

router.get('/getTechnicalDebtByAPI/:product_id', function(req, res, next){
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		// If spring services are running use this dynamic data
		/*var model = _model.getAPIres(process.env.JAVA_APIS_BASE_URL+'getAllClosedSprintsAttributes?projectKey='+object[0].project_key+'&tfsBranchName=MAIN');
		model
		.then(function(object1) {
			res.send(object1);
		});*/
		
		// If spring services are not running use this static data
		if(req.params.product_id == 'b9174705-1268-11e9-900a-719c048f1d35') {
			var object1 = [{"VelocityOfSprint":0,"wipQueueLen":0,"CycleTimeInDays":274,"DeployedStories":[{"ResolvedDate":1522320257000,"Key":"NEX-174"},{"ResolvedDate":1522320240000,"Key":"NEX-173"},{"ResolvedDate":1522320221000,"Key":"NEX-172"},{"ResolvedDate":1522320203000,"Key":"NEX-171"},{"ResolvedDate":1522320072000,"Key":"NEX-170"},{"ResolvedDate":1522320053000,"Key":"NEX-169"},{"ResolvedDate":1522319942000,"Key":"NEX-166"},{"ResolvedDate":1524485760000,"Key":"NEX-150"},{"ResolvedDate":1521011997000,"Key":"NEX-149"},{"ResolvedDate":1528702061000,"Key":"NEX-148"},{"ResolvedDate":1521010299000,"Key":"NEX-144"},{"ResolvedDate":1521010129000,"Key":"NEX-143"},{"ResolvedDate":1520947688000,"Key":"NEX-142"},{"ResolvedDate":1520947677000,"Key":"NEX-141"},{"ResolvedDate":1520947666000,"Key":"NEX-139"},{"ResolvedDate":1521085151000,"Key":"NEX-102"},{"ResolvedDate":1521085100000,"Key":"NEX-99"},{"ResolvedDate":1521084999000,"Key":"NEX-93"},{"ResolvedDate":1521456746000,"Key":"NEX-42"},{"ResolvedDate":1521006335000,"Key":"NEX-17"},{"ResolvedDate":1521006322000,"Key":"NEX-16"},{"ResolvedDate":1521006310000,"Key":"NEX-13"},{"ResolvedDate":1521005777000,"Key":"NEX-6"},{"ResolvedDate":1521006278000,"Key":"NEX-5"}],"bugCount":2,"sprintName":"Sprint 5 - 1st Mar to 14th Mar","LeadTimeInDays":242},{"VelocityOfSprint":91,"wipQueueLen":1,"CycleTimeInDays":455,"DeployedStories":[{"ResolvedDate":1522235835000,"Key":"NEX-244"},{"ResolvedDate":1521726278000,"Key":"NEX-241"},{"ResolvedDate":1521726052000,"Key":"NEX-235"},{"ResolvedDate":1522236848000,"Key":"NEX-230"},{"ResolvedDate":1522236923000,"Key":"NEX-227"},{"ResolvedDate":1522235952000,"Key":"NEX-221"},{"ResolvedDate":1522316369000,"Key":"NEX-203"},{"ResolvedDate":1521184373000,"Key":"NEX-184"},{"ResolvedDate":1521184154000,"Key":"NEX-183"},{"ResolvedDate":1521184059000,"Key":"NEX-179"},{"ResolvedDate":1521183967000,"Key":"NEX-178"},{"ResolvedDate":1522320280000,"Key":"NEX-175"},{"ResolvedDate":1538045484000,"Key":"NEX-157"},{"ResolvedDate":1522316133000,"Key":"NEX-153"},{"ResolvedDate":1528702061000,"Key":"NEX-148"},{"ResolvedDate":1521714570000,"Key":"NEX-146"},{"ResolvedDate":1521714060000,"Key":"NEX-145"},{"ResolvedDate":1521182688000,"Key":"NEX-138"},{"ResolvedDate":1522316539000,"Key":"NEX-137"},{"ResolvedDate":1522312648000,"Key":"NEX-43"},{"ResolvedDate":1521802731000,"Key":"NEX-21"},{"ResolvedDate":1521802964000,"Key":"NEX-15"}],"bugCount":8,"sprintName":"Sprint 6 - 15 Mar to 28 Mar","LeadTimeInDays":228},{"VelocityOfSprint":108,"wipQueueLen":0,"CycleTimeInDays":530,"DeployedStories":[{"ResolvedDate":1523597919000,"Key":"NEX-284"},{"ResolvedDate":1524920644000,"Key":"NEX-265"},{"ResolvedDate":1523876802000,"Key":"NEX-264"},{"ResolvedDate":1522320163000,"Key":"NEX-263"},{"ResolvedDate":1522824480000,"Key":"NEX-223"},{"ResolvedDate":1531206381000,"Key":"NEX-218"},{"ResolvedDate":1531206178000,"Key":"NEX-215"},{"ResolvedDate":1531205848000,"Key":"NEX-214"},{"ResolvedDate":1531206313000,"Key":"NEX-213"}],"bugCount":9,"sprintName":"Sprint 7 - 29 Mar to 14 Apr","LeadTimeInDays":214},{"VelocityOfSprint":194,"wipQueueLen":3,"CycleTimeInDays":325,"DeployedStories":[{"ResolvedDate":1525689079000,"Key":"NEX-403"},{"ResolvedDate":1525689236000,"Key":"NEX-399"},{"ResolvedDate":1524681238000,"Key":"NEX-396"},{"ResolvedDate":1524681097000,"Key":"NEX-392"},{"ResolvedDate":1524565018000,"Key":"NEX-361"},{"ResolvedDate":1524920523000,"Key":"NEX-351"},{"ResolvedDate":1524858358000,"Key":"NEX-350"},{"ResolvedDate":1524920644000,"Key":"NEX-265"},{"ResolvedDate":1523876802000,"Key":"NEX-264"},{"ResolvedDate":1531736364000,"Key":"NEX-200"},{"ResolvedDate":1525949097000,"Key":"NEX-189"},{"ResolvedDate":1524564515000,"Key":"NEX-161"}],"bugCount":9,"sprintName":"Sprint 8 - 13 Apr to 27 Apr","LeadTimeInDays":199},{"VelocityOfSprint":310,"wipQueueLen":0,"CycleTimeInDays":375,"DeployedStories":[{"ResolvedDate":1528367362000,"Key":"NEX-439"},{"ResolvedDate":1525951317000,"Key":"NEX-438"},{"ResolvedDate":1525854741000,"Key":"NEX-437"},{"ResolvedDate":1525979125000,"Key":"NEX-417"},{"ResolvedDate":1525979158000,"Key":"NEX-413"},{"ResolvedDate":1525979243000,"Key":"NEX-407"},{"ResolvedDate":1525689079000,"Key":"NEX-403"},{"ResolvedDate":1525689236000,"Key":"NEX-399"},{"ResolvedDate":1525955409000,"Key":"NEX-390"},{"ResolvedDate":1529673527000,"Key":"NEX-387"},{"ResolvedDate":1525944517000,"Key":"NEX-371"},{"ResolvedDate":1525674775000,"Key":"NEX-369"},{"ResolvedDate":1525674765000,"Key":"NEX-368"},{"ResolvedDate":1533904146000,"Key":"NEX-365"},{"ResolvedDate":1525944385000,"Key":"NEX-334"}],"bugCount":1,"sprintName":"Sprint 9 - 30 Apr to 11 May","LeadTimeInDays":182},{"VelocityOfSprint":458,"wipQueueLen":0,"CycleTimeInDays":464,"DeployedStories":[{"ResolvedDate":1527246744000,"Key":"NEX-466"},{"ResolvedDate":1527486338000,"Key":"NEX-458"},{"ResolvedDate":1527244766000,"Key":"NEX-457"},{"ResolvedDate":1528363733000,"Key":"NEX-455"},{"ResolvedDate":1526915843000,"Key":"NEX-452"},{"ResolvedDate":1528385056000,"Key":"NEX-451"},{"ResolvedDate":1526989213000,"Key":"NEX-450"},{"ResolvedDate":1526989225000,"Key":"NEX-449"},{"ResolvedDate":1527244775000,"Key":"NEX-448"},{"ResolvedDate":1526292117000,"Key":"NEX-447"},{"ResolvedDate":1527244785000,"Key":"NEX-446"},{"ResolvedDate":1527244792000,"Key":"NEX-445"},{"ResolvedDate":1527244800000,"Key":"NEX-444"},{"ResolvedDate":1528709516000,"Key":"NEX-441"},{"ResolvedDate":1538045683000,"Key":"NEX-440"},{"ResolvedDate":1527246940000,"Key":"NEX-429"},{"ResolvedDate":1527246569000,"Key":"NEX-425"},{"ResolvedDate":1527246424000,"Key":"NEX-421"},{"ResolvedDate":1527516331000,"Key":"NEX-388"},{"ResolvedDate":1526292131000,"Key":"NEX-370"}],"bugCount":6,"sprintName":"Sprint 10 - 14 May to 25 May","LeadTimeInDays":168},{"VelocityOfSprint":800,"wipQueueLen":0,"CycleTimeInDays":1366,"DeployedStories":[{"ResolvedDate":1528455892000,"Key":"NEX-521"},{"ResolvedDate":1529586112000,"Key":"NEX-489"},{"ResolvedDate":1528120093000,"Key":"NEX-485"},{"ResolvedDate":1528455920000,"Key":"NEX-484"},{"ResolvedDate":1528455929000,"Key":"NEX-483"},{"ResolvedDate":1529656078000,"Key":"NEX-482"},{"ResolvedDate":1529656089000,"Key":"NEX-481"},{"ResolvedDate":1529656098000,"Key":"NEX-480"},{"ResolvedDate":1528455983000,"Key":"NEX-479"},{"ResolvedDate":1534397339000,"Key":"NEX-463"},{"ResolvedDate":1528456003000,"Key":"NEX-462"},{"ResolvedDate":1529656103000,"Key":"NEX-461"},{"ResolvedDate":1534397089000,"Key":"NEX-460"},{"ResolvedDate":1534396712000,"Key":"NEX-459"},{"ResolvedDate":1528385108000,"Key":"NEX-453"},{"ResolvedDate":1538045694000,"Key":"NEX-442"},{"ResolvedDate":1528709516000,"Key":"NEX-441"},{"ResolvedDate":1538045683000,"Key":"NEX-440"},{"ResolvedDate":1528367362000,"Key":"NEX-439"},{"ResolvedDate":1529673527000,"Key":"NEX-387"},{"ResolvedDate":1526292161000,"Key":"NEX-379"},{"ResolvedDate":1526292169000,"Key":"NEX-378"},{"ResolvedDate":1526292175000,"Key":"NEX-377"},{"ResolvedDate":1526292182000,"Key":"NEX-375"},{"ResolvedDate":1534396674000,"Key":"NEX-374"},{"ResolvedDate":1534396686000,"Key":"NEX-373"},{"ResolvedDate":1533904146000,"Key":"NEX-365"}],"bugCount":3,"sprintName":"Sprint 11 - 28 May to 08 Jun","LeadTimeInDays":154},{"VelocityOfSprint":922,"wipQueueLen":0,"CycleTimeInDays":787,"DeployedStories":[{"ResolvedDate":1529657389000,"Key":"NEX-544"},{"ResolvedDate":1531474370000,"Key":"NEX-491"},{"ResolvedDate":1529586112000,"Key":"NEX-489"},{"ResolvedDate":1529673898000,"Key":"NEX-488"},{"ResolvedDate":1529656078000,"Key":"NEX-482"},{"ResolvedDate":1529656089000,"Key":"NEX-481"},{"ResolvedDate":1529656098000,"Key":"NEX-480"},{"ResolvedDate":1529323391000,"Key":"NEX-478"},{"ResolvedDate":1529656103000,"Key":"NEX-461"},{"ResolvedDate":1538045694000,"Key":"NEX-442"},{"ResolvedDate":1528709516000,"Key":"NEX-441"},{"ResolvedDate":1538045683000,"Key":"NEX-440"},{"ResolvedDate":1529673527000,"Key":"NEX-387"},{"ResolvedDate":1533904146000,"Key":"NEX-365"},{"ResolvedDate":1529656114000,"Key":"NEX-360"}],"bugCount":5,"sprintName":"Sprint 12 - 11 Jun to 22 Jun","LeadTimeInDays":140},{"VelocityOfSprint":1013,"wipQueueLen":0,"CycleTimeInDays":163,"DeployedStories":[{"ResolvedDate":1531205572000,"Key":"NEX-591"},{"ResolvedDate":1531205536000,"Key":"NEX-586"},{"ResolvedDate":1530191369000,"Key":"NEX-571"},{"ResolvedDate":1530191094000,"Key":"NEX-567"},{"ResolvedDate":1530190892000,"Key":"NEX-561"},{"ResolvedDate":1530852934000,"Key":"NEX-559"},{"ResolvedDate":1530858958000,"Key":"NEX-557"},{"ResolvedDate":1531147313000,"Key":"NEX-554"},{"ResolvedDate":1530283570000,"Key":"NEX-553"},{"ResolvedDate":1533210158000,"Key":"NEX-548"},{"ResolvedDate":1530853016000,"Key":"NEX-545"},{"ResolvedDate":1531893396000,"Key":"NEX-543"},{"ResolvedDate":1530871127000,"Key":"NEX-540"}],"bugCount":1,"sprintName":"Sprint 13 - 25 Jun to 06 Jul","LeadTimeInDays":126},{"VelocityOfSprint":1115,"wipQueueLen":0,"CycleTimeInDays":454,"DeployedStories":[{"ResolvedDate":1531719554000,"Key":"NEX-646"},{"ResolvedDate":1532432374000,"Key":"NEX-645"},{"ResolvedDate":1531716958000,"Key":"NEX-636"},{"ResolvedDate":1531831585000,"Key":"NEX-634"},{"ResolvedDate":1537791806000,"Key":"NEX-630"},{"ResolvedDate":1533550899000,"Key":"NEX-629"},{"ResolvedDate":1537792221000,"Key":"NEX-628"},{"ResolvedDate":1531893361000,"Key":"NEX-621"},{"ResolvedDate":1533210158000,"Key":"NEX-548"},{"ResolvedDate":1531893396000,"Key":"NEX-543"},{"ResolvedDate":1533209788000,"Key":"NEX-538"},{"ResolvedDate":1533209808000,"Key":"NEX-537"},{"ResolvedDate":1533209823000,"Key":"NEX-536"}],"bugCount":7,"sprintName":"Sprint 14 - 09 Jul to 20 Jul","LeadTimeInDays":112},{"VelocityOfSprint":1217,"wipQueueLen":5,"CycleTimeInDays":502,"DeployedStories":[{"ResolvedDate":1534761672000,"Key":"NEX-677"},{"ResolvedDate":1535360196000,"Key":"NEX-667"},{"ResolvedDate":1532432374000,"Key":"NEX-645"},{"ResolvedDate":1535360222000,"Key":"NEX-632"},{"ResolvedDate":1537791806000,"Key":"NEX-630"},{"ResolvedDate":1533550899000,"Key":"NEX-629"},{"ResolvedDate":1537792221000,"Key":"NEX-628"},{"ResolvedDate":1533210158000,"Key":"NEX-548"},{"ResolvedDate":1533209788000,"Key":"NEX-538"},{"ResolvedDate":1533209808000,"Key":"NEX-537"},{"ResolvedDate":1533209823000,"Key":"NEX-536"}],"bugCount":5,"sprintName":"Sprint 15 - 23 Jul to 03 Aug","LeadTimeInDays":98},{"VelocityOfSprint":1304,"wipQueueLen":9,"CycleTimeInDays":438,"DeployedStories":[{"ResolvedDate":1534767968000,"Key":"NEX-716"},{"ResolvedDate":1537169511000,"Key":"NEX-699"},{"ResolvedDate":1535963752000,"Key":"NEX-682"},{"ResolvedDate":1534761672000,"Key":"NEX-677"},{"ResolvedDate":1535360229000,"Key":"NEX-670"},{"ResolvedDate":1535360238000,"Key":"NEX-668"},{"ResolvedDate":1535360196000,"Key":"NEX-667"},{"ResolvedDate":1535360222000,"Key":"NEX-632"},{"ResolvedDate":1537791806000,"Key":"NEX-630"},{"ResolvedDate":1533550899000,"Key":"NEX-629"},{"ResolvedDate":1537792221000,"Key":"NEX-628"}],"bugCount":4,"sprintName":"Sprint 16 - 06 Aug to 17 Aug","LeadTimeInDays":84},{"VelocityOfSprint":1341,"wipQueueLen":13,"CycleTimeInDays":294,"DeployedStories":[{"ResolvedDate":1538125600000,"Key":"NEX-734"},{"ResolvedDate":1537169511000,"Key":"NEX-699"},{"ResolvedDate":1537791806000,"Key":"NEX-630"},{"ResolvedDate":1537792221000,"Key":"NEX-628"},{"ResolvedDate":1537773510000,"Key":"NEX-600"}],"bugCount":1,"sprintName":"Sprint 19 - 17 Sep to 28 Sep","LeadTimeInDays":42},{"VelocityOfSprint":1352,"wipQueueLen":17,"CycleTimeInDays":11,"DeployedStories":[{"ResolvedDate":1538985604000,"Key":"NEX-786"}],"bugCount":1,"sprintName":"Sprint 20 - 1 Oct to 12 Oct","LeadTimeInDays":28},{"VelocityOfSprint":1352,"wipQueueLen":25,"CycleTimeInDays":0,"DeployedStories":[],"bugCount":0,"sprintName":"Sprint 21 - 12 Oct to 26 Oct","LeadTimeInDays":17},{"VelocityOfSprint":1368,"wipQueueLen":34,"CycleTimeInDays":244,"DeployedStories":[{"ResolvedDate":1542618935000,"Key":"NEX-658"},{"ResolvedDate":1542618895000,"Key":"NEX-657"}],"bugCount":0,"sprintName":"Sprint 22 - 29 Oct to 9 Nov","LeadTimeInDays":22},{"VelocityOfSprint":1360,"wipQueueLen":33,"CycleTimeInDays":244,"DeployedStories":[{"ResolvedDate":1542618935000,"Key":"NEX-658"},{"ResolvedDate":1542618895000,"Key":"NEX-657"}],"bugCount":0,"sprintName":"Sprint 23 - 12 Nov to 23 Nov","LeadTimeInDays":8}];
		} else {
			var object1 = [{"VelocityOfSprint":0,"wipQueueLen":0,"CycleTimeInDays":274,"DeployedStories":[{"ResolvedDate":1522320257000,"Key":"PSSP-174"},{"ResolvedDate":1522320240000,"Key":"PSSP-173"},{"ResolvedDate":1522320221000,"Key":"PSSP-172"},{"ResolvedDate":1522320203000,"Key":"PSSP-171"},{"ResolvedDate":1522320072000,"Key":"PSSP-170"},{"ResolvedDate":1522320053000,"Key":"PSSP-169"},{"ResolvedDate":1522319942000,"Key":"PSSP-166"},{"ResolvedDate":1524485760000,"Key":"PSSP-150"},{"ResolvedDate":1521011997000,"Key":"PSSP-149"},{"ResolvedDate":1528702061000,"Key":"PSSP-148"},{"ResolvedDate":1521010299000,"Key":"PSSP-144"},{"ResolvedDate":1521010129000,"Key":"PSSP-143"},{"ResolvedDate":1520947688000,"Key":"PSSP-142"},{"ResolvedDate":1520947677000,"Key":"PSSP-141"},{"ResolvedDate":1520947666000,"Key":"PSSP-139"},{"ResolvedDate":1521085151000,"Key":"PSSP-102"},{"ResolvedDate":1521085100000,"Key":"PSSP-99"},{"ResolvedDate":1521084999000,"Key":"PSSP-93"},{"ResolvedDate":1521456746000,"Key":"PSSP-42"},{"ResolvedDate":1521006335000,"Key":"PSSP-17"},{"ResolvedDate":1521006322000,"Key":"PSSP-16"},{"ResolvedDate":1521006310000,"Key":"PSSP-13"},{"ResolvedDate":1521005777000,"Key":"PSSP-6"},{"ResolvedDate":1521006278000,"Key":"PSSP-5"}],"bugCount":2,"sprintName":"Sprint 5 - 1st Mar to 14th Mar","LeadTimeInDays":242},{"VelocityOfSprint":91,"wipQueueLen":1,"CycleTimeInDays":455,"DeployedStories":[{"ResolvedDate":1522235835000,"Key":"PSSP-244"},{"ResolvedDate":1521726278000,"Key":"PSSP-241"},{"ResolvedDate":1521726052000,"Key":"PSSP-235"},{"ResolvedDate":1522236848000,"Key":"PSSP-230"},{"ResolvedDate":1522236923000,"Key":"PSSP-227"},{"ResolvedDate":1522235952000,"Key":"PSSP-221"},{"ResolvedDate":1522316369000,"Key":"PSSP-203"},{"ResolvedDate":1521184373000,"Key":"PSSP-184"},{"ResolvedDate":1521184154000,"Key":"PSSP-183"},{"ResolvedDate":1521184059000,"Key":"PSSP-179"},{"ResolvedDate":1521183967000,"Key":"PSSP-178"},{"ResolvedDate":1522320280000,"Key":"PSSP-175"},{"ResolvedDate":1538045484000,"Key":"PSSP-157"},{"ResolvedDate":1522316133000,"Key":"PSSP-153"},{"ResolvedDate":1528702061000,"Key":"PSSP-148"},{"ResolvedDate":1521714570000,"Key":"PSSP-146"},{"ResolvedDate":1521714060000,"Key":"PSSP-145"},{"ResolvedDate":1521182688000,"Key":"PSSP-138"},{"ResolvedDate":1522316539000,"Key":"PSSP-137"},{"ResolvedDate":1522312648000,"Key":"PSSP-43"},{"ResolvedDate":1521802731000,"Key":"PSSP-21"},{"ResolvedDate":1521802964000,"Key":"PSSP-15"}],"bugCount":8,"sprintName":"Sprint 6 - 15 Mar to 28 Mar","LeadTimeInDays":228},{"VelocityOfSprint":108,"wipQueueLen":0,"CycleTimeInDays":530,"DeployedStories":[{"ResolvedDate":1523597919000,"Key":"PSSP-284"},{"ResolvedDate":1524920644000,"Key":"PSSP-265"},{"ResolvedDate":1523876802000,"Key":"PSSP-264"},{"ResolvedDate":1522320163000,"Key":"PSSP-263"},{"ResolvedDate":1522824480000,"Key":"PSSP-223"},{"ResolvedDate":1531206381000,"Key":"PSSP-218"},{"ResolvedDate":1531206178000,"Key":"PSSP-215"},{"ResolvedDate":1531205848000,"Key":"PSSP-214"},{"ResolvedDate":1531206313000,"Key":"PSSP-213"}],"bugCount":9,"sprintName":"Sprint 7 - 29 Mar to 14 Apr","LeadTimeInDays":214},{"VelocityOfSprint":194,"wipQueueLen":3,"CycleTimeInDays":325,"DeployedStories":[{"ResolvedDate":1525689079000,"Key":"PSSP-403"},{"ResolvedDate":1525689236000,"Key":"PSSP-399"},{"ResolvedDate":1524681238000,"Key":"PSSP-396"},{"ResolvedDate":1524681097000,"Key":"PSSP-392"},{"ResolvedDate":1524565018000,"Key":"PSSP-361"},{"ResolvedDate":1524920523000,"Key":"PSSP-351"},{"ResolvedDate":1524858358000,"Key":"PSSP-350"},{"ResolvedDate":1524920644000,"Key":"PSSP-265"},{"ResolvedDate":1523876802000,"Key":"PSSP-264"},{"ResolvedDate":1531736364000,"Key":"PSSP-200"},{"ResolvedDate":1525949097000,"Key":"PSSP-189"},{"ResolvedDate":1524564515000,"Key":"PSSP-161"}],"bugCount":9,"sprintName":"Sprint 8 - 13 Apr to 27 Apr","LeadTimeInDays":199},{"VelocityOfSprint":310,"wipQueueLen":0,"CycleTimeInDays":375,"DeployedStories":[{"ResolvedDate":1528367362000,"Key":"PSSP-439"},{"ResolvedDate":1525951317000,"Key":"PSSP-438"},{"ResolvedDate":1525854741000,"Key":"PSSP-437"},{"ResolvedDate":1525979125000,"Key":"PSSP-417"},{"ResolvedDate":1525979158000,"Key":"PSSP-413"},{"ResolvedDate":1525979243000,"Key":"PSSP-407"},{"ResolvedDate":1525689079000,"Key":"PSSP-403"},{"ResolvedDate":1525689236000,"Key":"PSSP-399"},{"ResolvedDate":1525955409000,"Key":"PSSP-390"},{"ResolvedDate":1529673527000,"Key":"PSSP-387"},{"ResolvedDate":1525944517000,"Key":"PSSP-371"},{"ResolvedDate":1525674775000,"Key":"PSSP-369"},{"ResolvedDate":1525674765000,"Key":"PSSP-368"},{"ResolvedDate":1533904146000,"Key":"PSSP-365"},{"ResolvedDate":1525944385000,"Key":"PSSP-334"}],"bugCount":1,"sprintName":"Sprint 9 - 30 Apr to 11 May","LeadTimeInDays":182},{"VelocityOfSprint":458,"wipQueueLen":0,"CycleTimeInDays":464,"DeployedStories":[{"ResolvedDate":1527246744000,"Key":"PSSP-466"},{"ResolvedDate":1527486338000,"Key":"PSSP-458"},{"ResolvedDate":1527244766000,"Key":"PSSP-457"},{"ResolvedDate":1528363733000,"Key":"PSSP-455"},{"ResolvedDate":1526915843000,"Key":"PSSP-452"},{"ResolvedDate":1528385056000,"Key":"PSSP-451"},{"ResolvedDate":1526989213000,"Key":"PSSP-450"},{"ResolvedDate":1526989225000,"Key":"PSSP-449"},{"ResolvedDate":1527244775000,"Key":"PSSP-448"},{"ResolvedDate":1526292117000,"Key":"PSSP-447"},{"ResolvedDate":1527244785000,"Key":"PSSP-446"},{"ResolvedDate":1527244792000,"Key":"PSSP-445"},{"ResolvedDate":1527244800000,"Key":"PSSP-444"},{"ResolvedDate":1528709516000,"Key":"PSSP-441"},{"ResolvedDate":1538045683000,"Key":"PSSP-440"},{"ResolvedDate":1527246940000,"Key":"PSSP-429"},{"ResolvedDate":1527246569000,"Key":"PSSP-425"},{"ResolvedDate":1527246424000,"Key":"PSSP-421"},{"ResolvedDate":1527516331000,"Key":"PSSP-388"},{"ResolvedDate":1526292131000,"Key":"PSSP-370"}],"bugCount":6,"sprintName":"Sprint 10 - 14 May to 25 May","LeadTimeInDays":168},{"VelocityOfSprint":800,"wipQueueLen":0,"CycleTimeInDays":1366,"DeployedStories":[{"ResolvedDate":1528455892000,"Key":"PSSP-521"},{"ResolvedDate":1529586112000,"Key":"PSSP-489"},{"ResolvedDate":1528120093000,"Key":"PSSP-485"},{"ResolvedDate":1528455920000,"Key":"PSSP-484"},{"ResolvedDate":1528455929000,"Key":"PSSP-483"},{"ResolvedDate":1529656078000,"Key":"PSSP-482"},{"ResolvedDate":1529656089000,"Key":"PSSP-481"},{"ResolvedDate":1529656098000,"Key":"PSSP-480"},{"ResolvedDate":1528455983000,"Key":"PSSP-479"},{"ResolvedDate":1534397339000,"Key":"PSSP-463"},{"ResolvedDate":1528456003000,"Key":"PSSP-462"},{"ResolvedDate":1529656103000,"Key":"PSSP-461"},{"ResolvedDate":1534397089000,"Key":"PSSP-460"},{"ResolvedDate":1534396712000,"Key":"PSSP-459"},{"ResolvedDate":1528385108000,"Key":"PSSP-453"},{"ResolvedDate":1538045694000,"Key":"PSSP-442"},{"ResolvedDate":1528709516000,"Key":"PSSP-441"},{"ResolvedDate":1538045683000,"Key":"PSSP-440"},{"ResolvedDate":1528367362000,"Key":"PSSP-439"},{"ResolvedDate":1529673527000,"Key":"PSSP-387"},{"ResolvedDate":1526292161000,"Key":"PSSP-379"},{"ResolvedDate":1526292169000,"Key":"PSSP-378"},{"ResolvedDate":1526292175000,"Key":"PSSP-377"},{"ResolvedDate":1526292182000,"Key":"PSSP-375"},{"ResolvedDate":1534396674000,"Key":"PSSP-374"},{"ResolvedDate":1534396686000,"Key":"PSSP-373"},{"ResolvedDate":1533904146000,"Key":"PSSP-365"}],"bugCount":3,"sprintName":"Sprint 11 - 28 May to 08 Jun","LeadTimeInDays":154},{"VelocityOfSprint":922,"wipQueueLen":0,"CycleTimeInDays":787,"DeployedStories":[{"ResolvedDate":1529657389000,"Key":"PSSP-544"},{"ResolvedDate":1531474370000,"Key":"PSSP-491"},{"ResolvedDate":1529586112000,"Key":"PSSP-489"},{"ResolvedDate":1529673898000,"Key":"PSSP-488"},{"ResolvedDate":1529656078000,"Key":"PSSP-482"},{"ResolvedDate":1529656089000,"Key":"PSSP-481"},{"ResolvedDate":1529656098000,"Key":"PSSP-480"},{"ResolvedDate":1529323391000,"Key":"PSSP-478"},{"ResolvedDate":1529656103000,"Key":"PSSP-461"},{"ResolvedDate":1538045694000,"Key":"PSSP-442"},{"ResolvedDate":1528709516000,"Key":"PSSP-441"},{"ResolvedDate":1538045683000,"Key":"PSSP-440"},{"ResolvedDate":1529673527000,"Key":"PSSP-387"},{"ResolvedDate":1533904146000,"Key":"PSSP-365"},{"ResolvedDate":1529656114000,"Key":"PSSP-360"}],"bugCount":5,"sprintName":"Sprint 12 - 11 Jun to 22 Jun","LeadTimeInDays":140},{"VelocityOfSprint":1013,"wipQueueLen":0,"CycleTimeInDays":163,"DeployedStories":[{"ResolvedDate":1531205572000,"Key":"PSSP-591"},{"ResolvedDate":1531205536000,"Key":"PSSP-586"},{"ResolvedDate":1530191369000,"Key":"PSSP-571"},{"ResolvedDate":1530191094000,"Key":"PSSP-567"},{"ResolvedDate":1530190892000,"Key":"PSSP-561"},{"ResolvedDate":1530852934000,"Key":"PSSP-559"},{"ResolvedDate":1530858958000,"Key":"PSSP-557"},{"ResolvedDate":1531147313000,"Key":"PSSP-554"},{"ResolvedDate":1530283570000,"Key":"PSSP-553"},{"ResolvedDate":1533210158000,"Key":"PSSP-548"},{"ResolvedDate":1530853016000,"Key":"PSSP-545"},{"ResolvedDate":1531893396000,"Key":"PSSP-543"},{"ResolvedDate":1530871127000,"Key":"PSSP-540"}],"bugCount":1,"sprintName":"Sprint 13 - 25 Jun to 06 Jul","LeadTimeInDays":126},{"VelocityOfSprint":1115,"wipQueueLen":0,"CycleTimeInDays":454,"DeployedStories":[{"ResolvedDate":1531719554000,"Key":"PSSP-646"},{"ResolvedDate":1532432374000,"Key":"PSSP-645"},{"ResolvedDate":1531716958000,"Key":"PSSP-636"},{"ResolvedDate":1531831585000,"Key":"PSSP-634"},{"ResolvedDate":1537791806000,"Key":"PSSP-630"},{"ResolvedDate":1533550899000,"Key":"PSSP-629"},{"ResolvedDate":1537792221000,"Key":"PSSP-628"},{"ResolvedDate":1531893361000,"Key":"PSSP-621"},{"ResolvedDate":1533210158000,"Key":"PSSP-548"},{"ResolvedDate":1531893396000,"Key":"PSSP-543"},{"ResolvedDate":1533209788000,"Key":"PSSP-538"},{"ResolvedDate":1533209808000,"Key":"PSSP-537"},{"ResolvedDate":1533209823000,"Key":"PSSP-536"}],"bugCount":7,"sprintName":"Sprint 14 - 09 Jul to 20 Jul","LeadTimeInDays":112},{"VelocityOfSprint":1217,"wipQueueLen":5,"CycleTimeInDays":502,"DeployedStories":[{"ResolvedDate":1534761672000,"Key":"PSSP-677"},{"ResolvedDate":1535360196000,"Key":"PSSP-667"},{"ResolvedDate":1532432374000,"Key":"PSSP-645"},{"ResolvedDate":1535360222000,"Key":"PSSP-632"},{"ResolvedDate":1537791806000,"Key":"PSSP-630"},{"ResolvedDate":1533550899000,"Key":"PSSP-629"},{"ResolvedDate":1537792221000,"Key":"PSSP-628"},{"ResolvedDate":1533210158000,"Key":"PSSP-548"},{"ResolvedDate":1533209788000,"Key":"PSSP-538"},{"ResolvedDate":1533209808000,"Key":"PSSP-537"},{"ResolvedDate":1533209823000,"Key":"PSSP-536"}],"bugCount":5,"sprintName":"Sprint 15 - 23 Jul to 03 Aug","LeadTimeInDays":98}];
		}
		res.send(object1);
	})
});

router.get('/gettechnicaldebtpersprint/:product_id',function(req, res, next){
	var data = _model.getLatestClosedSprint(req.params.product_id);
	data
	.then(function(object){
		var lastestclosedsprint = [];
		for(var i=(object.length-1); i>=0; i--){
			if(lastestclosedsprint.length==0 && object[i].state=="closed")
			lastestclosedsprint.push(object[i]);
		}
		return({"sprintid":lastestclosedsprint[0].id})
	})
	.then(function(object){
		var sprintid = object.sprintid;
		var technical_debtval = _model.gettdebtvalue(sprintid);
		return technical_debtval;
	})
	.then(function(object){
		res.send(object.attribute_value);
	})
});


router.get('/gettotalefforts/:product_id',function(req, res, next){
	var data = _model.getLatestClosedSprint(req.params.product_id);
	data
	.then(function(object){
		var lastestclosedsprint = [];
		for(var i=(object.length-1); i>=0; i--){
			if(lastestclosedsprint.length==0 && object[i].state=="closed")
			lastestclosedsprint.push(object[i]);
		}
		return({"sprintid":lastestclosedsprint[0].id})
	})
	.then(function(object){
		var sprintid = object.sprintid;
		var geteffortsvalue = _model.geteffortsvalue(sprintid);
		return geteffortsvalue;
	})
	.then(function(object){
		res.send(object.attribute_value);
	})
});



router.get('/inserttechnicaldebt',function(req, res, next){
	var technicaldetails = _model.gettechnicaldebt(req.query.jiraStoryKey);
	technicaldetails
	.then(function(object1){
		var object = JSON.parse(object1);
		return object;
	})
	.then(function(object){
		//insert to Cassandra
		return _model.inserttechdebt(object);
	})
	.then(function(object){
		if(object == "done"){
			res.send({"status":"done"});
		}
	})
	.catch(function (error) {
		// console.log(error);
	});
});

// Transfer data to Cassandra
router.get('/transaferproductdata',function(req, res, next){
	var productrec = _model.getproductdatafrommongo();
	productrec
	.then(function(object){
		_model.insertprointocassandra(object,function(result){
		});
	})
});



router.get('/getOrganization',function(req, res, next){
	var or = _model.getOrganization();
	or
	.then((object)=>{
		res.send(object);
	})
});

router.get('/getuserstypes', (req, res, next)=>{
	var designations = _model.getDesignations();
	designations
	.then((object)=>{
		res.send(object);
	})
});

router.get('/getVelocitData/:product_id',function(req, res, next){

	var sprintD = _model.getSprintRecord(req.params.product_id);
	sprintD
	.then(function(object){
		return JSON.parse(object[0].sprintjson).values;
	})
	.then(function(sprintdata){
		return _model.getactiveclosedonly(sprintdata);
	})
	.then(function(object){
		return _model.calculateaverageofclosedsprints(object);
	})
	.then(function(object){
		res.send(object);
	})
	.catch(function (error) {
		// console.log(error);
	});
});

router.get('/logincheck/:username/:password/:organization',function(req, res, next){
	var query = "select users.id as id, name, users.username as username, users.organization as organization_id, organizations.organization_name as organization_name from users inner JOIN organizations on organizations.id = users.organization where users.username = ? AND users.password = ?";
	con.query(query, [req.params.username, req.params.password], function(err, result) {
		console.log(result);
		if(err) console.log("error");
		if(result.length>0){
			var finalresult = {"userid":result[0].id, "name":result[0].name, "username":result[0].username, "organization_id":result[0].organization_id, "organization_name":result[0].organization_name};
			console.log(finalresult);
			res.send(finalresult);
		} else {
			res.send({"status":false,"message":"user not found","code":401});
		}
	});
});

router.get('/getProductName/:productid',function(req, res, next){
	var query = "select * from project where id = ?";
	con.query(query, [req.params.productid], function(err, result) {
		res.send(result);
	});
});

router.get('/getallProductbyorganization_id/:organizationid',function(req, res, next){
	var query = "select * from project";
	con.query(query, function(err, result) {
		res.send(result);
	});
});

router.get('/getProductEntitiesByProductId/:productid',function(req, res, next){
	var query = "select * from technical_debt where product_id = ?";
	con.query(query, [req.params.productid], function(err, result) {
		res.send(result);
	});
});

router.get('/getDataDashboard/:organization_id',function(req, res, next){
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("stp_db");
		//var allproducts = [];
		var queryor = { "organization_id":req.params.organization_id };
		dbo.collection('products').aggregate([
			{ $match : queryor },
			{ $lookup:
			   {
				 from: "products_entities",
				 localField: "_id",
				 foreignField: "product_id",
				 as: 'orderdetails'
			   }
			},
			{ "$unwind": "$orderdetails" },
			{ "$sort": {"_id": -1 } },
			{ "$limit": 5 }
			]).toArray(function(err, result) {
			if (err) throw err;
				//res.send(result);
				res.send({});
				db.close();
			});
	});
});

router.get('/getJIRADATA/:url',function(req, res, next){
	res.send({"data":"data"});
});


router.get('/getTotalRecordsCount',function(req, res, next){
	//var query = "select * from project";
	var query = "select * from project where paging > 80 limit 5";
	con.query(query, function(err, result) {
		console.log("count:"+result.length);
		res.send({"count":result.length});
	});
});


router.get('/getTotalSearchRecordsCount/:searchProject',function(req, res, next){
	//var query = "select * from project where project_name like '%" + req.params.searchProject + "%'";
	var query = "select * from project where project_name like '%" + req.params.searchProject + "%' and paging > 80 AND paging <83 limit 5";
	con.query(query, function(err, result) {
		res.send({"count":result.length});
	});
});


router.get('/calculateleadtimeandvelocity/:prod_id', function(req,res,next){
	var getrecords = _model.getProductKey(req.params.prod_id);
	getrecords
	.then(function(object){
		return object[0].productkey;
	})
	.then(function(object){
		return _model.getSprintDataforsinglePro(object);
	})
	.then(function(object){
		res.send();
	})
	.catch(function (error) {
	});
});

router.get('/getRecordsPage/:page',function(req,res,next){
	var getrecords = _model.getRecordFromProducts(req.params.page);
	// console.log(getrecords);
	getrecords
	.then(function(result) {
		// console.log(result);
		if(result.length == 0){ 
			// console.log("result1");
			res.send({"status":false, "statuscode":404, "message":"No data found."});
		} else {
			getallwithlead(result,function(data){
				// console.log("result2");
				// console.log(data);
				res.send({"status":true, "statuscode":200, "message":data});
			});
		}
	})
	.catch(function(error) {
		console.log(error);
	});
});

router.get('/getSearchRecordsPage/:page/:searchProject',function(req,res,next){
	var getrecords = _model.getSearchRecordFromProducts(req.params.page, req.params.searchProject);
	// console.log(getrecords);
	getrecords
	.then(function(result) {
		if(result.length == 0){ 
			res.send({"status":false, "statuscode":404, "message":"No data found."});
		} else {
			getallwithlead(result,function(data){
				res.send({"status":true, "statuscode":200, "message":data});
			});
		}
	})
	.catch(function(error) {
		// console.log(error);
	});
});

function getallwithlead(result,callback1){
	
	var allproductswithlead = [];
	var allproductswithleadVelocity = [];
	async.forEach(Object.keys(result), function (item, callback){ 
		_model.getLeadTimeCalculated(result[item],function(data){
			if(data.status) {
				allproductswithlead.push(data);
				//getTechnicalDebtRelatedData(result[item], (technicaldebtdata)=>{
					getDeploymentData(result[item], (deloymentdata)=>{
						_model.getTbCalculated(result[item], function(datafinal){
							allproductswithleadVelocity.push({"technicaldebt":datafinal, "velocityLeadTime":data, "productinfo":result[item], "deploymentData":deloymentdata, /*"technicaldebtdata":technicaldebtdata*/});
							callback(); 
						});
					});
				//});
			} else {
				allproductswithleadVelocity.push({"technicaldebt":{"currentTd":0, "AvgTd":0, "colorTd": 0}, "velocityLeadTime":[], "productinfo":result[item], "deploymentData":[], "technicaldebtdata":[]});
				callback(); 
			}
		});
	}, function() {
		// console.log(allproductswithleadVelocity);
		callback1(allproductswithleadVelocity);
	});
}

function getTechnicalDebtRelatedData(product, cb){
	var pr = _model.getallaboutproject(product.id);
	pr
	.then(function(object){
		var project_key = object[0].project_key;
		return(project_key);
	})
	.then(function(object){
		//get technical_debt record
		return _model.gettechnical_debt(object);
	})
	.then(function(object){
		// console.log('getTech');
		// console.log(object);
		_model.getColorCoding(object,(response)=> {
			if(object.length>0 && object[0].state=="closed"){
				cb ({"effort":(parseInt(object[0].effort)/60).toFixed(2), "inserted_ts":object[0].inserted_ts, "id":object[0].id, "loc":object[0].loc, "delta_loc":object[0].delta_loc, "project_key":object[0].project_key, "sprint_name":object[0].sonar_project_name, "sprint_id":object[0].sprint_id, "voilation":object[0].violation, "colorEffort":response.colorEffort, "colorDeltaLoc":response.colorDeltaLoc, "colorTd": response.colorTB, "allobject":object});
			} else {
				cb({});
			}
		});
	})
}

function getDeploymentData(product, cb){
	var pr = _model.getallaboutproject(product.id);
	pr
	.then(function(object){
		return object[0].project_key;
	})
	.then(function(object){
		_model.getAllsprints(object, function(data){
			if(data.length==0){
				res.send([]);
			} else {
			var latesclosedsprint = data[0];
			//now getting the deployment of sprint
			pr1 = _model.getDeploymentData(latesclosedsprint.id);
			pr1
			.then(function(object){
				return(object);
			})
			.then(function(object){
				// get failure and success deployment and all count 
				var i = 1;
				var successde = [];
				var failurede = [];
				var duration = [];
				async.forEach(object, function (item, callback){ 
					duration.push(parseInt(item['duration']));
					if(item['status']=="SUCCESS") {
						successde.push(item);
					} else if(item['status']=="FAILURE"){
						failurede.push(item);
					}
					if(i==object.length){
						var sum = duration.reduce((a, b) => a + b, 0);
						var avgduration = sum/duration.length;
						cb({"successde":successde, "failurede":failurede, "totalde": object.length, "duration":avgduration});
					}
					i++;
				}, function() {
					cb(object);
				});
			})
			}
		});
	});
}

router.get('/getCountries',function(req, res, next){
	var query = "select * from countries";
	con.query(query, function(err, result) {
		if(err) throw err;
		res.send(result);
	});
});

router.get('/saveinMongo',function(req, res, next){
	request.get('http://172.17.234.162:8090/getAllJiraProjects', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db("stp_db");
				dbo.collection('products').remove({});
				
			});
			var result = JSON.parse((JSON.parse(body).Result));

			async.forEach(Object.keys(result), function (item, callback){ 
				var r = JSON.parse(result[item]);
				// console.log.log(r.projectName);
				MongoClient.connect(url, function(err, db) {
					var dbo = db.db("stp_db");
					// console.log.log("r.projectName = "+r.projectName);
					dbo.collection("products").insert({
					   organization_id: '5ab4983a2f7447272033183b', 
					   product_name: r.projectName
					})
				});	
				callback(); 
			}, function() {
				// console.log('finished');
			});
			
			res.send(result);
		} else if (error) {
			throw error;
		}
	});
});


router.post('/posts',function(req, res, next){
	res.send({"data":"post"});
});

router.post('/user_signup',function(req, res, next){
	var initializePromise = _model.checkforemailexist(req.body.email);
    initializePromise
	.then(function(result) {
        return result;
    })
	.then(function(object){
		if(object==0){
			var insertres = _model.insertintousers(req.body);
			// return insertres;
			res.send({"status":true, "message":"user submitted", "email":email});
		} else {
			var email = req.body.email;
			res.send({"status":true, "message":"user_already_exist", "email":email});
		}
	})
	.then(function(object){
		if(object=="entered"){
			var ne = _model.insertDefaultMenusSelectionForUser(req.body.email);
			ne
			.then((object)=>{
				return object; //user detail
				//res.send({"status":true, "message":"user submitted", "email":req.body.email});
			})
			.then((object)=>{
				var userid = object[0].id;
				return _model.insertintoUserMenus(userid);
			})
			.then((object)=>{
				res.send({"status":true, "message":"user_submitted", "email":req.body.email});
			})
		} else {
			res.send({"status":false, "message":"something_went_wrong", "email":""});
		}
	})
	.catch(function (error) {
		// console.log(error)
	})
});

router.post('/insert_fakeform',function(req, res, next){
	var initializePromise = _model.deletedatafaketable(req.body);
	initializePromise
	.then(function(object){
		var res = _model.insertdatafaketable(object);
		return res;
	})
	.then(function(object){
		res.json({"data":object});
	})
	.catch(function (error) {
	  // console.log(error)
	})
});

router.get('/get_fakeform',function(req, res, next){
	var query = "select * from faketable";
	con.query(query, function(err, result) {
		if(err) throw err;
		res.send(result);
	});
});

router.get('/getSprintData', function(req, res, next){
	var data = _model.getSprintData('https://Katamreddy.Tejaswini:Crosstheline@15@tracs.corp.mphasis.com/rest/agile/1.0/board/101/sprint');
	data
	.then(function(result){
		res.json(result);
	})
});

/*
router.get('/getJiraProjects', function(req, res, next){
	var data = _model.getJiraProjectData('https://siddharth.mishra1:Sid1@345678@tracs.corp.mphasis.com/rest/api/2/search?jql=project%20is%20not%20empty+&startAt=0&maxResults=1');
	data
	.then(function(result){
		res.json(result);
	})
});
*/
router.get('/insertsprintentities', function(){
	var getse = _model.getsprintEntitiesDataFromMongo();
	getse
	.then(function(object){
		_model.insertintocassandrase(object);
	})
	.then(function(object){
		// console.log(object);
	})
	.catch(function (error) {
	  // console.log(error)
	})
});

/************* External URLS *********************/
router.get('/getAllJiraProject',function(req,res,next){
	var projects = _model.getAllJiraProject();
	projects
	.then(function(object){
		var i = 1;
		var arr = JSON.parse(object);
		async.forEach(arr, function (item, callback){ 
			_model.insertintodatabaseinproducts(item, i);
			i++;
			callback();
		}, function() {
			res.send({"status":"finished"});
		});
	})
	.catch(function (error) {
	  // console.log(error)
	})
});

router.get('/insertsprintdata', function(req,res,next){
	log.info("reached");
	var projects = _model.getAllJiraProjectFromCassandra();
	projects
	.then(function(object){
		return (object);
	})
	.then(function(object){
		var arr = object;
		var i = 0;
		var faser = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
		async.forEach(arr, function (item, callback){
			if(i>9){
				i=0;
			}
			_model.getSprintdataF(item.productkey, function(err){
				if(err==""){
					log.info("no output");
				} else {
					var result = JSON.parse(err);
					var sprintJSON = JSON.parse(result[0].sprintJSON);
					_model.insertsprintintocassandra(sprintJSON, faser[i], item.productkey, function(inres){
					});
				}
			});
			i++;
		}, function() {
			res.send({"status":"finished"});
		});
	})
	.catch(function (error) {
	  // console.log(error)
	})
});


router.get('/deployment_environment/:product_id', function(req, res, next){
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		return object[0].project_key;
	})
	.then(function(object){
		_model.getAllsprints(object, function(data){
			var latesclosedsprint = data[0];
			//now getting the deployment of sprint
			pr1 = _model.getDeploymentData(latesclosedsprint.id);
			pr1
			.then(function(object){
				return(object);
			})
			.then(function(object){
				res.send(object);
			});
		});
	})
});

router.get('/downloadCSV/:product_id/:text', function(req, res, next){
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		return object[0].project_key;
	})
	.then(function(object){ //get last sprint
		if(req.params.text=="0") { //all sprint
			return _model.getAllsprintsForCSV(object,'all');
		}
		if(req.params.text=="1") { //Latest closed sprint
			return _model.getAllsprintsForCSV(object,'latest');
		}
		if(req.params.text=="2") { //Active sprint
			return _model.getAllsprintsForCSV(object,'active');
		}
	})
	.then(function(object){ //get technical debt
		var allwith = [];
		async.forEach(object, function (item, callback){ 
			_model.getTechnicalDebtForCSV(item.sprint_id, function(dataTD1){
				var dataTD = dataTD1[0];
				allwith.push({"sprint_name":item.sprint_name, "delta_loc":(dataTD.delta_loc==null) ? "" : dataTD.delta_loc, "effort":(dataTD.effort==null) ? "" : dataTD.effort, "loc":(dataTD.loc==null) ? "" : dataTD.loc, "tfs_branch":(dataTD.tfs_branch==null) ? '' : dataTD.tfs_branch, "violation":(dataTD.violation==null) ? "" : dataTD.violation, "bug_count":(item.bug_count==null) ? "" : item.bug_count, "complete_date":(item.complete_date==null) ? "" : item.complete_date, "cycle_time":(item.cycle_time==null) ? "" : item.cycle_time, "end_date":(item.end_date==null) ? "" : item.end_date, "lead_time":(item.lead_time==null) ? "" : item.lead_time, "start_date":(item.start_date==null) ? "" : item.start_date, "state":(item.state==null) ? "" : item.state, "velocity":(item.velocity==null) ? "" : item.velocity, "wip_count":(item.wip_count==null) ? "" : item.wip_count});
				callback();
			});
		}, function() {
			res.send(allwith);
		});
	})
});

/* Velocity Color Coding */
router.get('/getVelocityColorCoding/:product_id', function(req, res, next){
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		_model.getLeadTimeCalculated(object[0], (data)=>{
			// console.log("getLeadTimeCalculated");
			res.send(data);
		});
	});
});

/* Technical Debt Color Coding */
router.get('/getTBColorCoding/:product_id', function(req, res, next){
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then(function(object){
		_model.getTbCalculated(object[0], (data)=>{
			res.send(data);
		});
	});
});

router.get('/getPersons/:product_id', (req, res, next)=>{
	var pr = _model.getallaboutproject(req.params.product_id);
	pr
	.then((object)=>{
		return _model.getPersonsOfProject(object[0].project_key);
	})
	.then((object)=>{
		res.send(object);
	})
});

router.get('/mailsend/:project_id/:name/:email', (req, res, next)=>{
	var projectdet;
	var pr = _model.getallaboutproject(req.params.project_id);
	pr
	.then((object)=>{
		// console.log(object[0]);
		projectdet = object;
		return object[0].project_key;
	})
	.then((object)=>{
		return _model.getAllsprintsForCSV(object,'all');
	})
	.then(function(object){ //get technical debt
		var allwith = [];
		async.forEach(object, function (item, callback){ 
			_model.getTechnicalDebtForCSV(item.sprint_id, function(dataTD1){
				var dataTD = dataTD1[0];
				allwith.push({"sprint_name":item.sprint_name, "delta_loc":(dataTD.delta_loc==null) ? "" : dataTD.delta_loc, "effort":(dataTD.effort==null) ? "" : dataTD.effort, "loc":(dataTD.loc==null) ? "" : dataTD.loc, "tfs_branch":(dataTD.tfs_branch==null) ? '' : dataTD.tfs_branch, "violation":(dataTD.violation==null) ? "" : dataTD.violation, "bug_count":(item.bug_count==null) ? "" : item.bug_count, "complete_date":(item.complete_date==null) ? "" : item.complete_date, "cycle_time":(item.cycle_time==null) ? "" : item.cycle_time, "end_date":(item.end_date==null) ? "" : item.end_date, "lead_time":(item.lead_time==null) ? "" : item.lead_time, "start_date":(item.start_date==null) ? "" : item.start_date, "state":(item.state==null) ? "" : item.state, "velocity":(item.velocity==null) ? "" : item.velocity, "wip_count":(item.wip_count==null) ? "" : item.wip_count});
				callback();
			});
		}, function() {
			var documents = 
			{	
				AllSprint: allwith
			};
			// console.log(projectdet);
			var filename = object[0].project_key+'_'+moment().format("YYYYMMDDhhmmss")+'.zip';
			csv_export.export(documents,function(buffer){
				// console.log('./csv_export/'+filename);
				fs.writeFileSync('./csv_export/'+filename,buffer);
			});
			console.log(req.params.email);
			var attachments = [{ filename: filename, path: './csv_export/'+filename, contentType: 'application/zip' }];
			var options = {
				//to: req.params.email,
				to: 'chetan.c01@mphasis.com',
				//subject: (projectdet[0].project_name).trim()+' - '+allwith[0].sprint_name,
				subject: (projectdet[0].project_name).trim() + ' - DevOps Analyzer',
				message: 'All Sprints Details. PFA.',
				attachments: attachments
			}

			var mail = new Mail({
				to: options.to,
				subject: options.subject,
				message: options.message,
				attachments: options.attachments,
				successCallback: function(suc) {
					res.send({"status":"success"});
				},
				errorCallback: function(err) {
					// console.log('error: ' + err);
					res.send({"status":"err", "text":err});
				}
			});			
			mail.send();
			//res.send(allwith);
		});
	})
	
});

router.get('/getMenus/:userid', (req, res, next)=>{
	var allmenu = _model.getAllMenus();
	allmenu
	.then((object)=>{
		res.send(object);
	})
});

router.get('/getUserSelectedMenus/:userid', (req, res, next)=>{
	var allmenu = _model.getMenus(req.params.userid);
	allmenu
	.then((object)=>{
		res.send(object);
	})
});

router.get('/assignMenus/:value/:checkstatus/:userid', (req, res, next)=>{
	var cs;
	if(req.params.checkstatus=="true")
		cs = 'true';
	else
		cs = 'false';
	var assignva = _model.assignMenus([req.params.value,cs,req.params.userid,moment().valueOf()]);
	assignva
	.then((object)=>{
		res.send({"ans":object});
	});
});

router.get('/getCountMenus/:userid', (req, res, next)=>{
	var count = _model.getCountMenus(req.params.userid);
	count
	.then((object)=>{
		res.send(object);
	})
});

router.post('/changepassword', (req, res, next)=>{
	var psw = req.body.userinfo.psw;
	//var npsw = req.body.userinfo.npsw;
	var cnpsw = req.body.userinfo.cnpsw;
	var userid = req.body.userid;
	var ini = _model.confirmpassword(psw,userid);
	ini
	.then((object)=>{
		var userdetails = object;
		var passwordfromDB = userdetails[0].password;
		if(passwordfromDB == psw){
			var ne = _model.changePassword(cnpsw,userid);
			ne
			.then((object)=>{
				var attachments = [];
				var options = {
				//to: userdetails[0].username,
				to: 'chetan.c01@mphasis.com',
				subject: "Password Changed Successfully",
				message: '<html><head></head><body>'+'<div>Hi '+userdetails[0].name+',</div><br />'+
					'<div>You have successfully changed password.</div><br /><br />'+
					'<div>Email : <span>'+userdetails[0].username+'</span></div>'+
					'<div>Password : <span>'+req.body.userinfo.npsw+'</span></div><br /><br />'+
					'<div>Regards,<br>DevOps Team</div>'+
					'</body></html>',
				attachments: attachments
				}

				var mail = new Mail({
					to: options.to,
					subject: options.subject,
					message: options.message,
					attachments: options.attachments,
					successCallback: function(suc) {
						res.send({"status":true, "Message":"PASSWORD_CHANGED"});
					},
					errorCallback: function(err) {
						// console.log('error: ' + err);
						res.send({"status":"err", "text":err});
					}
				});			
				mail.send();
			})
		} else {
			res.send({"status":false, "Message":"PASSWORD_NOT_MATCHED"});
		}
	})
	.then((object)=>{
		if(object){
			//change new password
			return _model.changePassword(cnpsw,userid);
		}
	})
	.catch((err) => {
	  // console.log({"status":"something_went_wrong", "error":err});
	});

});

router.post('/deleteAccount', (req, res, next)=>{
	var psw = req.body.userinfo.pswda;
	var userid = req.body.userid;
	var ini = _model.confirmpassword(psw,userid);
	ini
	.then((object)=>{
		var userdetails = object;
		var passwordfromDB = userdetails[0].password;
		if(passwordfromDB == psw){
			var query = "delete from users where id ='" + userid  + "'";
			con.query(query, function(err, result) {
				if (err) {
					res.send({"status":false, "Message":"Account could not be deleted"});
				} else {
					res.send({"status":true, "Message":"ACCOUNT DELETED"});
				}
			});
		} else {
			res.send({"status":false, "Message":"Password did not match"});
		}
	});
});

router.post('/saveConfigurationUser', (req, res, next)=>{
	var len = (req.body.elements).length;
	var i = 1;
	var ini = _model.deleteUserConfiguration(req.body.userid);
	ini
	.then((object)=>{
			async.forEach(req.body.elements, function (item, callback){ 
			_model.updateUserConfiguration(item, req.body.userid, (data)=>{
				// console.log("sgjhasgkjhdasjk = "+data);
			});
			if(i==len){
				res.send({"success":true, "Message":"ACCOUNT_UPDATED"});
			}
			i++;
			callback();
		});
	})
});

router.post('/saveConfigurationUserNew', (req, res, next)=>{
	var ini = _model.deleteUserConfiguration(req.body.id);
	ini
	.then((object)=>{		
		_model.updateUserConfiguration(req.body.configId, req.body.userid, (data)=>{
			res.send({"success":true, "Message":"ACCOUNT_UPDATED", "id": data});
		});

	})
});

router.get('/showConfiguration/:userid', (req, res, next)=>{
	//var userid = req.params.userid;
	var ini = _model.getServiceName();
	ini
	.then((object)=>{
		var finalarray = [];
		async.forEach(object, function (item, callback){ 
			// console.log(item.name);
			var internalArr = [];
			internalArr.push({"tbl_configuration_name_pk":item.id, "name":item.name});
			_model.getconfigurationOptions(item.id, (data)=>{
				internalArr.push(data);
				finalarray.push(internalArr);
				callback();
			});
		}, function(){
			res.send(finalarray);
		});
	})
});

router.get('/showConfigurationForUsers/:userid', (req, res, next)=>{
	var ini = _model.getUsersConfigurations(req.params.userid);
	ini
	.then((object)=>{
		return (object);
	})
	.then((object)=>{
		res.send(object);
		/*var finalarray = [];
		var len = object.length;
		// console.log("len = "+len);
		var i = 1;
		async.forEach(object, function (item, callback){ 
			// console.log(item.tbl_configuration_options_id);
			finalarray.push(item.tbl_configuration_options_id);
			// console.log(i);
			if(i==len){
				res.send(finalarray);
			}
			i++;
		});*/
	})
});

router.get('/getUserMenus/:userid', (req, res, next)=>{
	var pr = _model.getUserMenus(req.params.userid);
	pr
	.then((object)=>{
		res.send(object);
	})
});

router.get('/getProjectList/:organization_name', (req, res, next)=>{
	var pr = _model.getProjectList(req.params.organization_name);
	pr
	.then((object)=>{
		res.send({"projectList":object});
	})
});

router.get('/getProjectSprintsName/:projectKey', (req, res, next)=>{
	var pr = _model.getAllsprintByPKEY(req.params.projectKey);
	pr
	.then((object)=>{
		res.send({"sprintList":object});
	})
});

router.get('/getFormEntries/:sprint_id/:project_key', (req, res, next)=>{
	var pr = _model.getFormEntries(req.params.project_key, req.params.sprint_id);
	pr
	.then((object)=>{
		return object;
	})
	.then((formentries)=>{
		//get project Name
		_model.getProjectName(req.params.project_key, (data)=>{
			res.send({"formentries":formentries, "data":data});
		});
	})
});

router.post('/savepipeline', (req, res, next)=>{
	_model.savePipeLine(req.body, (data)=>{
		if(data==true){
			res.send({"result":"done"});
		} else {
			res.send({"result":"wait"});
		}
	});
});

router.get('/getGithubRespository', (req, res, next)=>{
	_model.githubRepository((data)=>{
		res.send(data);
	});
});

module.exports = router;
