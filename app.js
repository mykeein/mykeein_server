var express = require('express')
, fs = require('fs')
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
var domain = config.domain || '';

if(config.ssl){
	console.log('ssl is on');
	// if(fs.existsSync(config.rootPath+'/ssl/server.key')
	// 	&&fs.existsSync(config.rootPath+'/ssl/mykeein.pem')
	// 	&&fs.existsSync(config.rootPath+'/ssl/27e952219855a0.crt')
	// 	&&fs.existsSync(config.rootPath+'/ssl/gd_bundle-g2-g1.crt')){
	// 	var httpsOptions = {
	// 		key:fs.readFileSync(config.rootPath+'/ssl/server.key'),
	// 		cert:fs.readFileSync(config.rootPath+'/ssl/mykeein.pem'),
	// 		ca:[ fs.readFileSync(config.rootPath+'/ssl/27e952219855a0.crt'), fs.readFileSync(config.rootPath+'/ssl/gd_bundle-g2-g1.crt') ]
	// 	};
	// 	https.createServer(httpsOptions, app).listen(443);
	// 	console.log('SSL Keiin server started on domain:'+domain+' , port:'+443);
	// }	
	var options = {
  		key: fs.readFileSync('./ssl/server.key'),
  		cert: fs.readFileSync('./ssl/27e952219855a0.crt')
	};

	https.createServer(options, function (req, res) {
  		res.writeHead(200);
  		res.end("hello world\n");
	}).listen(443);
}

app.listen(port);
console.log('Keiin server started on domain:'+domain+' , port:'+port);

exports = module.exports = app;
