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

exports.request = function(req, res, next){
	var ip = req.connection.remoteAddress;
	var username = req.params.username;
	User.findOne(
		{ username:username },
		function(err,user){
			if (err) {
				return next(err);
			}
			if(user==null){
				return next(new Error("not exists user{username:"+username+" }"));
			} 
			if(user.registerId==null){
				return next(new Error("user{username:"+username+" } not exists registerId"));
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
};

exports.loadMyRequests = function(req, res, next){
	var username = req.body.username;
	Request.find(
		{ username:username },
		function(err,requests){
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
		{ _id:requestId , responded:true },
		function(err,request){
			if (err) {
				return next(err);
			}
			if(request==null){
				return res.jsonp({ status:'wait' });
			} 
			if(request.ip==ip){
				if(request.requestData.dataType != Request.dataType.warn){
					Request.remove({ _id:request._id },
						function(err){
							if (err) 
								console.log('destroy request failed. err:'+err);
						});
				}
				var ans = { status:'success', data:request };
				return res.jsonp(ans);
			}else{
				return next(new Error("not allowed data request. ip:"+ip+" , requestId:"+requestId));
			}
		});
};