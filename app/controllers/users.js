var mongoose = require('mongoose')
, User = mongoose.model('User')
, Types = mongoose.Types;

exports.newRegister = function (req, res, next) {
  var username = req.body.username;
  var registerId = req.body.registerId;
  User.find(
    { "$or":[ { username:username }, { registerId:registerId } ] },
    function(err,users){
      if (err) {
        return next(err);
      }
      if(users!=null){
        console.log('users.length:'+users.length);
        if(users.length>0){
          return next(new Error("exists user{username:"+username+"}, {registerId:"+registerId+"}"));  
        }
      }
      var newUser = new User({ username:username, registerId:registerId });
      newUser.save(function (err,user) {
        if (err){
          return next(err);
        }
        var ans = { status:'success', data:user };
        return res.jsonp(ans);
      });
    });
};

exports.usernameRegister = function (req, res, next) {
  var newUsername = req.body.newUsername;
  var oldUsername = req.body.oldUsername;
  var registerId = req.body.registerId;
  User.findOne(
    { username:oldUsername , registerId:registerId },
    function(err,user){
      if (err) {
        return next(err);
      }
      if(user!=null){
        user.username = newUsername;
        user.save(function (err,user) {
          if (err){
            return next(err);
          }
          var ans = { status:'success',data:user };
          return res.jsonp(ans);
        });
      }else{
        return next(new Error("not exists user{username:"+oldUsername+"}, {registerId:"+registerId+"}"));
      }
    });
};

exports.idRegister = function (req, res, next) {
  var username = req.body.username;
  var newRegisterId = req.body.newRegisterId;
  var oldRegisterId = req.body.oldRegisterId;
  User.findOne(
    { username:username , registerId:oldRegisterId },
    function(err,user){
      if (err) {
        return next(err);
      }
      if(user!=null){
        user.registerId = newRegisterId;
        user.save(function (err,user) {
          if (err){
            return next(err);
          }
          var ans = { status:'success',data:user };
          return res.jsonp(ans);
        });
      }else{
        return next(new Error("not exists user{username:"+username+"}, {registerId:"+oldRegisterId+"}"));
      }
    });
};

exports.checkUsername = function (req, res, next) {
  var username = req.body.username;
  User.findOne(
    { username:username },
    function(err,user){
      if (err) {
        return next(err);
      }
      if(user==null){
        var ans = { status:'success' };
        return res.jsonp(ans);
      }else{
        var ans = { status:'exist' };
        return res.jsonp(ans);
      }
    });
};
