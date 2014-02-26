var express = require('express')
, fs = require('fs')
, https = require('https');

var env = process.env.NODE_ENV || 'development'
, config = require('./config/config')[env]
, mongoose = require('mongoose')

if (!env || 
	(env!='development' && env!='production')){
	err = 'Please set NODE_ENV to development/production. '
+'(in windows you can just write in a terminal "set NODE_ENV=development")';
throw err
}else{
	console.log('configuration '+env+' loaded.')
}

mongoose.connect(config.db)
mongoose.connection.on('error',function(err){
	throw err
})

var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path+'/'+file)
})

var app = express()
require('./config/express')(app, config)
require('./config/routes')(app)

var port = config.port || 3000
var domain = config.domain || ''

if(fs.existsSync('ssl/server.key')
	&&fs.existsSync('ssl/mykeein.pem')
	&&fs.existsSync('ssl/27e952219855a0.crt')
	&&fs.existsSync('ssl/gd_bundle-g2-g1.crt')){
	var options = {
		key:fs.readFileSync('ssl/server.key'),
		cert:fs.readFileSync('ssl/server.crt'),
		ca:[fs.readFileSync('ssl/27e952219855a0.crt'), fs.readFileSync('ssl/gd_bundle-g2-g1.crt')],
		requestCert:        true,
		rejectUnauthorized: false
	};

	https.createServer(options, function (req, res) {
		if (req.client.authorized) {
			res.writeHead(200, {&quot;Content-Type&quot;: &quot;application/json&quot;});
			res.end('{&quot;status&quot;:&quot;approved&quot;}');
		} else {
			res.writeHead(401, {&quot;Content-Type&quot;: &quot;application/json&quot;});
			res.end('{&quot;status&quot;:&quot;denied&quot;}');
		}
	}).listen(443);
}

app.listen(port)
console.log('Keiin server started on domain:'+domain+' , port:'+port)

exports = module.exports = app
