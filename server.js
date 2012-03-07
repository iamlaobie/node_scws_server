var settings = require('./etc/settings');
var express = require('express');
var async = require('async');
var segment = require('./lib/segment').segment;

var je = function(o){
	return JSON.stringify(o);
}
var q = async.queue(function(task, callback){
	segment(task.text, function(err, words){
		if(err){
			task.res.end(je({error:err}));
		}else{
			task.res.end(je({words:words}));
		}

	});
}, settings.server.queueMax);
var app = express.createServer();
app.use(express.bodyParser());
app.post('/segment', function(req, res){
	if(!req.body.text){
		res.end(je({error:'please input the text'}));
		return;
	}
	q.push({res:res, text:req.body.text});
});

app.get('/state', function(req, res){
	res.end("queue length is " + q.length() + "\n");
});

app.listen(settings.server.port);
console.log("server start at " + new Date());
