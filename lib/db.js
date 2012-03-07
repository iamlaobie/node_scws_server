var mysql = require('mysql');
var cli, settings;

var db = {
	init:function(configs){
		settings = configs;
		cli = mysql.createClient(settings.mysql);
	},

	getArticle:function(id,  cb){
		var sql = "SELECT * FROM article_content WHERE id = ?";
		cli.query(sql, [id], function(err, result){
			if(err){
				cb(err);
			}else{
				cb(err, result[0]);	
			}
		});
	}
};
exports.db = db;