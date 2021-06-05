var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	port     : '3306',
	user     : 'root',
	password : 'root',
	database : 'cangtian_music'
});

connection.connect();

// 查询
var selectSql = 'SELECT * FROM users';
connection.query(selectSql, function (error, result) {
	if (error) {
		return console.log('[SELECT ERROR] - ',error.message);
	}
	console.log(result);
});

// 添加
// var addSql = 'INSERT INTO `test` (`appid`, `name`, `opid`, `desc`, `ptime`) VALUES (0,?,?,?,?)';
// var timestamp = Date.parse(new Date());
// var addSqlParams = ['红中麻将', '2','红中麻将就是屌', timestamp];
// connection.query(addSql, addSqlParams, function (error, result) {
// 	if (error) {
// 		return console.log('[SELECT ERROR] - ',error.message);
// 	}
// 	console.log(result);
// });

// 修改
// var modSql = 'UPDATE `test` SET `name` = ?,`desc` = ? WHERE (`appid` = ?)';
// var modSqlParams = ['游侠棋牌','游侠棋牌游侠娱乐','5'];
// connection.query(modSql, modSqlParams, function (error, result) {
// 	if (error) {
// 		return console.log('[SELECT ERROR] - ',error.message);
// 	}
// 	console.log(result);
// });

// 删除
// var delSql = 'DELETE FROM `test` WHERE (`appid` = "4")';
// connection.query(delSql, function (error, result) {
// 	if (error) {
// 		return console.log('[SELECT ERROR] - ',error.message);
// 	}
// 	console.log(result);
// });

connection.end();
