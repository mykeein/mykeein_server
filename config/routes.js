module.exports = function (app) {

	var user = require('../app/controllers/users');
	app.post('/api/user/new', user.newUser);
	app.post('/api/user/updateregisterid', user.updateRegisterId);
	app.post('/api/user/updateemail', user.updateEmail);
	app.post('/api/user/check', user.check);
	var requests = require('../app/controllers/requests');
	app.post('/api/requests/load', requests.loadMyRequests);
	app.post('/api/requests/block', requests.blockIp);
	app.post('/api/requests/warn', requests.warnIp);
	app.post('/api/requests/warnall', requests.warnAllIp);
	app.post('/api/requests/send', requests.sendToIp);
	app.post('/api/requests/check', requests.responseCheck);
	app.post('/api/requests/:email', requests.request);
	app.get('/approve/:approveId', user.approve);
	app.get('/:email',function(req, res) {
		res.redirect('/#!/'+req.params.email);
	});
};
