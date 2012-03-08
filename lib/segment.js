var settings = require('../etc/settings.json');
var cp = require('child_process');

var segment = function(task, cb){
	var text = task.text;
	text = text.replace(/[\s\|"']+/g, '');
	//bin/scws -t 3 -M 3 -i "中华人民共和国" -c utf8 -d ./etc/dict.utf8.xdb
	var cmd = settings.scws.cmd;
	var dict = " -I -d " + settings.scws.dict;
	var input = ' -i ' + text;
	var multi = '';
	if(task.multi){
		multi = " -M " + task.multi;	
	}

	if(!task.top){
		task.top = text.length;
	}
	var top = " -t " + task.top;
	var rule = " -r " + settings.scws.rule;
	var charset = " -c utf8";

	cmd += dict + top + rule + multi + charset + input;
	var child = cp.exec(cmd, function(err, result){
		if(err){
			cb(err);
			return;
		}
		var json = toJson(result);
		cb(null, json);
	});
}

/*

No. WordString               Attr  Weight(times)
-------------------------------------------------
01. 字符集                n     7.82(1)
02. 词典                   n     5.50(1)
*/

var toJson = function(result){
	var a = result.split("\n");
	if(a.length < 3){
		return [];
	}
	var words = [];
	for(var i = 2; i < a.length; i++){
		var m = a[i].match(/\d+\.\s([^\s]+)\s+\w+\s+([\d\.]+)\((\d+)\)/);
		if(!m){
			continue;
		}
		var word = {word:m[1], weight:parseFloat(m[2]),times:parseInt(m[3])};
		words.push(word);
	}
	return words;
}

/*
var text = "纯 PHP 开发的 SCWS 第二版和第三版，仅支持 GBK 字符集，速度较快，推荐在全 PHP 环境中使用，已含专用 xdb 词典一部。";
segment(text , function(){

});
*/

exports.segment = segment;