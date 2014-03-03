var mongoose = require('mongoose')
, Request = mongoose.model('Request')
, User = mongoose.model('User')
, Types = mongoose.Types
var notify = require('push-notify');
var gcm = new notify.gcm.Sender({
	key: 'AIzaSyB0tSJb5BnExTvKus98IId0aVQTiam-IOg',
	retries: 5
});
gcm.on('transmitted', function(m) {
	console.log("gcm on transmitted - "+m);
});

gcm.on('transmissionError', function(err) {
	console.log("gcm on transmissionError - "+err);
});

//(1 * 60 * 1000 = min)
var cleanInterval = 10 * 60 * 1000; 
var oldInterval = 10 * 60 * 1000;
var date = new Date(new Date().getTime()-oldInterval);
var nowTime = new Date().getTime();
function cleanJob(){
	setInterval(function() {
		removeOldRequests();
	}, cleanInterval);
}

function removeOldRequests(){
	nowTime = new Date().getTime();
	date = new Date(nowTime-oldInterval);
	console.log("Clean older than date:"+date.toString());
	Request.remove({ updated:{ $lt:date } },
		function(err){
			if (err) 
				console.log('destroy request failed. err:'+err);
			cleanJob();
		});
}

cleanJob();

exports.request = function(req, res, next){
	var ip = req.connection.remoteAddress;
	var username = req.params.username;
	Request.find(
		{ ip:ip, username:username, "requestData.dataType":Request.dataType.block },function(err,requests){
			if (err) {
				return next(err);
			}
			if(requests!=null && requests.length>0){	
				var ans = { status:'block', data:requests[0] };
				return res.jsonp(ans);
			}else{
				User.findOne(
					{ username:username },
					function(err,user){
						if (err) {
							return next(err);
						}
						if(user==null){
							var ans = { status:'notexist',data:request };
							return res.jsonp(ans);
						} 
						if(user.registerId==null){
							var ans = { status:'notregistered',data:request };
							return res.jsonp(ans);
						}
						var request = new Request({
							ip:ip,
							username:username,
							requestData:{ dataType:Request.dataType.open }
						});
						request.save(function (err,request) {
							if (err){
								return next(err);
							}
							gcm.send({
								registrationId: user.registerId,
								collapseKey: 'data request',
								delayWhileIdle: true,
								timeToLive: 1800,
								data: request
							});
							var ans = { status:'success',data:request };
							return res.jsonp(ans);
						});

					});
			}
		});
};

exports.loadMyRequests = function(req, res, next){
	var username = req.body.username;
	Request.find(
		{ username:username,
			$or: [ 
			{ "requestData.dataType":Request.dataType.open }, 
			{ "requestData.dataType":Request.dataType.warn } 
			] 
		},function(err,requests){
			if (err) {
				return next(err);
			}
			return res.jsonp(requests);
		});
};

exports.blockIp = function(req, res, next){
	var username = req.body.username;
	var registerId = req.body.registerId;
	var requestId = req.body.requestId;
	User.findOne(
		{ username:username , registerId:registerId },
		function(err,user){
			if (err) {
				return next(err);
			}
			if(user==null){
				return next(new Error("not exists user{username:"+username+" , registerId:"+registerId+" }"));
			} 
			Request.findOne(
				{ _id:requestId },
				function(err,request){
					if (err) {
						return next(err);
					}
					if (request==null) {
						return next(err);
					}
					request.updated = new Date();
					request.responded = true;
					request.requestData.dataType = Request.dataType.block;
					request.save(function(err,request){
						if (err) {
							return next(err);
						}
						return res.jsonp({ status:'success' });
					});
				});
		});
};

exports.warnIp = function(req, res, next){	
	var username = req.body.username;
	var registerId = req.body.registerId;
	var requestId = req.body.requestId;
	User.findOne(
		{ username:username , registerId:registerId },
		function(err,user){
			if (err) {
				return next(err);
			}
			if(user==null){
				return next(new Error("not exists user{username:"+username+" , registerId:"+registerId+" }"));
			} 
			Request.findOne(
				{ _id:requestId },
				function(err,request){
					if (err) {
						return next(err);
					}
					if (request==null) {
						return next(err);
					}
					request.updated = new Date();
					request.responded = true;
					request.requestData.dataType = Request.dataType.warn;
					request.save(function(err,request){
						if (err) {
							return next(err);
						}
						return res.jsonp({ status:'success' });
					});
				});
		});
};

exports.sendToIp = function(req, res, next){
	var username = req.body.username;
	var registerId = req.body.registerId;
	var requestId = req.body.requestId;
	var data = req.body.data;
	User.findOne(
		{ username:username , registerId:registerId },
		function(err,user){
			if (err) {
				return next(err);
			}
			if(user==null){
				return next(new Error("not exists user{username:"+username+" , registerId:"+registerId+" }"));
			} 
			Request.findOne(
				{ _id:requestId },
				function(err,request){
					if (err) {
						return next(err);
					}
					if (request==null) {
						return next(err);
					}
					request.updated = new Date();
					request.responded = true;
					request.requestData.dataType = Request.dataType.response;
					request.requestData.content = data;
					request.save(function(err,request){
						if (err) {
							return next(err);
						}
						return res.jsonp({ status:'success' });
					});
				});
		});
};

exports.responseCheck = function(req, res, next){
	var ip = req.connection.remoteAddress;
	var requestId = req.body.requestId;
	Request.findOne(
		{ _id:requestId, responded:true, ip:ip },
		function(err,request){
			if (err) {
				return next(err);
			}
			if(request==null){
				return res.jsonp({ status:'wait' });
			}else{
				var ans = { status:'success', data:request };
				if(request.requestData.dataType == Request.dataType.response){
					Request.remove({ _id:requestId },
						function(err){
							if (err) 
								console.log('destroy request failed. err:'+err);
						});
				}
				return res.jsonp(ans);
			}
		});
};