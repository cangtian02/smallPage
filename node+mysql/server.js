var express = require('express');
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	port     : '3306',
	user     : 'root',
	password : 'root',
	database : 'test'
});	

var getApplist = new Promise(function(resolve, reject) {
	connection.connect();
	var selectSql = 'SELECT * FROM test';
	connection.query(selectSql, function (error, result) {
		if (error) {
			reject(error.message);
		}
		resolve(result);
	});
	connection.end();
});

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", "3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/musiclist', function (req, res) {
	console.log(req.query)
	getApplist.then(function(value) {
		var data = {
			ret: 0,
			list: value
		}
		res.end( JSON.stringify(data) );
	}, function(value) {
		var data = {
			ret: 100,
			msg: '服务异常'
		}
		res.end( JSON.stringify(data) );
	});
});

var server = app.listen(8081, function () {
	console.log("应用实例，访问地址为 http://localhost:8081/musiclist");
});
