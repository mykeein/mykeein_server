var mongoose = require('mongoose')
var models_path = __dirname + '/app/models';
console.log('models_path:'+models_path);
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path+'/'+file);
});

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
	Request = mongoose.model('Request');
	Request.remove({ updated:{ $lt:date } },function(err){
		if (err) 
			console.log('destroy request failed. err:'+err);
		mongoose.connection.close();
	});
}

removeOldRequests();