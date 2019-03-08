var express = require('express');
var about = express.Router();
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['172.16.13.167'], keyspace: 'devopsdb' });



about.get('/', function(req, res, next) {
  res.send({"txt":"first"});
});
/*
about.get('/sid', function(req, res, next) {
  res.send({"txt":"second"});
});

about.get('/mid', function(req, res, next) {
	client.execute("select * from products", function(err, result) {
		var rows = result.rows;
		var products = rows, metricsData = [];
		if (prodId && metrics && productData) {
			metricsData = constructJSONStructure(productData, metrics, metricsData);
		}
		res.send(rows);
	});
});
*/
module.exports = about;
