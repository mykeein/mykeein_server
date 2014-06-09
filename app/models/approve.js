 var mongoose = require('mongoose')
 , Schema = mongoose.Schema
 , Types = mongoose.Types

 var contentEmails = {};

 contentEmails.en = "Approve your account by this <a href=\"%DOMAIN%/approve/%APPROVEID%\">Link</a> or from browser by address: \"%DOMAIN%/approve/%APPROVEID%\" Not a mykee.in user ? Ignore this mail. Thank you from mykee.in";

 contentEmails.ru =  "Утвердить вашу учетную запись по <a href=\"%DOMAIN%/approve/%APPROVEID%\">Ссылке</a> Или из браузера с помощью Адреса: \"%DOMAIN%/approve/%APPROVEID%\" Не mykee.in пользователь ? Игнорируйте это письмо. Спасибо от mykee.in";

 contentEmails.iw = "אשר את החשבון שלך על ידי <a href=\"%DOMAIN%/approve/%APPROVEID%\">קישור</a> או מדפדפן על ידי כתובת: \"%DOMAIN%/approve/%APPROVEID%\" לא משתמש mykee.in ? התעלם. תודה לך מ - mykee.in";

 contentEmails.he = "אשר את החשבון שלך על ידי <a href=\"%DOMAIN%/approve/%APPROVEID%\">קישור</a> או מדפדפן על ידי כתובת: \"%DOMAIN%/approve/%APPROVEID%\" לא משתמש mykee.in ? התעלם. תודה לך מ - mykee.in";

 var emailSubjects = {};

 emailSubjects.en = "mykee.in account approve";

 emailSubjects.ru =  "утверждение пользователя mykee.in";

 emailSubjects.iw = "אשר חשבון mykee.in";

 emailSubjects.he = "אשר חשבון mykee.in";

 var emailFroms = {};
 
 emailFroms.en = "mykee.in support <mykee.in@gmail.com>";

 emailFroms.ru =  "mykee.in поддержка <mykee.in@gmail.com>";

 emailFroms.iw = "mykee.in תמיכה <mykee.in@gmail.com>";

 emailFroms.he = "mykee.in תמיכה <mykee.in@gmail.com>";

 var ApproveSchema = new Schema({
 	email:{type:String, required: true},
 	registerId:{type:String, required: true},
 	os:{type:String, required: true},
 	updated:{type:Date, required: true, default:Date.now},  
 })

 ApproveSchema.index({email:1,registerId:1},{unique:false})
 ApproveSchema.statics = {
 	contentEmail: function(domain,approveId,ln){
 		// console.log(ln);
 		if(contentEmails[ln]==null){
 			return contentEmails["en"].replace(new RegExp("%APPROVEID%","gm"),approveId).replace(new RegExp("%DOMAIN%","gm"),domain);
 		}else{
 			return contentEmails[ln].replace(new RegExp("%APPROVEID%","gm"),approveId).replace(new RegExp("%DOMAIN%","gm"),domain);
 		}
 	},
 	emailSubject: function(ln){
 		if(emailSubjects[ln]==null){
 			return emailSubjects["en"];
 		}else{
 			return emailSubjects[ln];
 		}
 	},
 	emailFrom: function(ln){
 		if(emailFroms[ln]==null){
 			return emailFroms["en"];
 		}else{
 			return emailFroms[ln];
 		}
 	}
 }
 mongoose.model('Approve', ApproveSchema)