var express = require('express')
, fs = require('fs')
, http = require("http")
, https = require('https');

var env = process.env.NODE_ENV || 'development'
, config = require('./config/config')[env]
, mongoose = require('mongoose');

if (!env || 
	(env!='development' && env!='production')){
	err = 'Please set NODE_ENV to development/production. '
+'(in windows you can just write in a terminal "set NODE_ENV=development")';
throw err;
}else{
	console.log('configuration '+env+' loaded.');
}

mongoose.connect(config.db);
mongoose.connection.on('error',function(err){
	throw err
});

var models_path = __dirname + '/app/models';
console.log('models_path:'+models_path);
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path+'/'+file);
});

var app = express();
require('./config/express')(app, config);
require('./config/routes')(app);

var port = config.port || 3000;
var domain = config.domain || 'http://localhost:3000';

if(config.ssl){
	console.log('ssl is on');
	var options = {
		key: fs.readFileSync('./ssl/server.key'),
		cert: fs.readFileSync('./ssl/27e952219855a0.crt'),
		ca: [fs.readFileSync('./ssl/mykeein.pem')]
	};
	https.createServer(options, app).listen(config.sslport);
	http.createServer(function(req, res){
		res.writeHead(301, {
			'Content-Type': 'text/plain', 
			'Location':'https://'+req.headers.host+req.url
		});
		res.end('Redirecting to SSL\n');
	}).listen(port);
	console.log('SSL MyKeeIn server started on domain:'+config.ssldomain+' , port:'+config.sslport);
}else{
	app.listen(port);
	console.log('MyKeeIn server started on domain:'+domain+' , port:'+port);
}

exports = module.exports = app;
