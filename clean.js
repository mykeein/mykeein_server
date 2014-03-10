var mongoose = require('mongoose')
, Request = mongoose.model('Request')

//(1 * 60 * 1000 = min)
var cleanInterval = 10 * 60 * 1000; 
var oldInterval = 10 * 60 * 1000;

function removeOldRequests(){
	var nowTime = new Date().getTime();
	var date = new Date(new Date().getTime()-oldInterval);
	console.log("Clean older than date:"+date.toString());
	Request.remove({ updated:{ $lt:date } },function(err){
		if (err) 
			console.log('destroy request failed. err:'+err);
	});
}

removeOldRequests();