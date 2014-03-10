var mongoose = require('mongoose')
, fs = require('fs');
var models_path = __dirname + '/app/models';
console.log('models_path:'+models_path);
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path+'/'+file);
});

var env = process.env.NODE_ENV || 'development'
, config = require('./config/config')[env];

//(1 * 60 * 1000 = 1min)
var oldInterval = 10 * 60 * 1000;

var nowTime = new Date().getTime();
var date = new Date(new Date().getTime()-oldInterval);

function removeOldRequests(){
	console.log("Clean older than date:"+date.toString());
	mongoose.connect(config.db);
	mongoose.connection.on('error',function(err){
		throw err
	});
	Request = mongoose.model('Request');
	Request.remove({ updated:{ $lt:date } },function(err){
		if (err) 
			console.log('destroy request failed. err:'+err);
		mongoose.connection.close();
	});
}

removeOldRequests();