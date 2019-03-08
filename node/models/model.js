var express = require('express');
var router = express.Router();
//var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://test:test@172.16.159.13:27017/stp_db";
var config = require('dotenv').config();
var request = require("request");
const rp = require('request-promise');
var moment = require('moment');
//const cassandra = require('cassandra-driver');
const TimeUuid = require('cassandra-driver').types.TimeUuid;
// var authProvider = new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USER, process.env.CASSANDRA_PASS);
// const client = new cassandra.Client({ contactPoints: [process.env.CASSANDRA_IP], authProvider: authProvider, keyspace: process.env.KEYSPACE});
var async = require('async');
const log = require('simple-node-logger').createSimpleLogger('project.log');
var _ = require('underscore');
var generateSafeId = require('generate-safe-id');
var math = require('mathjs');

var mysql = require('mysql');
var con = mysql.createConnection({
	host: process.env.SQL_HOSTNAME,
	user: process.env.SQL_USER,
	password: process.env.SQL_PWD,
	database : process.env.KEYSPACE
});
const uuidv1 = require('uuid/v1');
const https = require('https');


module.exports = {
	getresponse: function(productid){
		return new Promise(function(resolve, reject) {
			var res = [
						{
						  "technicalDebtViolation": 180,
						  "sprintID": 41,
						  "technicalDebtEffortInHours": 17,
						  "jiraProjectKey": "NEX",
						  "sprintVelocity": 0,
						  "sprintName": "Sprint 5 - 1st Mar to 14th Mar",
						  "technicalDebtViolationDensity": 16.791044776119
						},
						{
						  "technicalDebtViolation": 68,
						  "sprintID": 42,
						  "technicalDebtEffortInHours": 7,
						  "jiraProjectKey": "NEX",
						  "sprintVelocity": 88,
						  "sprintName": "Sprint 6 - 15 Mar to 28 Mar",
						  "technicalDebtViolationDensity": 8.5106382978723
						},
						{
						  "technicalDebtViolation": 274,
						  "sprintID": 43,
						  "technicalDebtEffortInHours": 39,
						  "jiraProjectKey": "NEX",
						  "sprintVelocity": 60,
						  "sprintName": "Sprint 7 - 29 Mar to 14 Apr",
						  "technicalDebtViolationDensity": 12.012275317843
						},
						{
						  "technicalDebtViolation": 180,
						  "sprintID": 83,
						  "technicalDebtEffortInHours": 17,
						  "jiraProjectKey": "NEX",
						  "sprintVelocity": 128,
						  "sprintName": "Sprint 8 - 13 Apr to 27 Apr",
						  "technicalDebtViolationDensity": 16.791044776119
						},
						{
						  "technicalDebtViolation": 233,
						  "sprintID": 84,
						  "technicalDebtEffortInHours": 18,
						  "jiraProjectKey": "NEX",
						  "sprintVelocity": 161,
						  "sprintName": "Sprint 9 - 30 Apr to 11 May",
						  "technicalDebtViolationDensity": 6.1902231668438
						}
					  ];
			resolve(res);
		});
	},
	
	getsprintwisevelocity: function(){
		return new Promise(function(resolve, reject) {
			var res = [
						{
						"sprintId": 41,
						"VelocityOfSprint": 0,
						"wipQueueLen": 0,
						"sprintName": "Sprint 5 - 1st Mar to 14th Mar",
						"status":"closed"
						},
						{
						"sprintId": 42,
						"VelocityOfSprint": 88,
						"wipQueueLen": 2,
						"sprintName": "Sprint 6 - 15 Mar to 28 Mar",
						"status":"closed"
						},
						{
						"sprintId": 43,
						"VelocityOfSprint": 60,
						"wipQueueLen": 6,
						"sprintName": "Sprint 7 - 29 Mar to 14 Apr",
						"status":"closed"
						},
						{
						"sprintId": 83,
						"VelocityOfSprint": 128,
						"wipQueueLen": 11,
						"sprintName": "Sprint 8 - 13 Apr to 27 Apr",
						"status":"closed"
						},
						{
						"sprintId": 84,
						"VelocityOfSprint": 161,
						"wipQueueLen": 22,
						"sprintName": "Sprint 9 - 30 Apr to 11 May",
						"status":"closed"
						},
						{
						"sprintId": 85,
						"VelocityOfSprint": 53,
						"wipQueueLen": 35,
						"sprintName": "Sprint 10 - 14 May to 25 May",
						"status":"active"
						}
					];
			resolve(res);
		});
	},
	
	sendtokairos: function(data, cb){
		console.log('http://'+process.env.KAIROSDB_IP+':'+process.env.KAIROS_PORT+'/api/v1/datapoints');
		request.post(
		{
			url: 'http://'+process.env.KAIROSDB_IP+':'+process.env.KAIROS_PORT+'/api/v1/datapoints',
			body: data,
			json: true
		}, function (error, response, body) {
			if(error) reject(error);
			cb(body);
		});
	},
	
	getVelocityoflastsprints: function(productid){
		return new Promise(function(resolve, reject) {
			var query = "select * from sprint where project_id = ?  order by index_sp desc";
			con.query(query, [productid], function(err, result) {
				if(err) throw err;
				var new_arr = sort_by_key_value(result, 'index_sp').reverse();
				resolve(result);
			});
		});
	},
	
	getAllsprintByPKEY: function(project_key){
		return new Promise(function(resolve, reject) {
			var query = "select * from sprint where project_key = ?  order by index_sp desc";
			con.query(query, [project_key], function(err, result) {
				if(err) throw err;
				console.log(result.length);
				resolve(result);
			});
		});
	},
	
	getFormEntries: (sprint_id,project_key)=>{
		return new Promise(function(resolve, reject) {
			var query = "select faketable.* from faketable where faketable.project_key = ? && faketable.sprint_id = ?";
			console.log(query);
			con.query(query, [sprint_id, project_key], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getProjectName: (project_key, cb)=>{
		var query = "select project.* from project where project.project_key = ?";
		console.log(query);
		con.query(query, [project_key], function(err, result) {
			if(err) throw err;
			cb(result);
		});
	},
	
	getAlltechnical_debtloc_changedByPKEY: function(project_key){
		return new Promise(function(resolve, reject) {
			var query = "select delta_loc,state,project_key,index_sp,sprint_name,sprint_id,effort,violation from technical_debt where project_key = ?  order by index_sp desc";
			con.query(query, [project_key], function(err, result) {
				if(err) throw err;
				var new_arr = sort_by_key_value(result, 'index_sp').reverse();
				resolve(result);
			});
		});
	},
	
	getLatestClosedSprintdeployment: function(productid){
		return new Promise(function(resolve, reject) {
			var query = "select * from sprint where project_id = ?  order by index_sp desc"
			con.query(query, [productid], function(err, result) {
				if(err) throw err;
				var new_arr = sort_by_key_value(result, 'index_sp').reverse();
				resolve(result);
			});
		});
	},
	
	getallaboutproject: function(productid){
		return new Promise(function(resolve, reject) {
			var query2 = "select * from project where id = ?" ;
			con.query(query2, [productid], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	}, 
	
	deleteProjectRecordFromSprintById: function(sprint_pk){
		return new Promise(function(resolve, reject) {
			var query = "delete from sprint where id = '"+sprint_pk + "'";
			con.query(query, function(err, result) {
				if(err) throw err;
				log.info("Deleted sprint of id:" + sprint_pk);
				resolve(true);
			});
		}); 
	},
	
	getAllSprintsOfSameProjectKey: function(project_key, cb){
		//var query = "select * from sprint where project_key = '"+project_key+"' ALLOW FILTERING";
		con.query("select * from sprint where project_key = ?", [project_key], function(err, result) {
			if(err) throw err;
			cb(result);
		});
	},
	
	deleteProjectRecordFromTechnicalDebtById: function(td_pk){
		return new Promise(function(resolve, reject) {
			var query = "delete from technical_debt where id = ?";
			con.query(query, [td_pk], function(err, result) {
				if(err) throw err;
				log.info("Deleted TechnicalDebt of id:" + td_pk);
				resolve(true);
			});
		});
	},
	
	getPkIdFromSprintByKey: function(project_key){
		return new Promise(function(resolve, reject) {
			con.query("select id from sprint where project_key = ?", [project_key], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getSprintDetailAPIByProjectKey: function(project_key){
		return new Promise(function(resolve, reject) {
			request.get({
				url: process.env.JAVA_APIS_BASE_URL+'getJiraSprintsForProject?projetKey='+project_key,
				json: true
			}, function (error, response, body) {
				if(error) reject(error);
				resolve(body);
			});
		});
	},
	
	getAllDeploymentRecordByProjectKey: function(project_key){
		return new Promise(function(resolve, reject) {
			//var query = "select id from deployment where project_key = '"+project_key+"' ALLOW FILTERING";
			con.query("select id from deployment where project_key = ?", [project_key], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	deleteDeploymentOfSameId: function(deploymentid){
	/*deleteDeploymentOfSameId: function(deploymentid, cb){
		var query = "delete from deployment where id = ?";
		con.query(query, [deploymentid], function(err, result) {
			if(err) throw err;
			log.info("Deleted deployment of id:" + deploymentid);
			cb();
		}); */
		return new Promise(function(resolve, reject) {
			var query = "delete from deployment where id = ?";
			con.query(query, [deploymentid], function(err, result) {
				if(err) throw err;
				log.info("Deleted deployment of id:" + deploymentid);
				resolve(true);
			});
		});
	},
	
	getPersonsOfProject: function(project_key){
		return new Promise(function(resolve, reject) {
			var query = "select * from project_persons where project_key = ? and (designation = ? || designation = ?)";
			con.query(query, [ project_key, 'AppLead', 'AppLeadEmail'], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	insertSprintsForSpecificProject: function(sprints,pk,cb){
		var uuid = uuidv1();
		var inserted_ts = moment.utc().valueOf();
		if(sprints.length>0) {
			async.forEach(sprints, function (item, callback){ 
				var ct;
				if(item.sprintCompleteDate!="undefined"){
					ct = item.sprintCompleteDate;
				} else {
					ct = null;
				}
				var et;
				if(item.sprintEndDate!="undefined"){
					et = item.sprintEndDate;
				} else {
					et = null;
				}
				var sdts;
				if(item.sprintStartDateTS!="undefined"){
					sdts = item.sprintStartDateTS;
				} else {
					sdts = null;
				}
				var cdts;
				if(item.sprintCompleteDateTS!="undefined"){
					cdts = item.sprintCompleteDateTS;
				} else {
					cdts = null;
				}
				var edts;
				if(item.sprintEndDateTS!="undefined"){
					edts = item.sprintEndDateTS;
				} else {
					edts = null;
				}
				var sortIndex;
				if(item.sortIndex!="undefined") {
					sortIndex = item.sortIndex;
				} else {
					sortIndex = null;
				}
				var avgIndex;
				if(item.avgIndex!="undefined") {
					avgIndex = item.avgIndex;
				} else {
					avgIndex = null;
				}
				var inserted_ts = moment.utc().valueOf();
				var bugcount = null;
				var cycletime = null;
				//var technicalDebtEffortInHours = null;
				var wipQueueLength = null;
				var sprintVelocity = null;
				var leadTime = null;
				//var technicalDebtViolationDensity = null;
				//console.log("item.id = "+item.id);
				getEntitiesofSprints(pk.replace(/'/g, "\\'"), item.id, function(data1){
					//log.info(item.sprintName);
					if(data1[0].response != 404){
						var data = data1[0][0];
						bugcount = data.bugCount;
						cycletime = data.cycleTime;
						//technicalDebtEffortInHours = data.technicalDebtEffortInHours;
						wipQueueLength = data.wipQueueLength;
						sprintVelocity = data.sprintVelocity;
						leadTime = data.leadTime;
						//technicalDebtViolationDensity = data.technicalDebtViolationDensity;
					}
					var q = "insert into sprint(id, avgindex, index_sp, sprint_id, bug_count, complete_date, cycle_time, end_date, inserted_ts, lead_time, project_id, project_key, sprint_name, start_date, state, velocity, wip_count, sprintstartdatets, sprintenddatets, sprintcompletedatets) values('"+uuidv1()+"', "+avgIndex+", '"+sortIndex+"','"+item.id+"',"+bugcount+",'"+ct+"','"+cycletime+"', '"+et+"', "+inserted_ts+", '"+leadTime+"', '"+uuid+"', '"+pk.replace(/'/g, "\\'")+"', '"+(item.sprintName).replace(/'/g, "\\'")+"', '"+item.sprintStartDate+"', '"+item.state+"', "+sprintVelocity+", "+wipQueueLength+", '"+sdts+"', '"+edts+"', '"+cdts+"')";
					//log.info(q);
					con.query(q, function(err, result) {
						log.info("Inserted sprint:" + item.sprintName);
						callback();
					});
				});
			}, function() {
				log.info("Inserted NEW Sprints");
				cb('done');
			});
		}
		/* Siddharth's Code
		//var uuid = TimeUuid.now();
		var inserted_ts = moment.utc().valueOf();
		//update current active sprint
		getCount(project_key, function(count){
			// console.log('count from db = '+count[0].count);
			var index_sp = count[0].count;
			// console.log("index_sp = "+index_sp);
			if(index_sp!=0) {
			getNowLatestSprint(project_key, (data)=>{ //this function is giving all sprints from API
				if(data.length>0) {
					// console.log('from api = ' + data.length);
					//update current active sprint in DB except state and index_sp
					//first check if there is any sprint record in DB for project
					// console.log("project_key = "+project_key);
					checkDBSprintCount(project_key, (rowcount)=>{
					// console.log("totalrecssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss = ");
						var recinDB = rowcount[0].totalrec;
						//insert all into sprint 
						insertAllSprintFirst(recinDB, data, (res2)=>{
						getCurrentSprintFromDB123(project_key, (activatedsprintfromdb)=>{
							if(activatedsprintfromdb.length>0) {	
								getDataFromAPIforsamesprint(activatedsprintfromdb[0].sprint_id, project_key, (getlatestsprintcode)=>{
									// console.log(activatedsprintfromdb)
									// console.log(getlatestsprintcode.sprintCompleteDate);
									updateOnlyCompleteDate(getlatestsprintcode.sprintCompleteDate, activatedsprintfromdb[0].id, (res)=>{
										if(data.length > count[0].count){ 
											//update active sprint to closed and index_sp also
											updateStateNIndexSPOfActiveSprint(activatedsprintfromdb[0].id, index_sp, (res1)=>{
												//this is case when new sprints available in api result :: Now insert only
												//how much elements missing
												var missingelementscount = (data.length - count[0].count);
												//reverse the string
												var reverse_array_from_api = data.reverse();
												// console.log("missingelementscount = " + missingelementscount);
												// console.log(reverse_array_from_api[1]);
												var searchDataIds = [];
												for(var i = 0; i < missingelementscount; i++){
													searchDataIds.push(reverse_array_from_api[i]);
												}
												var j = searchDataIds.length;
												async.forEach(searchDataIds, (item, callback)=>{ 
													getEntitiesofSprints(project_key.replace(/'/g, "\\'"), item.id, (data1)=>{
														// console.log("getEntitiesofSprints");
														// console.log(data1);
														// console.log("reverse_array_from_api[i]");
														// console.log(item);
														var ct;
														var et;
														var sdts;
														var cdts;
														var edts;
														var sortIndex;
														if(item.sprintCompleteDate!==undefined){
															ct = item.sprintCompleteDate;
														} else {
															ct = null;
														}
														if(item.sprintEndDate!==undefined){
															et = item.sprintEndDate;
														} else {
															et = null;
														}
														if(item.sprintStartDateTS!==undefined){
															sdts = item.sprintStartDateTS;
														} else {
															sdts = null;
														}
														if(item.sprintCompleteDateTS!==undefined){
															cdts = item.sprintCompleteDateTS;
														} else {
															cdts = null;
														}
														if(item.sprintEndDateTS!==undefined){
															edts = item.sprintEndDateTS;
														} else {
															edts = null;
														}
														if(item.sortIndex!==undefined) {
															sortIndex = item.sortIndex;
														} else {
															sortIndex = null;
														}	
																												
														var bugcount = null;
														var cycletime = null;
														//var technicalDebtEffortInHours = null;
														var wipQueueLength = null;
														var sprintVelocity = null;
														var leadTime = null;
														//var technicalDebtViolationDensity = null;
														var avgIndex = 0;
														bugcount = (data1[0].response===undefined) ? data1[0][0].bugCount : 0;
														cycletime = (data1[0].response===undefined) ? data1[0][0].cycleTime: 0;
														//technicalDebtEffortInHours = (data1[0].response===undefined) ? data1[0][0].technicalDebtEffortInHours: '0';
														wipQueueLength = (data1[0].response===undefined) ? data1[0][0].wipQueueLength : 0;
														sprintVelocity = (data1[0].response===undefined) ? data1[0][0].sprintVelocity : 0;
														leadTime = (data1[0].response===undefined) ? data1[0][0].leadTime : 0;
														//technicalDebtViolationDensity = (data1[0].response===undefined) ? data1[0][0].technicalDebtViolationDensity : 0;
														avgIndex = item.avgIndex;
														var uuid = uuidv1();
														var q = "insert into sprint(id, avgindex, index_sp, sprint_id, bug_count, complete_date, cycle_time, end_date, inserted_ts, lead_time, project_id, project_key, sprint_name, start_date, state, velocity, wip_count, sprintstartdatets, sprintenddatets, sprintcompletedatets) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
														// console.log(q);
														con.query(q, [uuid, avgIndex, item.sortIndex, item.id, bugcount, ct, cycletime, et, inserted_ts, leadTime, uuid, project_key.replace(/'/g, "\\'"), (item.sprintName).replace(/'/g, "\\'"), item.sprintStartDate, item.state, sprintVelocity, wipQueueLength, sdts, edts, cdts], function(err, result) {
															if(err) throw err;
														});
														if((i+1)==j){
															cb('done');
														}
														j++;
														callback();
													});
												});
											});
										} else {
											cb('done');
										}
									});
								});
							} else {
								cb('done');
							}
						});
					});
					});
				} else {
					cb('done');
				}
			});
		}
		}); */
	},
	
	getTechnicalDebtProjectKeyRecords: function(project_key){
		return new Promise(function(resolve, reject) {
			con.query("select * from technical_debt where project_key = ?", [project_key], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getDesignations: function(){
		return new Promise(function(resolve, reject) {
			con.query("select * from designations", function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getOrganization: function(){
		return new Promise(function(resolve, reject) {
			con.query("select id,organization_name from organizations where status = ?", ['1'], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getAllMenus: ()=>{
		return new Promise(function(resolve, reject) {
			con.query("select * from menus where status = ? && menu_name!=? order by menus.id", ['1','Products'], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getMenus: (userid)=>{
		return new Promise(function(resolve, reject) {
			con.query("select user_menus.user_id, menus.id as menu_id, menus.menu_name from menus left join user_menus ON user_menus.menu_id=menus.id where menus.id!=? && menus.status=? && user_menus.user_id=? order by menus.id", [1,'1',userid], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	/*************************** Assigning Menus *****************/
	assignMenus: (arr)=>{
		return new Promise(function(resolve, reject) {
			var q;
			if(arr[1]=="true") { //insert
				q = "insert into user_menus(menu_id,user_id,timestamp_insert) values(?, ?, ?)";
				con.query(q, [arr[0], arr[2], arr[3]], function(err, result) {
				if(err) reject();
				resolve(result);
				});
			} else { //delete
				q = "delete from user_menus where menu_id = ? && user_id = ?";
				con.query(q, [arr[0], arr[2]], function(err, result) {
				if(err) reject();
				resolve(result);
				});
			}
		});
	},
	
	insertintoUserMenus: (userid)=>{
		return new Promise(function(resolve, reject) {
			var q = "CALL insertDefaultValuesUserMenus('"+userid+"')";
			// console.log(q);
			con.query(q, function(err, result) {
				if(err) reject();
				resolve(true);
			});
		});
	},
	
	insertDefaultMenusSelectionForUser: (email)=> {
		return new Promise(function(resolve, reject) {
			var q = "select * from users where username = ?";
			console.log(q);
			con.query(q, [email], function(err, result) {
				if(err) reject();
				resolve(result);
			});
		});
	},
	
	getCountMenus: (userid)=>{
		return new Promise(function(resolve, reject) {
			var q = "select count(*) as count from user_menus where user_id = ?";
			con.query(q, [userid], function(err, result) {
				if(err) reject();
				resolve(result);
			});
		});
	},
	
	confirmpassword: (psw,userid)=>{
		return new Promise(function(resolve, reject) {
			var q = ("select * from users where id = ?");
			con.query(q, [userid], function(err, result) {
				if(err) reject();
				resolve(result);
			});
		});
	},
	
	changePassword:(cnpsw,userid)=> {
		return new Promise(function(resolve, reject) {
			var q = ("update users set password = ? where id = ?");
			con.query(q, [cnpsw,userid], function(err, result) {
				if(err) reject();
				resolve(result);
			});
		});
	},
	
	getServiceName:()=>{
		return new Promise(function(resolve, reject) {
			var q = ("select * from tbl_configuration_name where tbl_configuration_name.status = ?");
			con.query(q, ['1'], function(err, result) {
				if(err) reject();
				resolve(result);
			});
		});
	},
	
	getconfigurationOptions:(id, cb)=>{
		var q = ("select id as tbl_configuration_options_pk,option_value from tbl_configuration_options where tbl_configuration_name_id = ?");
		con.query(q, [id], function(err, result) {
			if(err) reject();
			cb(result);
		});
	},
	
	getUsersConfigurations:(userid)=>{
		return new Promise(function(resolve, reject) {
			var q = "select * from tbl_users_configurations where user_id = ?";
			con.query(q, [userid], function(err, result) {
				if(err) reject();
				resolve(result);
			});
		});
	},
	
	insertechnicaldebt: function(data1, sprintname, sprintid, sprintpk, index_sp, project_key, state, cb){
		//log.info("Tech Debt sprint name:" + sprintname);
		var data = JSON.parse(data1);
		var inserted_ts = moment.utc().valueOf();
		var sqale_index = 0;
		var violations = 0;
		var ncloc = 0;
		var deltaLOC = 0;
		if(data[0].response != 404){
			sqale_index = data[0].sqale_index;
			violations = data[3].violations;
			ncloc = data[1].ncloc;
			deltaLOC = data[2].deltaLOC;
		}
		var q = "insert into technical_debt(id,effort,inserted_ts,sonar_project_name,sprint_id,sprint_name,tfs_branch,violation,sprint_pk,loc,index_sp,project_key,state,delta_loc) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		log.info(q);
		con.query(q, [uuidv1(), sqale_index, inserted_ts, sprintname, sprintid, sprintname, null, violations, sprintpk, ncloc, index_sp, project_key, state, deltaLOC], function(err, result) {			
			if(err) throw err;
			log.info("Inserted Tech Debt sprint name:" + sprintname);
			cb();
		});
	},

	gettechnicaldebtforsprint: function(spname, cb){
		request.get(process.env.JAVA_APIS_BASE_URL+'getTechnicalDebtForSprint?sprintName='+spname, function (error, response, body) {
			cb(body)
		});
	},
	/*
	getdeploymentforsprint: function(spname, cb){
		console.log(process.env.JAVA_APIS_BASE_URL+'getJenkinsDeploymentInfoForSprint?sprintName='+spname.replace(/ /g,''));
		request.get(process.env.JAVA_APIS_BASE_URL+'getJenkinsDeploymentInfoForSprint?sprintName='+spname.replace(/ /g,''), function (error, response, body) {
			cb(body)
		});
	},
	*/
	
	insertdeployment: function(data1, sprintname, sprintid, sprintpk, project_key, cb){
		//log.info("Deployment sprint name:" + sprintname);
		var data = JSON.parse(data1);
		var inserted_ts = moment.utc().valueOf();
		if(data.length>0){
			async.forEach(data, function (item, callback){ 
				var artifact_filename;
				if((item.artifactsList).length==0) {
					artifact_filename = null;
				} else {
					artifact_filename = item.artifactsList[0].fileName;
				}
				var artifact_version;
				if((item.artifactsList).length==0) {
					artifact_version = null;
				} else {
					artifact_version = item.artifactsList[0].version;
				}
				var query = "insert into deployment(id, artifact_name, build_no, deployment_date, env_name, inserted_ts, sprint_name, sprint_pk ,status, target_host_name, tfs_branch, version, sprint_id, duration, project_key) values('"+TimeUuid.now()+"', '"+artifact_filename+"', "+item.number+", '"+item.deploymentDate+"', '"+item.actionsList[0].parametersList[1].value+"', "+inserted_ts+", '"+sprintname+"', '"+sprintpk+"', '"+item.result+"', '"+item.actionsList[0].parametersList[0].value+"', '" + item.actionsList[0].parametersList[3].value + "', '"+artifact_version+"', "+sprintid+", '" + item.duration + "', '"+project_key+"')";
				log.info(query);
				con.query(query, function(err, result) {
					if(err) throw err;
					log.info("Inserted deployment of sprint name:" + sprintname);
					callback();
				});
			}, function() {
				cb();
			});
		} else {
			cb();
		}
	},


	gettechnical_debt: function(project_key){
		return new Promise(function(resolve, reject) {
			var query = "select * from technical_debt where project_key = ?  order by index_sp desc"
			con.query(query, [project_key], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getColorCoding: function(object, cb){
		//already sorted array
		//latest efforts
		var latestefforts = object[0].effort;
		var latestdelta_loc = object[0].delta_loc;
		var latestclosedsprintTB = object[0].violation;
		var alleffort = [];
		var alldeltaloc = [];
		var allTB = [];
		var sprintefforts = [];
		var sprintdelta_loc = [];
		var sprintTB = [];
		async.forEach(object, function (item, callback){ 
			if(item.state="closed"){
				alleffort.push(parseInt(item.effort));
				alldeltaloc.push(parseInt(item.delta_loc));
				allTB.push(parseInt(item.violation));
				sprintefforts.push({"sprintname":item.sprint_name, "effort":item.effort});
				sprintdelta_loc.push({"sprintname":item.sprint_name, "delta_loc":item.delta_loc});
				sprintTB.push({"sprintname":item.sprint_name, "effort":item.violation});
				callback();
			}
		});
		
		var sumofTB = allTB.reduce(function(a, b) { return a + b; });
		var avgofTBs = sumofTB/(allTB.length);
		var gettenpercentofTB = ((avgofTBs/100) * 10);
		var maxTBRange = avgofTBs+gettenpercentofTB;
		var minTBRange = avgofTBs-gettenpercentofTB;
		var colorTB;
		if(latestclosedsprintTB>=minTBRange && latestclosedsprintTB<=maxTBRange){
			// blue
			colorTB = 'info';
		} else if(latestclosedsprintTB<minTBRange) {
			// red
			colorTB = 'success';
		} else if(latestclosedsprintTB>maxTBRange) {
			//green
			colorTB = 'danger';
		}	
		
		var sumofeffort = alleffort.reduce(function(a, b) { return a + b; });
		var avgofeffort = sumofeffort/(alleffort.length);
		var gettenpercentofeffort = ((avgofeffort/100) * 10);
		var maxEffortRange = avgofeffort+gettenpercentofeffort;
		var minEffortRange = avgofeffort-gettenpercentofeffort;
		
		if(latestefforts>=minEffortRange && latestefforts<=maxEffortRange){
			// blue
			colorEffort = 'info';
		} else if(latestefforts<minEffortRange) {
			// red
			colorEffort = 'success';
		} else if(latestefforts>maxEffortRange) {
			//green
			colorEffort = 'danger';
		}
		
		var sumofdelta_loc = alldeltaloc.reduce(function(a, b) { return a + b; });
		var avgofdeltaloc = sumofdelta_loc/(alldeltaloc.length);
		var gettenpercentofdeltaloc = ((avgofdeltaloc/100) * 10);
		var maxDeltaLocRange = avgofdeltaloc+gettenpercentofdeltaloc;
		var minDeltaLocRange = avgofdeltaloc-gettenpercentofdeltaloc;
		var colorEffort;
		var colorDeltaLoc; 
		
		if(latestdelta_loc>=minDeltaLocRange && latestdelta_loc<=maxDeltaLocRange){
			// blue
			colorDeltaLoc = 'info';
		} else if(latestdelta_loc<minDeltaLocRange) {
			// red
			colorDeltaLoc = 'success';
		} else if(latestdelta_loc>maxDeltaLocRange) {
			//green
			colorDeltaLoc = 'danger';
		}
		
		cb({"colorEffort":colorEffort,  "colorDeltaLoc":colorDeltaLoc, "colorTB": colorTB}); 
	},
	
	gettechnical_debtR: function(project_key){
		return new Promise(function(resolve, reject) {
			var query = "select * from technical_debt where project_key = ?  order by index_sp desc"
			con.query(query, [project_key], function(err, result) {
				if(err) throw err;
				var new_arr = sort_by_key_value(result, 'index_sp');
				resolve(new_arr);
			});
		});
	},
	
	get_deployment: function(project_key){
		return new Promise(function(resolve, reject) {
			var query = "select * from deployment where project_key = ?";
			con.query(query, [project_key], function(err, result) {
				if(err) throw err;
				var new_arr = sort_by_key_value(result, 'index_sp').reverse();
				resolve(result);
			});
		});
	},
	
	getAllsprints: function(project_key, cb){
		con.query("select * from sprint where project_key = ? order by index_sp desc", [project_key], function(err, result) {
			if(err) throw err;
			var new_arr = sort_by_key_value(result, 'index_sp').reverse();
			var sortedArray = _.sortBy(result,'index_sp');
			cb(result);
		});
	},
	
	getActiveSprint: function(project_key, cb){
		return new Promise(function(resolve, reject) {
			con.query("select * from sprint where project_key = ? && index_sp = ? order by index_sp desc", [project_key,'-1'], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getAllsprintsR: function(project_key, cb){
		con.query("select * from sprint where project_key = ? order by index_sp", [project_key], function(err, result) {
			if(err) throw err;
			cb(result);
		});
	},
	
	getAllsprintsForCSV: function(project_key,forwhat){
		return new Promise(function(resolve, reject) {
			var where = "";
			if(forwhat=="active"){
				 where += " AND index_sp = ?";
			}
			var query = "select * from sprint where project_key = ?  order by index_sp desc "+where;
			con.query(query, [project_key, '-1'], function(err, result) {
				if(err) throw err;
				if(forwhat=="all")
				resolve(result);
				if(forwhat=="latest")
				resolve([result[0]]);	
				if(forwhat=="active")
				resolve(result);	
			});
		});
	},
	
	checklatestsprint: function(sprintid,project_key){
		return new Promise(function(resolve, reject) {
			var url = process.env.JAVA_APIS_BASE_URL+'getJiraSprintsForProject?projetKey='+project_key;
			request.get(url, function (error, response, body) {
				if(error) reject(error);
				resolve(body);
			});
		});
	},
	
	getSameSprint: function(sprintid,projectKey){
		return new Promise(function(resolve, reject) {
			var url = process.env.JAVA_APIS_BASE_URL+'getSprintDetailFromSprintId?projectKey='+projectKey+'&sprintID='+sprintid;
			request.get(url, function (error, response, body) {
				if(error) reject(error);
				resolve(body);
			});
		});
	},

	updateSprint: function(sprintpk, object){
		return new Promise(function(resolve, reject) {
			var query = "update sprint set bug_count = ?, cycle_time = ?, lead_time = ?, velocity = ?, wip_count = ? where id = ?";
			con.query(query, [object.bugCount, object.cycleTime, object.leadTime, object.sprintVelocity, object.wipQueueLength, sprintpk], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getTechnicalDebtPK: function(sprintid,projectKey){
		return new Promise(function(resolve, reject) {
			//var query = "select * from technical_debt where sprint_id = "+sprintid+" AND project_key = '"+projectKey+"' ALLOW FILTERING";
			con.query("select * from technical_debt where sprint_id = ? AND project_key = ?", [sprintid,projectKey], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getRecordFromDeploymentOfSameProjectKey: function(sprint_id){
		return new Promise(function(resolve, reject) {
			//var query = "select id from deployment where sprint_id = "+sprint_id+" ALLOW FILTERING";
			con.query("select id from deployment where sprint_id = ?", [sprint_id], function(err, result) {
				if(err) throw err;
				resolve(result);
			});

		});
	},
	
	deleteAllDeploymentById: function(idArray, cb){
		async.forEach(idArray, function (item, callback){ 
			var query = "delete from deployment where id = ?";
			con.query(query, [item.id], function(err, result) {
				if(err) throw err;
			});
		}, function(){
			cb('true');
		});
	},
	
	getdeploymentforsprint: function(spname, cb){
		// log.info(process.env.JAVA_APIS_BASE_URL+'getJenkinsDeploymentInfoForSprint?sprintName='+spname.replace(/ /g,''));
		request.get(process.env.JAVA_APIS_BASE_URL+'getJenkinsDeploymentInfoForSprint?sprintName='+spname.replace(/ /g,''), function (error, response, body) {
			cb(body)
		});
	},
	/*
	insertdeployment: function(data, sprintname, sprintid, sprintpk, project_key, cb){
		var data = JSON.parse(data);
		var inserted_ts = moment.utc().valueOf();
		async.forEach(data, function (item, callback){ 
			if((item.artifactsList).length==0) {
				var artifact_filename = null;
			} else {
				var artifact_filename = item.artifactsList[0].fileName;
			}
			if((item.artifactsList).length==0) {
				var artifact_version = null;
			} else {
				var artifact_version = item.artifactsList[0].version;
			}
			var query = "insert into deployment(id, artifact_name, build_no, deployment_date, env_name, inserted_ts, sprint_name, sprint_pk ,status, target_host_name, tfs_branch, version, sprint_id, duration, project_key) values("+TimeUuid.now()+", '"+artifact_filename+"', "+item.number+", '"+item.deploymentDate+"', '"+item.actionsList[0].parametersList[1].value+"', "+inserted_ts+", '"+sprintname+"', '"+sprintpk+"', '"+item.result+"', '"+item.actionsList[0].parametersList[0].value+"', "+null+", '"+artifact_version+"', "+sprintid+", '4', '"+project_key+"')";
			con.query(query, function(err, result) {
				callback();
			});
		}, function() {
			cb();
		});
	},
	*/
	deleteThisTechnicalDebt: function(object){
		return new Promise(function(resolve, reject) {
			var query = "delete from technical_debt where id = ?";
			con.query(query, [object[0].id], function(err, result) {
				if(err) throw err;
				resolve();
			});
		});
	},
	
	getTechnicalDebtForThisSprint: function(object, cb){
		request.get(process.env.JAVA_APIS_BASE_URL+'getTechnicalDebtForSprint?sprintName='+object[0].sprint_name, function (error, response, body) {
			cb(body)
		});
	},
	
	updateTechnicalDebtForActiveSprint: function(id,data){
		//console.log(id);
		return new Promise(function(resolve, reject) {
			var dataP = JSON.parse(data);
			var q = "update technical_debt set delta_loc = ?, effort = ?, loc = ?, violation = ? where id = ?";
			con.query(q, [dataP[2].deltaLOC, dataP[0].sqale_index, dataP[1].ncloc, dataP[3].violations, id], function(err, result) {
				resolve(q);
			});
		});	
	},
	

	reverseJSON: function(object){
		return new Promise(function(resolve, reject) {
			var new_arr = sort_by_key_value(object, 'sortIndex');
			resolve(new_arr);
		});
	},
	
	getDeploymentData: function(sprint_pk){
		return new Promise(function(resolve, reject) {
			var query = "select * from deployment where sprint_pk = '" + sprint_pk + "'"; 
			con.query(query, function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		});
	},
	
	getLatestClosedSprint: function(productid){
		return new Promise(function(resolve, reject) {
			var query = "select * from sprints where productid = ?";
			con.query(query, [productid], function(err, result) {
				if(err) throw err;
				resolve(JSON.parse(result[0].sprintjson).values);
			});
		});
	},
	
	getlocvalue: function(sprintid){
		return new Promise(function(resolve, reject) {
			var query = "select attribute_value from sonar_record where sprint_id = ? AND attribute_name = ?";
			con.query(query, [sprintid, 'loc'], function(err, result) {
				if(err) throw err;
				resolve(result[0]);
			});
		});
	},
	
	getlocvaluenp: function(sprintid){
		return new Promise(function(resolve, reject) {
			//var query = "select attribute_value from sonar_record where sprint_id = '"+sprintid+"' AND attribute_name = 'loc' ALLOW FILTERING";
			con.query("select attribute_value from sonar_record where sprint_id = ? AND attribute_name = ?", [sprintid, 'loc'], function(err, result) {
				if(err) throw err;
				resolve (result[0]);
			});
		});
	},
	
	getlocvaluecycletime: function(sprintid){
		return new Promise(function(resolve, reject) {
			//var query = "select attribute_value from sonar_record where sprint_id = '"+sprintid+"' AND attribute_name = 'cycle_time_in_days' ALLOW FILTERING";
			con.query("select attribute_value from sonar_record where sprint_id = ? AND attribute_name = ?", [sprintid, 'cycle_time_in_days'], function(err, result) {
				if(err) throw err;
				resolve (result[0]);
			});
		});
	},
	
	compareSecondColumn: function(a, b){
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
	},
	
	gettdebtvalue: function(sprintid){
		return new Promise(function(resolve, reject) {
			//var query = "select attribute_value from sonar_record where sprint_id = '"+sprintid+"' AND attribute_name = 'technical_debt' ALLOW FILTERING";
			con.query("select attribute_value from sonar_record where sprint_id = ? AND attribute_name = ?", [sprintid, 'technical_debt'], function(err, result) {
				if(err) throw err;
				resolve(result[0]);
			});
		});
	},
	
	geteffortsvalue: function(sprintid){
		return new Promise(function(resolve, reject) {
			//var query = "select attribute_value from sonar_record where sprint_id = '"+sprintid+"' AND attribute_name = 'totalefforts' ALLOW FILTERING";
			con.query("select attribute_value from sonar_record where sprint_id = ? AND attribute_name = ?", [sprintid, 'totalefforts'], function(err, result) {
				if(err) throw err;
				resolve(result.rows[0]);
			});
		});
	},
	
	deletedatafaketable: function(data){
		return new Promise(function(resolve, reject) {
			con.query("truncate faketable", function(err, result) {
				if(err) throw err;
				resolve(data);
			});
		});
	},
	
	insertdatafaketable: function(object){
		return new Promise(function(resolve, reject) {
			var query = "insert into faketable(id, dcuttt,dcutwt,dqatt,dqawt,integrationenvtt,integrationenvwt,recruitmenttt,recruitmentwt,scadevcovtt,scadevcovwt, tollgatett,tollgatewt) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
			con.query(query, ['1',object.dcuttt, object.dcutwt, object.dqatt, object.dqawt, object.integrationenvtt, object.integrationenvwt, object.recruitmenttt, object.recruitmentwt, object.scadevcovtt, object.scadevcovwt, object. tollgatett, object.tollgatewt], function(err, result) {
				if(err) throw err;
				resolve('success');
			});
		});
	},
	
	getsprintEntitiesDataFromMongo: function(){
		return new Promise(function(resolve, reject) {
			MongoClient.connect(url, function(err, db) {
			  if (err) throw err;
			  var dbo = db.db("stp_db");
			  //var myobj = { name: "Company Inc", address: "Highway 37" };
			  dbo.collection("sprint_entities").find().toArray(function(err, result) {
				if (err) throw err;
				resolve(result);
				db.close();
			  });
			});
		});
	},
	
	insertintocassandrase: function(object){
		async.forEach(object, function (item, callback){ 
			////////console.log(item);
			var query = "insert into sprint_entities(id, EndDate, SerialNo, OrgID, ProdID, Sprint, UserStory, StoryPoints, StartDate) values(?,?,?,?,?,?,?,?,?)";
			con.query(query, [TimeUuid.now(), item.EndDate, item.SerialNo, item.OrgID, item.ProdID, item.Sprint, item.UserStory, item.StoryPoints, item.StartDate], function(err, result) {
				if(err) throw err;
				callback();
			});
			}, function() {
				console.log('insertedsssssssssss');
		});
	},
	
	getProductKey: function(product_id){
		return new Promise(function(resolve, reject) {
			var query = "select * from products where id = ?"
			con.query(query, [product_id], function(err, result) {
				if(err) throw err;
				resolve(result);
			
			});
		})
	},
	
	getSprintDataforsinglePro: function(prodkey){
		return new Promise(function(resolve, reject) {
			var query = "select * from sprints where prodkey = ?";
			con.query(query, [prodkey], function(err, result) {
				if(err) throw err;
				resolve(result);
			});
		})
	},
		
	checkforemailexist: function(email){
		return new Promise(function(resolve, reject) {
			var query = "select * from users where username = ?";
			console.log(query)
			con.query(query, [email], function(err, result) {
				if(err) throw err;
				resolve(result.length);
			});
		})
	},
	
	insertintousers :  function(object){
		return new Promise(function(resolve, reject) {
			var uuid = uuidv1();
			var query = "insert into users(id,country,domain,name,password,phone,user_type,username,website,organization) values(?,?,?,?,?,?,?,?,?,?)";
			con.query(query, [uuid,object.countryselected,object.domain,object.name,object.cpsw,object.phone,'manager',object.email,object.website, object.organization], function(err, result) {
				if(err) throw err;
				resolve('entered');
			});
		})
	},
	
	getSprintData: function(url){
		return new Promise(function(resolve, reject) {
			request.get(url, function (error, response, body) {
				if(error) reject(error);
				resolve(body);
			});
		});
	},
	
	getAPIres: function(url){
		return new Promise(function(resolve, reject) {
			request.get(url, function (error, response, body) {
				if(error) reject(error);
				resolve(body);
			});
		});
	},
	
	getJiraProjectData: function(url){
		return new Promise(function(resolve, reject) {
			request.get(url, function (error, response, body) {
				if(error) reject(error);
				resolve(body);
			});
		});
	},
	
	getAllJiraProject: function(){
		var url = 'http://172.16.13.71:8090/da/getAllJiraProjects';
		return new Promise(function(resolve, reject) {
			request.get(url, function (error, response, body) {
				if(error) reject(error);
				resolve(body);
			});
		});
	},
	
	getAllJiraProjectFromCassandra: function(){
		return new Promise(function(resolve, reject) {
			var query = "select * from products limit 10";
			con.query(query, function(err, data) {
				if(err) throw err;
				resolve(data.rows);
			});
		});
	},
	
	getSprintdataF: function(prodkey, callback){
		var url = 'http://172.16.151.97:8090/da/getJiraSprintsForProject?projetKey='+prodkey;
		request.get(url, function (error, response, body) {
			if(error) callback(error);
			callback(body)
		});
	},
	
	insertsprintintocassandra: function(sprintjson, storypoints, productkey, callback){
		var noofstories = Math.floor(Math.random()*(20-1+1)+1);
		log.info("storypoints = "+storypoints);
		//var query = "insert into sprints(id,class,noofstories,prodkey,sprintjson,storypoints) values(?,?,?,?,?,?)";
		con.query("insert into sprints(id,class,noofstories,prodkey,sprintjson,storypoints) values(?,?,?,?,?,?)", [TimeUuid.now(), 'com.mphasis.stp.da.beans.Sprint', noofstories, productkey, JSON.stringify(sprintjson), storypoints], function(err, data) {
				if(err) { throw err; } else { callback('inserted'); }
			});
	},
	
	insertintodatabaseinproducts: function(item,i){
		return new Promise(function(resolve, reject) {
			var query = "insert into products(id,paging,productname,class,jiraboardname,methodology,organization,productkey,created_at,is_active) values(?,?,?,?,?,?,?,?,?,?)";
			con.query(query, [TimeUuid.now(),i,item.productName, null, null, 'scrum', null, item.productKey, new moment().format('YYYY-MM-DDThh:mm:ssZ'), '0'], { prepare : true }, function(err, data) {
				if(err) throw err;
				resolve(item);
			});
		});
	},
	
	getSprintRecord: function(prod_id){
		return new Promise(function(resolve, reject) {
			var query = "select * from sprints where productid = ?";
			con.query(query, [prod_id], function(err, data) {
				if(err) throw err;
				resolve(data);
			});
		});
	},
	
	getactiveclosedonly: function(sprintdata){
		return new Promise(function(resolve, reject) {
			var finalresult = [];
			if(sprintdata.length>0) {
			for(var i=0; i<sprintdata.length; i++){
				if(sprintdata[i].state=="closed"){
					finalresult.push(sprintdata[i]);
				}
			}
				resolve(finalresult);
			} else {
				resolve(finalresult);
			}
		});
	},
	
	calculateaverageofclosedsprints: function(sprintdata){
		return new Promise(function(resolve, reject) {
			var sprintsname = [];
			var avg = 0;
			for(var i=0; i<sprintdata.length; i++){
				if(sprintdata[i].state=="closed"){
					avg += parseInt(sprintdata[i].VelocityOfSprint);
				}
				if(sprintdata[i].state=="closed"){
					sprintsname.push(sprintdata[i].name);
				}
			}
			resolve({"sprintdata":sprintdata, "avg": avg/(i+1), "sprintname":sprintsname });
		});
	},
	
	getSearchRecordFromProducts: function(page,searchProject){
		return new Promise(function(resolve, reject) {
			var skip = (parseInt(page)*10)-10;
			//var query = "select * from project where project_name like "+con.escape('%'+searchProject+'%')+" and paging > "+con.escape(skip)+" limit 10";
			var query = "select * from project where project_name like "+con.escape('%'+searchProject+'%')+" and paging > 80 and paging < 83 order by project_name ASC limit 10";
			con.query(query, function(err, data) {
				if(err) throw err;
				resolve(data);
			});
		});
	},
	
	getProducts: function(cb){
		con.query("select project_key from project", function(err, data) {
			if(err) throw err;
			cb(data);
		});
	},
	
	getRecordFromProducts: function(page){
		return new Promise(function(resolve, reject) {
			var skip = (parseInt(page)*10)-10;
			//var query = "select * from project where paging > "+skip+" order by project_name ASC limit 10";
			var query = "select * from project where paging > 80 AND paging <83 order by project_name ASC";
			con.query(query, function(err, data) {
				if(err) throw err;
				resolve(data);
			});
		});
	},
	
	getVelocityCalculated: function(productwithleadtime, callback){
		var query = "select * from sprints where prodKey = ? and avgindex=1";
		con.query(query, [productwithleadtime.product.productkey], function(err, result) {
			if(err) throw err;
			if(result[0]) {
				var values = JSON.parse(result[0].sprintjson).values;
				var allsps = [];
				var i = (values).length - 5;
				var velocitygraph = [];
				for(;i<((values).length);i++){
					if(values[i].VelocityOfSprint) {
						allsps.push(values[i].VelocityOfSprint);
						
					}
					if(values[i].state == "closed")
					velocitygraph.push({"sprintname":values[i].name, "velocity":values[i].VelocityOfSprint});
				}
				var sum = allsps.reduce(function(allsps, b) { return allsps + b; }, 0);
				var velocity = (parseInt(sum)/parseInt(allsps.length));
				var lastestclosedsprint = [];
				
				for(var j=(values.length-1); j>=0; j--){
					if(lastestclosedsprint.length==0 && values[j].state=="closed")
					lastestclosedsprint.push(values[j]);
				}
				var lastelementofarray = lastestclosedsprint[0];
				
				
				var lastelementvelocity = lastelementofarray.VelocityOfSprint;
				
				var gettenpercentofvelocity = ((velocity/100) * 10);
				
				var maxrange = parseFloat(velocity)+parseFloat(gettenpercentofvelocity);
				var minrange = parseFloat(velocity)-parseFloat(gettenpercentofvelocity);
				
				//calculate color here
				var color;
				if(lastelementvelocity>=minrange && lastelementvelocity<=maxrange){
					// blue
					color = 'info';
				} else if(lastelementvelocity<minrange) {
					// red
					color = 'danger';
				} else if(lastelementvelocity>maxrange) {
					//green
					color = 'success';
				}
				
				var lastsprintvelocityinpercent = (lastelementvelocity/100)*velocity;
				
				gettdissues(productwithleadtime.product.id, function(technicaldeptrec){
					productwithleadtime.technicaldebt	= 	technicaldeptrec.rows[0].technicaldebt;
					productwithleadtime.totalissues 	= 	(technicaldeptrec.rows[0].totalissues)/60;
					productwithleadtime.loc_changed 	= 	technicaldeptrec.rows[0].loc_changed;
					productwithleadtime.avgvelocityprevioussprint = velocity;
					productwithleadtime.lastsprintvelocity = lastelementvelocity;
					productwithleadtime.velocitytimecolor = color;
					productwithleadtime.lastsprintvelocityinpercent = lastsprintvelocityinpercent;
					productwithleadtime.velocitygraph = velocitygraph;
					callback(productwithleadtime);
				});
			} else {
				callback({productwithleadtime, "velocity": ""});
			}
		});	
	},
	
	getLeadTimeCalculated: function(product,callback){
		
		var query = "select * from sprint where project_key = ?  order by index_sp desc";
		con.query(query, [product.project_key], function(err, result) {
			if(err) throw err;
			
			if((result).length>0){
				//getting lastest closed sprint
				//var new_arr = sort_by_key_value(result, 'index_sp').reverse();
				var new_arr = _.sortBy(result,'index_sp').reverse();
				//console.log(new_arr[0]);
				var bugcountoflastclosedsprint = parseInt(new_arr[0].bug_count);
				var leadtimeoflastclosedsprint = parseInt(new_arr[0].lead_time);
				var velocityoflastclosedsprint = parseInt(new_arr[0].velocity);
				var wiplengthoflastclosedsprint = parseInt(new_arr[0].wip_count);
				var cycletimeoflastclosedsprint = parseInt(new_arr[0].cycle_time);
				var allbugcount = [];
				var allleadtime = [];
				var allvelocity = [];
				var allwiplength = [];
				var allcycletime = [];
				var sprintsbugcount = [];
				var sprintsvelocity = [];
				var sprintsleadtime = [];
				var sprintwiplength = [];
				var sprintcycletime = [];
				
				async.forEach(result, function (item, cb){ 
					if(item.state == "closed"){
						//Now calculate average leadtime of closed sprints
						//console.log("item.lead_time");
						allbugcount.push(parseInt(item.bug_count));
						allleadtime.push(parseInt(item.lead_time));
						allvelocity.push(parseInt(item.velocity));
						allwiplength.push(parseInt(item.wip_count));
						allcycletime.push(parseInt(item.cycle_time));
						if(item.avgindex == 1) {
							sprintsbugcount.push({"sprintname":item.sprint_name, "bug_count":item.bug_count});
							sprintsvelocity.push({"sprintname":item.sprint_name, "velocity":item.velocity});
							sprintsleadtime.push({"sprintname":item.sprint_name, "lead_time":item.lead_time});
							sprintwiplength.push({"sprintname":item.sprint_name, "wip_count":item.wip_count});
							sprintcycletime.push({"sprintname":item.sprint_name, "cycle_time":item.cycle_time});
						}
						cb();
					}
				});
				
				var sumofbugcount = allbugcount.reduce(function(a, b) { return a + b; });
				var avgofbugcount = sumofbugcount/(allbugcount.length);
				var gettenpercentofbugcount = ((avgofbugcount/100) * 10);
				var maxBugCountRange = avgofbugcount+gettenpercentofbugcount;
				var minBugCountRange = avgofbugcount-gettenpercentofbugcount;
				var colorBC;
				if(bugcountoflastclosedsprint>=minBugCountRange && bugcountoflastclosedsprint<=maxBugCountRange){
					// blue
					colorBC = 'info';
				} else if(bugcountoflastclosedsprint<minBugCountRange) {
					// red
					colorBC = 'success';
				} else if(bugcountoflastclosedsprint>maxBugCountRange) {
					//green
					colorBC = 'danger';
				}
				
				var sumofleadtimes = allleadtime.reduce(function(a, b) { return a + b; });
				var avgofleadtimes = sumofleadtimes/(allleadtime.length);
				var gettenpercentofleadtime = ((avgofleadtimes/100) * 10);
				var maxLeadtimeRange = avgofleadtimes+gettenpercentofleadtime;
				var minLeadtimeRange = avgofleadtimes-gettenpercentofleadtime;
				var colorLT;
				if(leadtimeoflastclosedsprint>=minLeadtimeRange && leadtimeoflastclosedsprint<=maxLeadtimeRange){
					// blue
					colorLT = 'info';
				} else if(leadtimeoflastclosedsprint<minLeadtimeRange) {
					// red
					colorLT = 'success';
				} else if(leadtimeoflastclosedsprint>maxLeadtimeRange) {
					//green
					colorLT = 'danger';
				}
				
				var sumofcycle_time = allcycletime.reduce(function(a, b) { return a + b; });
				var avgofcycletime = sumofcycle_time/(allcycletime.length);
				var gettenpercentofcycletime = ((avgofcycletime/100) * 10);
				var maxCycleTimeRange = avgofcycletime+gettenpercentofcycletime;
				var minCycleTimeRange = avgofcycletime-gettenpercentofcycletime;
				var colorCT;
				if(cycletimeoflastclosedsprint>=minCycleTimeRange && cycletimeoflastclosedsprint<=maxCycleTimeRange){
					// blue
					colorCT = 'info';
				} else if(cycletimeoflastclosedsprint<minCycleTimeRange) {
					//green
					colorCT= 'success';
				} else if(cycletimeoflastclosedsprint>maxCycleTimeRange) {
					// red
					colorCT = 'danger';
				}
				
				var sumofvelocities = allvelocity.reduce(function(a, b) { return a + b; });
				var avgofvelocities = sumofvelocities/(allvelocity.length);
				var gettenpercentofvelocity = ((avgofvelocities/100) * 10);
				var maxVelocityRange = avgofvelocities+gettenpercentofvelocity;
				var minVelocityRange = avgofvelocities-gettenpercentofvelocity;
				var colorV;
				if(velocityoflastclosedsprint>=minVelocityRange && velocityoflastclosedsprint<=maxVelocityRange){
					// blue
					colorV = 'info';
				} else if(velocityoflastclosedsprint<minVelocityRange) {
					// red
					colorV = 'danger';
				} else if(velocityoflastclosedsprint>maxVelocityRange) {
					//green
					colorV = 'success';
				}

				var sumofwip_count = allwiplength.reduce(function(a, b) { return a + b; });
				var avgofwiplength = sumofwip_count/(allwiplength.length);
				var gettenpercentofwip_length = ((avgofwiplength/100) * 10);
				var maxWipLengthRange = avgofwiplength+gettenpercentofwip_length;
				var minWipLengthRange = avgofwiplength-gettenpercentofwip_length;
				var colorWL;
				if(wiplengthoflastclosedsprint>=minWipLengthRange && wiplengthoflastclosedsprint<=maxWipLengthRange){
					// blue
					colorWL = 'info';
				} else if(wiplengthoflastclosedsprint<minWipLengthRange) {
					// red
					colorWL = 'success';
				} else if(wiplengthoflastclosedsprint>maxWipLengthRange) {
					//green
					colorWL = 'danger';
				}
				
				//Old Implementation
				/*
				var index=0;
				
				async.forEach(result, function (item, cb){ 
					if(item.state == "closed"){
						if(index != 0) {
							//Now calculate average leadtime of closed sprints
							allbugcount.push(parseInt(item.bug_count));
							allleadtime.push(parseInt(item.lead_time));
							allvelocity.push(parseInt(item.velocity));
							allwiplength.push(parseInt(item.wip_count));
							allcycletime.push(parseInt(item.cycle_time));
						}
						if(item.avgindex == 1) {
							sprintsbugcount.push({"sprintname":item.sprint_name, "bug_count":item.bug_count});
							sprintsvelocity.push({"sprintname":item.sprint_name, "velocity":item.velocity});
							sprintsleadtime.push({"sprintname":item.sprint_name, "lead_time":item.lead_time});
							sprintwiplength.push({"sprintname":item.sprint_name, "wip_count":item.wip_count});
							sprintcycletime.push({"sprintname":item.sprint_name, "cycle_time":item.cycle_time});
						}
						index++;
						cb();
					}
				});
				
				var sumofbugcount = allbugcount.reduce(function(a, b) { return a + b; });
				var avgofbugcount = sumofbugcount/(allbugcount.length);
				var gettenpercentofbugcount = ((avgofbugcount/100) * 10);
				var maxBugCountRange = avgofbugcount+gettenpercentofbugcount;
				var minBugCountRange = avgofbugcount-gettenpercentofbugcount;
				var colorBC;
				if(bugcountoflastclosedsprint>=minBugCountRange && bugcountoflastclosedsprint<=maxBugCountRange){
					// blue
					colorBC = 'info';
				} else if(bugcountoflastclosedsprint<minBugCountRange) {
					// red
					var spikeBC = (bugcountoflastclosedsprint<minBugCountRange-bugcountoflastclosedsprint)/100;
					// console.log("Bug Count:"+spikeBC);
					if(spikeBC < 0.5) {
						colorBC = 'success';
					} else {
						colorBC = 'success_spike';
					}
				} else if(bugcountoflastclosedsprint>maxBugCountRange) {
					//green
					var spikeBC = (bugcountoflastclosedsprint-maxBugCountRange)/100;
					// console.log("Bug Count:"+spikeBC);
					if(spikeBC < 0.5) {
						colorBC= 'danger';
					} else {
						colorBC = 'danger_spike';
					}
				}
				
				var sumofleadtimes = allleadtime.reduce(function(a, b) { return a + b; });
				var avgofleadtimes = sumofleadtimes/(allleadtime.length);
				var gettenpercentofleadtime = ((avgofleadtimes/100) * 10);
				var maxLeadtimeRange = avgofleadtimes+gettenpercentofleadtime;
				var minLeadtimeRange = avgofleadtimes-gettenpercentofleadtime;
				var colorLT;
				
				if(leadtimeoflastclosedsprint>=minLeadtimeRange && leadtimeoflastclosedsprint<=maxLeadtimeRange){
					// blue
					colorLT = 'info';
				} else if(leadtimeoflastclosedsprint<minLeadtimeRange) {
					// red
					var spikeLT = (minLeadtimeRange-leadtimeoflastclosedsprint)/100;
					// console.log("Lead Time:"+spikeLT);
					if(spikeLT < 0.5) {
						colorLT = 'success';
					} else {
						colorLT = 'success_spike';
					}
				} else if(leadtimeoflastclosedsprint>maxLeadtimeRange) {
					//green
					var spikeLT = (leadtimeoflastclosedsprint - maxLeadtimeRange)/100;
					// console.log("Lead Time:"+spikeLT);
					if(spikeLT < 0.5) {
						colorLT = 'danger';
					} else {
						colorLT = 'danger_spike';
					}
				}
				
				var sumofcycle_time = allcycletime.reduce(function(a, b) { return a + b; });
				var avgofcycletime = sumofcycle_time/(allcycletime.length);
				var gettenpercentofcycletime = ((avgofcycletime/100) * 10);
				var maxCycleTimeRange = avgofcycletime+gettenpercentofcycletime;
				var minCycleTimeRange = avgofcycletime-gettenpercentofcycletime;
				var colorCT;
				if(cycletimeoflastclosedsprint>=minCycleTimeRange && cycletimeoflastclosedsprint<=maxCycleTimeRange){
					// blue
					colorCT = 'info';
				} else if(cycletimeoflastclosedsprint<minCycleTimeRange) {
					// red
					var spikeCT = (minCycleTimeRange-cycletimeoflastclosedsprint)/100;
					// console.log("Cycle Time:"+spikeCT);
					if(spikeCT < 0.5) {
						colorCT = 'success';
					} else {
						colorCT = 'success_spike';
					}
				} else if(cycletimeoflastclosedsprint>maxCycleTimeRange) {
					//green
					var spikeCT = (cycletimeoflastclosedsprint-maxCycleTimeRange)/100;
					// console.log("Cycle Time:"+spikeCT);
					if(spikeCT < 0.5) {
						colorCT= 'danger';
					} else {
						colorCT = 'danger_spike';
					}
				}				
				
				var sumofvelocities = allvelocity.reduce(function(a, b) { return a + b; });
				var avgofvelocities = sumofvelocities/(allvelocity.length);
				var gettenpercentofvelocity = ((avgofvelocities/100) * 10);
				var maxVelocityRange = avgofvelocities+gettenpercentofvelocity;
				var minVelocityRange = avgofvelocities-gettenpercentofvelocity;
				var colorV;
				if(velocityoflastclosedsprint>=minVelocityRange && velocityoflastclosedsprint<=maxVelocityRange){
					// blue
					colorV = 'info';
				} else if(velocityoflastclosedsprint<minVelocityRange) {
					// red
					var spikeV = (minVelocityRange-velocityoflastclosedsprint)/100;
					// console.log("Velocity:" + spikeV);
					if(spikeV) {
						colorV = 'danger';
					} else {
						colorV = 'danger_spike';
					}
				} else if(velocityoflastclosedsprint>maxVelocityRange) {
					//green
					var spikeV = (velocityoflastclosedsprint-maxVelocityRange)/100;
					// console.log("Velocity:" + spikeV);
					if(spikeV < 0.5) {
						colorV= 'success';
					} else {
						colorV = 'success_spike';
					}
				}

				var sumofwip_count = allwiplength.reduce(function(a, b) { return a + b; });
				var avgofwiplength = sumofwip_count/(allwiplength.length);
				var gettenpercentofwip_length = ((avgofwiplength/100) * 10);
				var maxWipLengthRange = avgofwiplength+gettenpercentofwip_length;
				var minWipLengthRange = avgofwiplength-gettenpercentofwip_length;
				var colorWL;
				if(wiplengthoflastclosedsprint>=minWipLengthRange && wiplengthoflastclosedsprint<=maxWipLengthRange){
					// blue
					colorWL = 'info';
				} else if(wiplengthoflastclosedsprint<minWipLengthRange) {
					// red
					var spikeWL = (minWipLengthRange-wiplengthoflastclosedsprint)/100;
					// console.log("WIP Count:"+spikeWL);
					if(spikeWL < 0.5) {
						colorWL = 'danger';
					} else {
						colorWL = 'danger_spike';
					}
				} else if(wiplengthoflastclosedsprint>maxWipLengthRange) {
					//green
					var spikeWL = (wiplengthoflastclosedsprint-maxWipLengthRange)/100;
					// console.log("WIP Count:"+spikeWL);
					if(spikeWL < 0.5) {
						colorWL= 'success';
					} else {
						colorWL = 'success_spike';
					}
				}
				*/
				
				//End of Old Implementation
				
				//New Implementation
				/*
				//Bug Count
				chauvenetMethod(allbugcount, function(bugTrend, bugRange){
					console.log("Trend : "+bugTrend);
					console.log("Range : " + bugRange);
					console.log("Negative Range : " + (-1)*bugRange);
					if(bugTrend>=(-1)*bugRange && bugTrend<=bugRange){
						// blue
						colorBC = 'info';	
					} else if(bugTrend<(-1)*bugRange) {
						// green
						colorBC = 'success';
					} else if(bugTrend>bugRange) {
						// red
						colorBC= 'danger';
					}
					console.log("Color BC : " + colorBC);
				});
				
				//Lead Time
				chauvenetMethod(allleadtime, function(leadTimeTrend, leadTimeRange){
					console.log("Trend : "+leadTimeTrend);
					console.log("Range : " + leadTimeRange);
					console.log("Negative Range : " + (-1)*leadTimeRange);
					if(leadTimeTrend>=(-1)*leadTimeRange && leadTimeTrend<=leadTimeRange){
						// blue
						colorLT = 'info';	
					} else if(leadTimeTrend<(-1)*leadTimeRange) {
						// red
						colorLT = 'success';
					} else if(leadTimeTrend>leadTimeRange) {
						//green
						colorLT= 'danger';
					}
					console.log("Color LT : " + colorLT);
				});
				
				//Cycle Time
				chauvenetMethod(allcycletime, function(cycleTimeTrend, cycleTimeRange){
					console.log("Trend : "+cycleTimeTrend);
					console.log("Range : " + cycleTimeRange);
					console.log("Negative Range : " + (-1)*cycleTimeRange);
					if(cycleTimeTrend>=(-1)*cycleTimeRange && cycleTimeTrend<=cycleTimeRange){
						// blue
						colorCT = 'info';	
					} else if(cycleTimeTrend<(-1)*cycleTimeRange) {
						// green
						colorCT = 'success';
					} else if(cycleTimeTrend>cycleTimeRange) {
						// red
						colorCT= 'danger';
					}
					console.log("Color CT : " + colorCT);
				}); 
				
				//Velocity 
				chauvenetMethod(allvelocity, function(velocityTrend, velocityRange){
					console.log("Trend : "+velocityTrend);
					console.log("Range : " + velocityRange);
					console.log("Negative Range : " + (-1)*velocityRange);
					if(velocityTrend>=(-1)*velocityRange && velocityTrend<=velocityRange){
						// blue
						colorV = 'info';	
					} else if(velocityTrend<(-1)*velocityRange) {
						// red
						colorV = 'danger';
					} else if(velocityTrend>velocityRange) {
						// green
						colorV= 'success';
					}
					console.log("Color Vel : " + colorV);
				});
				
				//WIP 
				chauvenetMethod(allwiplength, function(wipTrend, wipRange){
					console.log("Trend : "+wipTrend);
					console.log("Range : " + wipRange);
					console.log("Negative Range : " + (-1)*wipRange);
					if(wipTrend>=(-1)*wipRange && wipTrend<=wipRange){
						// blue
						colorWL = 'info';	
					} else if(wipTrend<(-1)*wipRange) {
						// green
						colorWL = 'success';
					} else if(wipTrend>wipRange) {
						// red
						colorWL= 'danger';
					}
					console.log("Color WIP : " + colorWL);
				});
				*/
				//End of New Implementation
				
				callback({"currentBugCount":bugcountoflastclosedsprint, "currentVelocity":velocityoflastclosedsprint, "currentLeadTime":leadtimeoflastclosedsprint, "currentWipLength":wiplengthoflastclosedsprint, "currentCycleTime": cycletimeoflastclosedsprint, /*"AvgBugCount":avgofbugcount, "AvgVelocity":avgofvelocities, "AvgLeadtime":avgofleadtimes, "AvgWipLength":avgofwiplength, "AvgCycleTime": avgofcycletime, */"colorBC": colorBC, "colorLT": colorLT, "colorV":colorV, "colorWIP": colorWL, "colorCT": colorCT, "sprintsbugcount":sprintsbugcount, "velocitygraph":sprintsvelocity, "sprintsleadtime":sprintsleadtime, "sprintswiplength":sprintwiplength, "sprintscycletime":sprintcycletime, "status":true});
			} else {
				callback({"currentBugCount":0, "currentVelocity":0, "currentLeadTime":0,"currentWipLength":0, /*"AvgBugCount":0,"AvgVelocity":0, "AvgLeadtime":0, "AvgWipLength":0,*/ "colorBC": 0, "colorLT": 0, "colorV":0, "colorCT": 0, "sprintsbugcount":0, "velocitygraph":0, "sprintsleadtime":0, "sprintswiplength":0, "status":false});
			} 
		});
	},
	
	
	getTbCalculated: function(product,callback){
		var query1 = "select * from sprint where project_key = '" + product.project_key + "' and state='closed' order by index_sp desc";
		con.query(query1, function(err1, sprintData) {
			if(err1) throw err1;
			var query = "select * from technical_debt where project_key = ? order by index_sp desc";
			con.query(query, [product.project_key], function(err, result) {
				if(err) throw err;
				if((result).length>0){
					var latestefforts = result[0].effort;
					var latestdelta_loc = result[0].delta_loc;
					var latestclosedsprintTB = result[0].violation;
					var alleffort = [];
					var alldeltaloc = [];
					var allTB = [];
					var sprintefforts = [];
					var sprintdelta_loc = [];
					var sprintTB = [];
					
					var latestclosedsprintTB = result[0].violation;
					var allTB = [];
					async.forEach(result, function (item, cb){ 
						if(item.state == "closed"){
							//Now calculate average leadtime of closed sprints
							allTB.push(parseInt(item.violation));
							alleffort.push(parseInt(item.effort));
							alldeltaloc.push(parseInt(item.delta_loc));
							sprintefforts.push({"sprintname":item.sprint_name, "effort":item.effort});
							sprintdelta_loc.push({"sprintname":item.sprint_name, "delta_loc":item.delta_loc});
							sprintTB.push({"sprintname":item.sprint_name, "violation":item.violation});
							cb();
						}
					});
					var sumofTB = allTB.reduce(function(a, b) { return a + b; });
					var avgofTBs = sumofTB/(allTB.length);
					//AYUSHI ********************
				/*	for(var i=0;i<allTB.length;i++){
				   var dataTB=sumofTB.gettdebtvalue;
				   console.log("Technical Debt Value: "+dataTB); 
					}*/
					var gettenpercentofTB = ((avgofTBs/100) * 10);
					var maxTBRange = avgofTBs+gettenpercentofTB;
					var minTBRange = avgofTBs-gettenpercentofTB;					
					var colorTd;
					if(latestclosedsprintTB>=minTBRange && latestclosedsprintTB<=maxTBRange){
						// blue
						colorTd = 'info';
					} else if(latestclosedsprintTB<minTBRange) {
						// green
						colorTd= 'success';
					} else if(latestclosedsprintTB>maxTBRange) {
						// red
						colorTd = 'danger';
					}	
						
					var sumofeffort = alleffort.reduce(function(a, b) { return a + b; });
					var avgofeffort = sumofeffort/(alleffort.length);
					var gettenpercentofeffort = ((avgofeffort/100) * 10);
					var maxEffortRange = avgofeffort+gettenpercentofeffort;
					var minEffortRange = avgofeffort-gettenpercentofeffort;
					var colorEffort;

					if(latestefforts>=minEffortRange && latestefforts<=maxEffortRange){
						// blue
						colorEffort = 'info';
					} else if(latestefforts<minEffortRange) {
						// green
						colorEffort= 'success';
					} else if(latestefforts>maxEffortRange) {
						// red
						colorEffort = 'danger';
					}
					
					var sumofdelta_loc = alldeltaloc.reduce(function(a, b) { return a + b; });
					var avgofdeltaloc = sumofdelta_loc/(alldeltaloc.length);
					var gettenpercentofdeltaloc = ((avgofdeltaloc/100) * 10);
					var maxDeltaLocRange = avgofdeltaloc+gettenpercentofdeltaloc;
					var minDeltaLocRange = avgofdeltaloc-gettenpercentofdeltaloc;
					var colorDeltaLoc; 
					
					if(latestdelta_loc>=minDeltaLocRange && latestdelta_loc<=maxDeltaLocRange){
						// blue
						colorDeltaLoc = 'info';
					} else if(latestdelta_loc<minDeltaLocRange) {
						// green
						colorDeltaLoc= 'success';
					} else if(latestdelta_loc>maxDeltaLocRange) {
						// red
						colorDeltaLoc = 'danger';
					}

					// Old Implementation
					/*
					var index = 0;
					async.forEach(sprintData, function (item1, callback){
						if(index != 0) {						
							async.forEach(result, function (item, callback){ 
								if(item.sprint_name == item1.sprint_name){
									alleffort.push(parseInt(item.effort));
									alldeltaloc.push(parseInt(item.delta_loc));
									allTB.push(parseInt(item.violation));
									sprintefforts.push({"sprintname":item.sprint_name, "effort":item.effort});
									sprintdelta_loc.push({"sprintname":item.sprint_name, "delta_loc":item.delta_loc});
									sprintTB.push({"sprintname":item.sprint_name, "violation":item.violation});
									callback();
								}
							});
						}
						index++;
					});
					
					var sumofTB = allTB.reduce(function(a, b) { return a + b; });
					var avgofTBs = sumofTB/(allTB.length);
					var gettenpercentofTB = ((avgofTBs/100) * 10);
					var maxTBRange = avgofTBs+gettenpercentofTB;
					var minTBRange = avgofTBs-gettenpercentofTB;
					var colorTd;
					if(latestclosedsprintTB>=minTBRange && latestclosedsprintTB<=maxTBRange){
						// blue
						colorTd = 'info';
					} else if(latestclosedsprintTB<minTBRange) {
						// red
						var spikeTD = (minTBRange-latestclosedsprintTB)/100;
						// console.log("Tech Debt:" + spikeTD);
						if(spikeTD < 0.5) {
							colorTd= 'success';
						} else {
							colorTd = 'success_spike';
						}
					} else if(latestclosedsprintTB>maxTBRange) {
						//green
						var spikeTD = (latestclosedsprintTB-maxTBRange)/100;
						// console.log("Tech Debt:" + spikeTD);
						if(spikeTD) {
							colorTd = 'danger';
						} else {
							colorTd = 'danger_spike';
						}
					}	
						
					var sumofeffort = alleffort.reduce(function(a, b) { return a + b; });
					var avgofeffort = sumofeffort/(alleffort.length);
					var gettenpercentofeffort = ((avgofeffort/100) * 10);
					var maxEffortRange = avgofeffort+gettenpercentofeffort;
					var minEffortRange = avgofeffort-gettenpercentofeffort;
					var colorEffort;

					if(latestefforts>=minEffortRange && latestefforts<=maxEffortRange){
						// blue
						colorEffort = 'info';
					} else if(latestefforts<minEffortRange) {
						// red
						var spikeEffort = (minEffortRange-latestefforts)/100;
						// console.log("Effort:" + spikeEffort);
						if(spikeEffort < 0.5) {
							colorEffort= 'success';
						} else {
							colorEffort = 'success_spike';
						}
					} else if(latestefforts>maxEffortRange) {
						//green
						var spikeEffort = (latestefforts-maxEffortRange)/100;
						// console.log("Effort:" + spikeEffort);
						if(spikeEffort) {
							colorEffort = 'danger';
						} else {
							colorEffort = 'danger_spike';
						}
					}
					
					var sumofdelta_loc = alldeltaloc.reduce(function(a, b) { return a + b; });
					var avgofdeltaloc = sumofdelta_loc/(alldeltaloc.length);
					var gettenpercentofdeltaloc = ((avgofdeltaloc/100) * 10);
					var maxDeltaLocRange = avgofdeltaloc+gettenpercentofdeltaloc;
					var minDeltaLocRange = avgofdeltaloc-gettenpercentofdeltaloc;
					var colorDeltaLoc; 
					
					if(latestdelta_loc>=minDeltaLocRange && latestdelta_loc<=maxDeltaLocRange){
						// blue
						colorDeltaLoc = 'info';
					} else if(latestdelta_loc<minDeltaLocRange) {
						// red
						var spikeLOC = (minDeltaLocRange-latestdelta_loc)/100;
						// console.log("LOC:" + spikeLOC);
						if(spikeLOC < 0.5) {
							colorDeltaLoc= 'success';
						} else {
							colorDeltaLoc = 'success_spike';
						}
					} else if(latestdelta_loc>maxDeltaLocRange) {
						//green
						var spikeLOC = (latestdelta_loc-maxDeltaLocRange)/100;
						// console.log("LOC:" + spikeLOC);
						if(spikeLOC) {
							colorDeltaLoc = 'danger';
						} else {
							colorDeltaLoc = 'danger_spike';
						}
					}
					*/
					//End of old Implementation
					
					//New Implementation
					/*
					//Technical Debt
					chauvenetMethod(allTB, function(bugTrend, bugRange){
						console.log("Trend : "+bugTrend);
						console.log("Range : " + bugRange);
						console.log("Negative Range : " + (-1)*bugRange);
						if(bugTrend>=(-1)*bugRange && bugTrend<=bugRange){
							// blue
							colorTd = 'info';	
						} else if(bugTrend<(-1)*bugRange) {
							// green
							colorTd = 'success';
						} else if(bugTrend>bugRange) {
							// red
							colorTd= 'danger';
						}
						console.log("Color Tech Debt : " + colorTd);
					});
					
					//Effort
					chauvenetMethod(alleffort, function(leadTimeTrend, leadTimeRange){
						console.log("Trend : "+leadTimeTrend);
						console.log("Range : " + leadTimeRange);
						console.log("Negative Range : " + (-1)*leadTimeRange);
						if(leadTimeTrend>=(-1)*leadTimeRange && leadTimeTrend<=leadTimeRange){
							// blue
							colorEffort = 'info';	
						} else if(leadTimeTrend<(-1)*leadTimeRange) {
							// green
							colorEffort = 'success';
						} else if(leadTimeTrend>leadTimeRange) {
							//red
							colorEffort= 'danger';
						}
						console.log("Color Effort : " + colorEffort);
					});
					
					//Delta LOC
					chauvenetMethod(alldeltaloc, function(cycleTimeTrend, cycleTimeRange){
						console.log("Trend : "+cycleTimeTrend);
						console.log("Range : " + cycleTimeRange);
						console.log("Negative Range : " + (-1)*cycleTimeRange);
						if(cycleTimeTrend>=(-1)*cycleTimeRange && cycleTimeTrend<=cycleTimeRange){
							// blue
							colorDeltaLoc = 'info';	
						} else if(cycleTimeTrend<(-1)*cycleTimeRange) {
							// green
							colorDeltaLoc = 'success';
						} else if(cycleTimeTrend>cycleTimeRange) {
							//red
							colorDeltaLoc= 'danger';
						}
						console.log("Color CT : " + colorDeltaLoc);
					}); 
					*/
					//End of New Implementation
					
					callback({"currentTd": latestclosedsprintTB, "effort":(parseInt(latestefforts)/60).toFixed(2),  "delta_loc":latestdelta_loc, "colorTd": colorTd, "colorEffort":colorEffort,  "colorDeltaLoc":colorDeltaLoc, "allTB" : allTB, "alleffort" : alleffort, "alldeltaloc" : alldeltaloc, "sprintTB" : sprintTB, "sprintefforts": sprintefforts, "sprintdelta_loc": sprintdelta_loc}); 
				}
			});
		});
	},
	
	/*
	getLeadTimeCalculated: function(product,callback){
			var query = "select * from sprint where prodKey = '"+product.project_key+"' ALLOW FILTERING";
			
			client.execute(query, function(err, result) {
				if(err) throw err;
				if(result.rows[0]) {
					var values = JSON.parse(result.rows[0].sprintjson).values;
					var avgclosedsprints = [];
					//var lastelement  = values.slice(-1)[0];
					//var secondlastelement  = values.slice(-2)[0];

					var lastestclosedsprint = [];
					for(var i=(values.length-1); i>=0; i--){
						if(values[i].state=="closed"){
							console.log(values[i].id);
						}
						if(lastestclosedsprint.length==0 && values[i].state=="closed") {
							lastestclosedsprint.push(values[i]);
						}
					}
					var lastelement = lastestclosedsprint[0];







					//get last leadtime
					var leadtimecurrent = (moment(lastelement.deploymentdate).diff(moment(lastelement.startDate), 'days', true));
					//console.log(leadtimecurrent);
					var technicaldebtcurrent = (lastelement.technical_debt);
					var leadtimeall = [];
					var technical_debtall = [];
					for(i=0;i<(values).length;i++){
						var startat = moment(values[i].startDate).format("YYYY-MM-DD HH:mm:ss");
						var endat = moment(values[i].endDate).format("YYYY-MM-DD HH:mm:ss");
						var currentdt = new moment().format("YYYY-MM-DD HH:mm:ss");
						////////////console.log("Totao SPrint  = " + values.length);
						if(values[i].state=="active"){
							//////console.log(endat+'----------'+startat);
							var leadtime = (moment(endat).diff(moment(startat), 'days', true));
							var activesprintsp = values[i].storypoints;
						} else if(values[i].state=="closed") {
							avgclosedsprints.push(values[i].storypoints);
							var leadtimeprevious = (moment(values[i].deploymentdate).diff(moment(values[i].startDate), 'days', true));
							leadtimeall.push(leadtimeprevious);
							technical_debtall.push(values[i].technical_debt);
						}
					}
					var sum1 = leadtimeall.reduce(function(a, b) { return a + b; });
					var avg1 = sum1 / leadtimeall.length;
					//console.log(avg1);
					var gettenpercentofleadtime = ((avg1/100) * 10);
					
					var maxrange = parseFloat(avg1)+parseFloat(gettenpercentofleadtime);
					var minrange = parseFloat(avg1)-parseFloat(gettenpercentofleadtime);
					
					
					
					if(leadtimecurrent>=minrange && leadtimecurrent<=maxrange){
						// blue
						var color = 'info';
					} else if(leadtimecurrent<minrange) {
						// red
						var color = 'success';
					} else if(leadtimecurrent>maxrange) {
						//green
						var color = 'danger';
					}
					
					
					
					
					var sum2 = technical_debtall.reduce(function(a, b) { return a + b; });
					var avg2 = sum2 / technical_debtall.length;
					//console.log(avg2);
					var gettenpercentoftb = ((avg1/100) * 10);
					
					var maxrangetb = parseFloat(avg2)+parseFloat(gettenpercentoftb);
					var minrangetb = parseFloat(avg2)-parseFloat(gettenpercentoftb);
					
					
					
					if(technicaldebtcurrent>=minrangetb && technicaldebtcurrent<=maxrangetb){
						// blue
						var colortb = 'info';
					} else if(leadtimecurrent<minrange) {
						// red
						var colortb = 'success';
					} else if(leadtimecurrent>maxrange) {
						//green
						var colortb = 'danger';
					}
					
					
					
					console.log("technicaldebtcurrent = "+technicaldebtcurrent);
					
					

					
					
					
					
					
					
					
					
					
					
					
					
					
					
					//calculate closed sprints average
					if(avgclosedsprints.length>0){
						var average = (avgclosedsprints.reduce((a, b) => parseInt(a) + parseInt(b), 0))/avgclosedsprints.length;
					} else {
						var average = 0;
					}
					 // Calculate Deviation start 
					if(average>0){
						var subsandsquare = [];
						for(i=0;i<(avgclosedsprints).length;i++){
							var mean = parseInt(avgclosedsprints[i]) - parseFloat(average);
							subsandsquare.push(mean * mean);
						}
						var d = parseFloat((subsandsquare.reduce((a, b) => parseInt(a) + parseInt(b), 0))/subsandsquare.length);
						var deviation = (Math.sqrt(d).toFixed(2));
					} else {
						var deviation = 0;
					}
					// Calculate Deviation End
				callback({"product":product, "leadtime":parseFloat(leadtime).toFixed(2), "closedsprintsAverageVelocity": parseFloat(average).toFixed(2), "closedsprints":avgclosedsprints, "activesprintsp":activesprintsp, "deviation":deviation, "leadtimecurrent":parseFloat(leadtimecurrent).toFixed(2), "leadtimecolor":color, "averageofleadtime":avg1, "technicaldebtcurrent":technicaldebtcurrent, "alltechnicaldebtavg":avg2, "colortb":colortb});						
				} else {
					callback({"product":product, "leadtime":"", "closedsprintssp": 0, "closedsprints":[], "activesprintsp":0, "deviation":deviation});
				}
			});			
	},
	*/
	resolvepromise: function(obj){
		return new Promise(function(resolve, reject) {
			resolve(obj);
		});
	},
	
	getcountrydatafrommongo: function(){
		return new Promise(function(resolve, reject) {
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db("stp_db");
				dbo.collection("countries").find().toArray(function(err, result) {
					if (err) throw err;
					resolve(result);
					db.close();
				});
			}); 
		});
	},
	
	getproductdatafrommongo: function(){
		return new Promise(function(resolve, reject) {
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db("stp_db");
				dbo.collection("products").find().toArray(function(err, result) {
					if (err) throw err;
					resolve(result);
					db.close();
				});
			}); 
		});
	},
	
	insertintocassandra: function(object, callback1){
		async.forEach(object, function (item, callback){ 
			var query = "insert into countries(id, country_code,country_name) values(?,?,?)";
			con.query(query, [TimeUuid.now(), item.country_code, item.country_name], function(err, result) {
				if(err) throw err;
				callback();
			});
			}, function() {
				callback1('inserted');
		});
	},
	
	insertprointocassandra: function(object, callback1){
		async.forEach(object, function (item, callback){ 
			var query = "insert into products(id,class,organization,jiraboardname,methodology,productkey,productname) values(?,?,?,?,?,?,?)";
			con.query(query, [TimeUuid.now(), item._class, "defaultOrganization", item.jiraBoardName, item.methodology, item.productKey, item.productName], function(err, result) {
				if(err) throw err;
				callback();
			});
			}, function() {
				callback1('inserted');
		});
	},
	
	inserttechdebt: function(object){
		return new Promise(function(resolve, reject) {
			var query = "insert into technical_debt(id,projectname,totalissues,technicaldebt, loc_changed) values(?,?,?,?,?)";
				con.query(query, [TimeUuid.now(),object.component.name, object.component.measures[1].value, object.component.measures[2].value, object.component.measures[0].value],{ prepare : true }, function(err, result) {
					if(err) throw err;
					resolve('done');
			});
		});
	},
	
	gettechnicaldebt: function(key){
		return new Promise(function(resolve, reject) {
			request.get('http://172.16.151.62:8090/technical_debt?jiraStoryKey='+key, function (error, response, body) {
				if(error) reject(error);
				resolve(body);
			});
		});
	},
	
	getTechnicalDebtForCSV: function(sprint_id, cb){
		var query = "select * from technical_debt where sprint_id = "+sprint_id;
		con.query(query, function(err, result) {
			if(err) throw err;
			cb(result);
		});
	},
	
	updateUserConfiguration: (id, userid, cb)=>{
		var qin = "insert into tbl_users_configurations(user_id, tbl_configuration_options_id) values(?, ?)";
		//console.log(qin);
		con.query(qin, [userid, id], function(err1, result1) {
			if(err1) throw err1;
			cb(result1.insertId);
		});	
	},
	
	deleteUserConfiguration : (userid)=>{
		return new Promise(function(resolve, reject) {
			/*var qin = "delete from tbl_users_configurations where user_id = ?";
			con.query(qin, [userid], function(err1, result1) {
				if(err1) throw err1;
				resolve(result1);
			});*/
			if (userid == undefined) {
				//console.log("Config does not exist");
				resolve("null");
			} else {
				//console.log("Config exists");
				var qin = "delete from tbl_users_configurations where id = " + userid;
				//console.log(qin);
				con.query(qin, function(err1, result1) {
					if(err1) throw err1;
					resolve(result1.insertId);
				});
			}
		});
	},
	
	getUserMenus: (userid)=>{
		return new Promise(function(resolve, reject) {
			var qin = "select user_menus.*, REPLACE(menus.menu_name,' ','_') as menu_name from user_menus inner join menus ON menus.id = user_menus.menu_id where user_menus.user_id = ? order by user_menus.timestamp_insert ASC";
			con.query(qin, [userid], function(err1, result1) {
				if(err1) throw err1;
				resolve(result1);
			});
		});
	},
	
	getProjectList: (organization_name)=>{
		return new Promise(function(resolve, reject) {
			var qin = "select * from project where organization = ?";
			con.query(qin, [organization_name], function(err1, result1) {
				if(err1) throw err1;
				resolve(result1);
			});
		});
	},
	
	savePipeLine: (params, cb)=>{
		var qin = "";
		if(params.flatuform.id!==undefined){
			//edit case
			qin = "update faketable set dcuttt = ?, dcutwt = ?, dqatt = ?, dqawt = ?, integrationenvtt = ?, integrationenvwt = ?, recruitmenttt = ?, recruitmentwt = ?, scadevcovtt = ?, scadevcovwt = ?, tollgatett = ?, tollgatewt = ? where id = ?";
			con.query(qin, [params.flatuform.dcuttt, params.flatuform.dcutwt, params.flatuform.dqatt, params.flatuform.dqawt, params.flatuform.integrationenvtt, params.flatuform.integrationenvwt, params.flatuform.recruitmenttt, params.flatuform.recruitmentwt, params.flatuform.scadevcovtt, params.flatuform.scadevcovwt, params.flatuform.tollgatett, params.flatuform.tollgatewt, params.project_key, params.sprint_id], function(err, result) {
				if(err) throw err;
				cb(true);
			});
		} else {
			//add case
			qin = "insert into faketable(dcuttt, dcutwt, dqatt, dqawt, integrationenvtt, integrationenvwt, recruitmenttt, recruitmentwt, scadevcovtt, scadevcovwt, tollgatett, tollgatewt, project_key, sprint_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
			con.query(qin, [params.flatuform.dcuttt, params.flatuform.dcutwt, params.flatuform.dqatt, params.flatuform.dqawt, params.flatuform.integrationenvtt, params.flatuform.integrationenvwt, params.flatuform.recruitmenttt, params.flatuform.recruitmentwt, params.flatuform.scadevcovtt, params.flatuform.scadevcovwt, params.flatuform.tollgatett, params.flatuform.tollgatewt, params.project_key, params.sprint_id], function(err, result) {
				if(err) throw err;
				cb(true);
			});
		}
		
	},
	
	githubRepository: function(cb){
		request.get('https://api.github.com/gists', function (error, response, body) {
			if(error) cb('bhak be');
			cb(body);
		});
	},
}

function gettdissues(p_id, callback){
	var query = "select * from technical_debt where product_id = ?";
	con.query(query, [p_id], function(err, result) {
		if(err) throw err;
		callback(result);
	});
}


function standardDeviation(values, callback){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    callback(sqrDiff);
  });
  
  var avgSquareDiff = average(squareDiffs);
 
  var stdDev = Math.sqrt(avgSquareDiff);
  callback(stdDev);
}
 
function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
 
  var avg = sum / data.length;
  return avg;
}

function getthissprintdeploymentdate(sprintid, cb){
	var query = "select * from sonar_record where sprint_id = ? AND attribute_name = ?";
	con.querycute(query, [sprintid, 'deployment_date'], function(err, result) {
		cb(result[0].attribute_value);
	});
}

function checkDBSprintCount(projectkey, cb){
	var query = "select count(*) as totalrec from sprint where project_key = ?";
	con.query(query, [projectkey], function(err, result) {
		if(err) throw err;
		cb(result);
	});
}

function getDeploymentDateSprintWise(sprintid, startdate){
	var data = [];
	var query = "select * from sonar_record where sprint_id = ? AND attribute_name = ? ";
	con.querycute(query, [sprintid, 'deployment_date'], function(err, result) {
		data.push((moment(result[0].attribute_value).diff(moment(startdate), 'days', true)));
	});
	return data;
}

function getCurrentSprintFromDB123(project_key, cb){
	var query = "select * from sprint where project_key = ? AND index_sp = ?";
	con.query(query, [project_key, '-1'], function(err, result) {
		if(err) throw err;
		cb(result);
	});
}

function getCount(project_key, cb){
	var query = "select count(*) as count from sprint where project_key = ?";
	console.log(query);
	con.query(query, [project_key], function(err, result) {
		if(err) throw err;
		cb(result);
	});
}

function updateLatestSprintNow(id, index_sp, completedate, cb){
	moment.unix(completedate).format("MM/DD/YYYY")
	var query = "update sprint set index_sp = ?, complete_date = ?, state=? where id = ?";
	console.log(query);
	con.query(query, [index_sp, completedate, 'closed', id], function(err, result) {
		if(err) throw err;
		cb('updated');
	});
}

function updateOnlyCompleteDate(complete_date, table_id, cb){
	var query = "update sprint set complete_date = ? where id = ?";
	console.log(query);
	con.query(query, [complete_date,table_id], function(err, result) {
		if(err) throw err;
		cb('updated');
	});
}

function updateStateNIndexSPOfActiveSprint(table_id, index_sp, cb){
	var query = "update sprint set index_sp = ?, state=? where id = ?";
	console.log(query);
	con.query(query, [index_sp,'closed', table_id], function(err, result) {
		if(err) throw err;
		cb('hua update');
	});
}

function sort_by_key_value(arr, key) {
	return _.sortBy(arr, function(item) {
		return String(item[key]).toLowerCase();
	});
}

function deleteAllRecordForThisProjectFromKairosdb(project_key, cb){
	var v = "velocitydemo_"+project_key.replace(/'/g, "\\'");
	request.delete({
		url: 'http://'+process.env.KAIROSDB_IP+':'+process.env.KAIROS_PORT+'/api/v1/metric/'+v,
	}, function (error, response, body) {
		if(error) reject(error);
		var v = "velocityforstandarddeviation_"+project_key.replace(/'/g, "\\'");
		request.delete({
			url: 'http://'+process.env.KAIROSDB_IP+':'+process.env.KAIROS_PORT+'/api/v1/metric/'+v,
		}, function (error, response, body) {
			if(error) reject(error);
			cb(body);
		});
	});
}

function insertAllSprintFirst(recinDB, data, cb){
	if(recinDB==0){
		cb();
	} else {
		if(data.length>0) {
				var uuid = uuidv1();
				//var dataforkairosVelocity = [];
				async.forEach(sprints, function (item, callback){ 
					var ct;
					if(item.sprintCompleteDate!="undefined"){
						ct = item.sprintCompleteDate;
					} else {
						ct = null;
					}
					var et;
					if(item.sprintEndDate!="undefined"){
						et = item.sprintEndDate;
					} else {
						et = null;
					}
					var sdts;
					if(item.sprintStartDateTS!="undefined"){
						sdts = item.sprintStartDateTS;
					} else {
						sdts = null;
					}
					var cdts;
					if(item.sprintCompleteDateTS!="undefined"){
						cdts = item.sprintCompleteDateTS;
					} else {
						cdts = null;
					}
					var edts;
					if(item.sprintEndDateTS!="undefined"){
						edts = item.sprintEndDateTS;
					} else {
						edts = null;
					}
					var sortIndex;
					if(item.sortIndex!="undefined") {
						sortIndex = item.sortIndex;
					} else {
						sortIndex = null;
					}
					var avgIndex ;
					if(item.avgIndex!="undefined") {
						avgIndex = item.avgIndex;
					} else {
						avgIndex = null;
					}
					var inserted_ts = moment.utc().valueOf();
					var bugcount = null;
					var cycletime = null;
					//var technicalDebtEffortInHours = null;
					var wipQueueLength = null;
					var sprintVelocity = null;
					var leadTime = null;
					//var technicalDebtViolationDensity = null;
					//console.log("item.id = "+item.id);
					getEntitiesofSprints(pk.replace(/'/g, "\\'"), item.id, function(data1){
						var data = data1[0][0];
						//console.log("data");
						//console.log(data);
						if(data!="none") {
							bugcount = data.bugCount;
							cycletime = data.cycleTime;
							//technicalDebtEffortInHours = data.technicalDebtEffortInHours;
							wipQueueLength = data.wipQueueLength;
							sprintVelocity = data.sprintVelocity;
							leadTime = data.leadTime;
							//technicalDebtViolationDensity = data.technicalDebtViolationDensity;
						}
						var q = "insert into sprint(id, avgindex, index_sp, sprint_id, bug_count, complete_date, cycle_time, end_date, inserted_ts, lead_time, project_id, project_key, sprint_name, start_date, state, velocity, wip_count, sprintstartdatets, sprintenddatets, sprintcompletedatets) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
						log.info(q);

						client.query(q, [uuidv1(), avgIndex, sortIndex, item.id, bugcount, ct, cycletime, et, inserted_ts, leadTime, uuid, pk.replace(/'/g, "\\'"), (item.sprintName).replace(/'/g, "\\'"), item.sprintStartDate, item.state, sprintVelocity, wipQueueLength, sdts, edts, cdts], function(err, result) {
							////console.log(result);
						});
					});
					callback();
				}, function() {
					cb();
				});
			}

	}
}

function getEntitiesofSprints(pk, sprint_id, cb){
	//log.info(process.env.JAVA_APIS_BASE_URL+'getSprintDetailFromSprintId?projectKey='+pk+'&sprintID='+sprint_id);
	request.get(process.env.JAVA_APIS_BASE_URL+'getSprintDetailFromSprintId?projectKey='+pk+'&sprintID='+sprint_id, function (error, response, body) {
		log.info("sprint_id:" + sprint_id);
		log.info(body);
		var body1 = JSON.parse(body);
		cb(body1);
	});
}

function getDataFromAPIforsamesprint(sprint_id, project_key, cb){
	request.get(process.env.JAVA_APIS_BASE_URL+'getSprintDetailFromJira?projetKey='+project_key+'&sprintID='+sprint_id, function (error, response, body) {
		var body1 = JSON.parse(body);
		cb(body1);
	});
}

function getNowLatestSprint(project_key, cb){
	request.get(process.env.JAVA_APIS_BASE_URL+'getJiraSprintsForProject?projetKey='+project_key, function (error, response, body) {
		var body1 = JSON.parse(body);
		console.log(body1[0]);
		cb(body1);
	});
}

function chauvenetMethod(data, cb) {
	var avg = 0, filteredAvg = 0, stdDev = 0, chauvenetArray = [], filteredArray = [], trimmedArray = [], trendCounter = 0, filterValue = 0.2;
	console.log(data);
	console.log("Data Length : " + data.length);
	avg = math.mean(data);
	console.log("Average : "+avg);
	stdDev = math.std(data);
	//console.log("Std Dev : "+stdDev);
	async.forEach(data, function (item, callback){ 
		chauvenetArray.push(math.abs(item-avg)/stdDev);
		callback();
	}, function() {
		//console.log("chauvenetArray");
		console.log(chauvenetArray);
		let index = 0;
		async.forEach(chauvenetArray, function (chauvenetItem, chauvenetCallback){ 
			if(chauvenetItem <= 1) {
				filteredArray.push(data[index]);
			}
			index++;
			chauvenetCallback();
		}, function() {
			//console.log("filteredArray");
			console.log(filteredArray);
			console.log("filteredArray.length: "+ filteredArray.length);
			filteredAvg = math.mean(filteredArray);
			console.log("filteredAvg: " + filteredAvg);
			/*for(index = (filteredArray.length-1); index >= (filteredArray.length - 7); index--) {
				trimmedArray.push(filteredArray[index]);
			}
			console.log("trimmedArray");
			console.log(trimmedArray);
			var trimmedAvg = math.mean(trimmedAvg);
			console.log("trimmedAvg: "  + trimmedAvg);*/
			async.forEach(filteredArray, function (filteredItem, filteredCallback){ 
				if(filteredItem >= filteredAvg) {
					trendCounter += 1;
				} else {
					trendCounter -= 1;
				}
				filteredCallback();
			}, function() {
				var range = filterValue * filteredArray.length;
				cb(trendCounter, math.round(range));
			});
		});
	});
}