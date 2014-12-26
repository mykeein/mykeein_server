var fs = require('fs'),
    path = require('path');

var mongoose = require('mongoose')
, Request = mongoose.model('Request')
, Approve = mongoose.model('Approve')
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

var env = process.env.NODE_ENV;
var apn = require('apn');
var serviceIOS = new apn.connection({
	key: __dirname + '/../../ssl/ios-cert/production-key.pem',
	cert: __dirname + '/../../ssl/ios-cert/production-cert.pem',
	gateway: env!=="production"?'gateway.push.apple.com':'gateway.push.apple.com' //'gateway.sandbox.push.apple.com'
});
serviceIOS.on('connected', function() {
    console.log("Connected");
});

serviceIOS.on('transmitted', function(notification, device) {
    console.log("Notification transmitted to:" + device.token.toString('hex'));
});

serviceIOS.on('transmissionError', function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
});

serviceIOS.on('timeout', function () {
    console.log("Connection Timeout");
});

serviceIOS.on('disconnected', function() {
    console.log("Disconnected from APNS");
});

serviceIOS.on('socketError', console.error);

//(60 * 1000 = min)
var cleanInterval = 10 * 60 * 1000; 
var oldRequestInterval = 10 * 60 * 1000;
var oldApproveInterval = 24 * 60 * 60 * 1000;

function cleanJob(){
	setInterval(function() {
		removeOld();
	}, cleanInterval);
}

function removeOld(){
	var dateRequest = new Date(new Date().getTime()-oldRequestInterval);
	Request.remove({ updated:{ $lt:dateRequest } },
		function(err){
			if (err){ 
				console.log('destroy request failed. err:'+err);
			}else{
				console.log("Clean reaquests date:"+dateRequest.toString());
			}
		});
	var dateApprove = new Date(new Date().getTime()-oldApproveInterval);
	Approve.remove({ updated:{ $lt:dateApprove } },
		function(err){
			if (err){ 
				console.log('destroy approve failed. err:'+err);
			}else{
				console.log("Clean approve date:"+dateApprove.toString());
			}
		});
}

cleanJob();

exports.request = function(req, res, next){
	var ip = req.connection.remoteAddress;
	var email = req.params.email;
	Request.find({ ip:ip, email:email, "requestData.dataType":Request.dataType.block },function(err,requests){
		if (err)
			return next(err);
		if(requests!=null && requests.length>0){	
			var ans1 = { status:'block', data:requests[0] };
			return res.jsonp(ans1);
		}else{
			User.findOne({ email:email },function(err,user){
				if (err)
					return next(err);
				if(user!=null){
					var request = new Request({
						ip:ip,
						email:email,
						requestData:{ dataType:Request.dataType.open }
					});
					request.save(function (err,request) {
						if (err)
							return next(err);
						if(user.os==User.os.android){
							gcm.send({
								registrationId: user.registerId,
								collapseKey: 'data request',
								delayWhileIdle: true,
								timeToLive: 1800,
								data: request
							});
						}
						if(user.os==User.os.ios){
							var note = new apn.notification();
							note.setAlertText('request');
							note.setSound('alert.caf');
							console.log('puuuuushing',user.registerId);
							serviceIOS.pushNotification(note, user.registerId);
						}
						var ans4 = { status:'success',data:request };
						return res.jsonp(ans4);
					});
				}else{
					Approve.findOne({ email:email },function(err,approve){
						if (err)
							return next(err);
						if(approve!=null){
							var ans2 = { status:'notregistered' };
							return res.jsonp(ans2);
						}else{
							var ans3 = { status:'notexist' };
							return res.jsonp(ans3);
						}
					});
				}
			});
}
});
};

exports.loadMyRequests = function(req, res, next){
	var email = req.body.email;
	Request.find({
		email:email ,
		"requestData.dataType":Request.dataType.open 
	},function(err,requests){
		if (err) {
			return next(err);
		}
		return res.jsonp(requests);
	});
};

exports.blockIp = function(req, res, next){
	var email = req.body.email;
	var registerId = req.body.registerId;
	var ip = req.body.ip;
	User.findOne({ email:email , registerId:registerId },function(err,user){
		if (err) {
			return next(err);
		}
		if(user==null){
			return next(new Error("not exists user{email:"+email+" , registerId:"+registerId+" }"));
		} 
		var nowDate = new Date();
		Request.update({ ip:ip, email:email, responded:false },{ 
			updated:nowDate, 
			responded:true, 
			"requestData.dataType":Request.dataType.block 
		},{multi: true},function(err,numAffected){
			if (err) {
				console.log('block update request with ip:'+ip+' failed. err:'+err);
				return next(err);
			}
			console.log('block update request with ip:'+ip+' count:'+numAffected);
			return res.jsonp({ status:'success' });
		});
	});
};

exports.warnIp = function(req, res, next){	
	var email = req.body.email;
	var registerId = req.body.registerId;
	var requestId = req.body.requestId;
	User.findOne({ email:email , registerId:registerId },function(err,user){
		if (err) {
			return next(err);
		}
		if(user==null){
			return next(new Error("not exists user{email:"+email+" , registerId:"+registerId+" }"));
		} 
		Request.findOne({ _id:requestId },function(err,request){
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

exports.warnAllIp = function(req, res, next){	
	var email = req.body.email;
	var registerId = req.body.registerId;
	var ip = req.body.ip;
	User.findOne({ email:email , registerId:registerId },function(err,user){
		if (err) {
			return next(err);
		}
		if(user==null){
			return next(new Error("not exists user{email:"+email+" , registerId:"+registerId+" }"));
		} 
		var nowDate = new Date();
		Request.update({ ip:ip, email:email, responded:false },{ 
			updated:nowDate, 
			responded:true, 
			"requestData.dataType":Request.dataType.warn 
		},{multi: true},function(err,numAffected){
			if (err) {
				console.log('warn update request with ip:'+ip+' failed. err:'+err);
				return next(err);
			}
			console.log('warn update request with ip:'+ip+' count:'+numAffected);
			return res.jsonp({ status:'success' });
		});
	});
};

exports.sendToIp = function(req, res, next){
	var email = req.body.email;
	var registerId = req.body.registerId;
	var requestId = req.body.requestId;
	var data = req.body.data;
	User.findOne({ email:email , registerId:registerId },function(err,user){
		if (err) {
			return next(err);
		}
		if(user==null){
			return next(new Error("not exists user{email:"+email+" , registerId:"+registerId+" }"));
		} 
		Request.findOne({ _id:requestId },function(err,request){
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
	Request.findOne({ _id:requestId, responded:true, ip:ip },function(err,request){
		if (err) {
			return next(err);
		}
		if(request==null){
			return res.jsonp({ status:'wait' });
		}else{
			var ans = { status:'success', data:request };
			if(request.requestData.dataType == Request.dataType.response){
				Request.remove({ _id:requestId },function(err){
					if (err) 
						console.log('destroy request failed. err:'+err);
				});
			}
			return res.jsonp(ans);
		}
	});
};