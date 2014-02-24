var express = require('express')
, fs = require('fs')

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
app.listen(port)
console.log('Keiin server started on domain:'+domain+' , port:'+port)

exports = module.exports = app
