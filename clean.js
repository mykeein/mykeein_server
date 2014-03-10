var mongoose = require('mongoose')
, Request = mongoose.model('Request')

//(1 * 60 * 1000 = min)
var cleanInterval = 10 * 60 * 1000; 
var oldInterval = 10 * 60 * 1000;

var nowTime = new Date().getTime();
var date = new Date(new Date().getTime()-oldInterval);

function removeOldRequests(){
	console.log("Clean older than date:"+date.toString());
	mongoose.connect(config.db);
	mongoose.connection.on('error',function(err){
		throw err
	});
	Request.remove({ updated:{ $lt:date } },function(err){
		if (err) 
			console.log('destroy request failed. err:'+err);
		mongoose.connection.close();
	});
}

removeOldRequests();