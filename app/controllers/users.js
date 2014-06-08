var mongoose = require('mongoose')
, User = mongoose.model('User')
, Approve = mongoose.model('Approve')
, Types = mongoose.Types;
var env = process.env.NODE_ENV || 'development'
, config = require('../../config/config')[env]

var nodemailer = require("nodemailer");
var transport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    user: "mykee.in@gmail.com",
    pass: "RaQH0qyW0EmwBBGknfOp"
  }
});

exports.newUser = function (req, res, next) {
  var email = req.body.email;
  var registerId = req.body.registerId;
  var os = req.query.os;
  User.findOne({ email:email , registerId:registerId },function(err,user){
    if (err) {
      return next(err);
    }
    if(user!=null){
      var ans = { status:'success',data:user };
      return res.jsonp(ans);
    }else{
      var newApprove = new Approve({ email:email, registerId:registerId, os:os });
      newApprove.save(function (err,approve) {
        if (err){
          return next(err);
        }
        sendEmailApprove(approve.email,approve._id,res);
      });
    }
  });
};

exports.updateEmail = function (req, res, next) {
  var newEmail = req.body.newEmail;
  var oldEmail = req.body.oldEmail;
  var registerId = req.body.registerId;
  var os = req.query.os;
  User.findOne({ email:newEmail , registerId:registerId },function(err,user){
    if (err) {
      return next(err);
    }
    if(user!=null){
      var ans = { status:'success',data:user };
      return res.jsonp(ans);
    }else{
      var newApprove = new Approve({ email:newEmail, registerId:registerId, os:os });
      newApprove.save(function (err,approve) {
        if (err){
          return next(err);
        }
        sendEmailApprove(approve.email,approve._id,res);
      });
    }
  });
};

exports.updateRegisterId = function (req, res, next) {
  var email = req.body.email;
  var registerId = req.body.registerId;
  var os = req.query.os;
  User.findOne({ email:email },function(err,user){
    if (err) {
      return next(err);
    }
    if(user!=null){
      user.registerId = registerId;
      user.save(function (err,user) {
        if (err){
          return next(err);
        }
        var ans = { status:'success',data:user };
        return res.jsonp(ans);
      });
    }else{
      var newApprove = new Approve({ email:email, registerId:registerId, os:os });
      newApprove.save(function (err,approve) {
        if (err){
          return next(err);
        }
        sendEmailApprove(approve.email,approve._id,res);
      });
    }
  });
};

exports.check = function (req, res, next) {
  var email = req.body.email;
  var registerId = req.body.registerId;
  var os = req.query.os;
  // var ln = req.query.ln;
  // console.log("ln:"+ln)
  User.findOne({ email:email, registerId:registerId },function(err,user){
    if (err) {
      return next(err);
    }
    if(user!=null){
      var ans1 = { status:'success' };
      return res.jsonp(ans1);
    }else{
      Approve.findOne({ email:email, registerId:registerId },function(err,approve){
        if (err) {
          return next(err);
        }
        if(approve!=null){
          var ans2 = { status:'not_approved' };
          return res.jsonp(ans2);
        }else{
          var newApprove = new Approve({ email:email, registerId:registerId, os:os });
          newApprove.save(function (err,approve) {
            if (err){
              return next(err);
            }
            sendEmailApprove(email,approve._id,res);
          });
        }
      });
    }
  });
};

exports.approve = function (req, res, next) {
  var approveId = req.params.approveId;
  if(approveId == null || approveId.length != 24){
    res.status(200).render('approve.html', { state: 'expired. resend approve from mykee.in app again.' });
    return;
  }else{
    Approve.findOne({ _id:approveId },function (err,approve) {
      if (err){
        return next(err);
      }
      if(approve!=null){
        var email = approve.email;
        var registerId = approve.registerId;
        var os = approve.os;
        Approve.remove({ email:email },function(err){
          if (err){
            console.log('destroy approve failed. err:'+err);
          } 
          User.remove({ $or:[{ email:email }, { registerId:registerId }] },function(err){
            if (err){
              console.log('destroy user failed. err:'+err);
            } 
            var newUser = new User({ email:email, registerId:registerId, os:os });
            newUser.save(function (err,user) {
              if (err){
                return next(err);
              }
              res.status(200).render('approve.html', { state: 'success ! Thank you using mykee.in' })
              return;
            });
          });
        });
      }else{
        res.status(200).render('approve.html', { state: 'expired. resend approve from mykee.in app again.' })
        return;
      }
    });
}
}

function sendEmailApprove(email,approveId,res){
  var domain;
  if(config.ssl){
    domain = config.ssldomain;
  }else{
    domain = config.domain;
  }
  var sendData = "Approve your account by this " 
  +"<a href=\""+domain+"/approve/"+approveId+"\">   Link   </a>"
  +" or from browser by " 
  +"address:   \""+domain+"/approve/"+approveId+"\"   "
  +" Not a mykee.in user ?  Ignore this mail."
  +" Thank you from mykee.in";
  var mailOptions = {
    from: "mykee.in support <mykee.in@gmail.com>",
    to: email,
    subject: "mykee.in account approve",
    html: sendData
  };
  transport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
      Approve.remove({ _id:approveId },function(err){
        if (err){
          console.log('destroy approve failed. err:'+err);
        } 
      });
      return res.jsonp({status:"send_approve_email_failed"});
    }else{
      var ans = { status:'not_approved' };
      return res.jsonp(ans);
    }
  });
};
