module.exports = function (app, config) {
	if(config.ssl){
		app.get('*',function(req,res){  
    		res.redirect(config.ssldomain+req.url);
		});
	}
	var user = require('../app/controllers/users');
	app.post('/notification/register/new', user.newRegister);
	app.post('/notification/register/username', user.usernameRegister);
	app.post('/notification/register/id', user.idRegister);
	app.post('/notification/register/check', user.checkUsername);

	var requests = require('../app/controllers/requests');
	app.post('/requests/:username', requests.request);
	app.post('/requests/my/load', requests.loadMyRequests);
	app.post('/requests/my/block', requests.blockIp);
	app.post('/requests/my/warn', requests.warnIp);
	app.post('/requests/my/send', requests.sendToIp);
	app.post('/requests/response/check', requests.responseCheck);
};