 var mongoose = require('mongoose')
 , Schema = mongoose.Schema
 , Types = mongoose.Types

 var contentEmails = {};

 contentEmails.en = "Approve your account by this <a href=\"%DOMAIN%/approve/%APPROVEID%?ln=en\">Link</a> or from browser by address: \"%DOMAIN%/approve/%APPROVEID%?ln=en\" Not a mykee.in user ? Ignore this mail. Thank you from mykee.in";

 contentEmails.ru =  "Утвердите вашу учетную запись по <a href=\"%DOMAIN%/approve/%APPROVEID%?ln=ru\">Ссылке</a> Или из браузера с помощью Адреса: \"%DOMAIN%/approve/%APPROVEID%?ln=ru\" Не mykee.in пользователь ? Игнорируйте это письмо. Спасибо от mykee.in";

 contentEmails.iw = "אשר את החשבון שלך על ידי <a href=\"%DOMAIN%/approve/%APPROVEID%?ln=iw\">קישור</a> או מדפדפן על ידי כתובת: \"%DOMAIN%/approve/%APPROVEID%?ln=iw\" לא משתמש mykee.in ? התעלם. תודה לך מ - mykee.in";

 contentEmails.he = "אשר את החשבון שלך על ידי <a href=\"%DOMAIN%/approve/%APPROVEID%?ln=he\">קישור</a> או מדפדפן על ידי כתובת: \"%DOMAIN%/approve/%APPROVEID%?ln=he\" לא משתמש mykee.in ? התעלם. תודה לך מ - mykee.in";

 var emailSubjects = {};

 emailSubjects.en = "Approve mykee.in Account";

 emailSubjects.ru =  "Подтверждение пользователя mykee.in";

 emailSubjects.iw = "אשר חשבון mykee.in";

 emailSubjects.he = "אשר חשבון mykee.in";

 var emailFroms = {};
 
 emailFroms.en = "mykee.in support <mykee.in@gmail.com>";

 emailFroms.ru =  "mykee.in поддержка <mykee.in@gmail.com>";

 emailFroms.iw = "mykee.in תמיכה <mykee.in@gmail.com>";

 emailFroms.he = "mykee.in תמיכה <mykee.in@gmail.com>";

 var successMsgs = {};
 
 successMsgs.en = "Your account is now active, thank for you using mykee.in";

 successMsgs.ru = "Теперь ваш пользователь активен, спасибо что воспользовались mykee.in";

 successMsgs.iw = "החשבון שלך פעיל כעת, תודה שבחרתה להשתמש mykee.in";

 successMsgs.he = "החשבון שלך פעיל כעת, תודה שבחרתה להשתמש mykee.in";

 var expiredMsgs = {};
 
 expiredMsgs.en = "Approve request is expired, please login to mykee.in app and request an approval once again";

 expiredMsgs.ru = "Срок на ваш запрос истек, пожалуйста, войдите в mykee.in приложение и повторите запрос";
 
 expiredMsgs.iw = "אשור פג תוקף, אנא היכנס לאפליקצית mykee.in ותבקש/י אישור שוב";
 
 expiredMsgs.he = "אשור פג תוקף, אנא היכנס לאפליקצית mykee.in ותבקש/י אישור שוב";

 var ApproveSchema = new Schema({
 	email:{type:String, required: true},
 	registerId:{type:String, required: true},
 	os:{type:String, required: true},
 	updated:{type:Date, required: true, default:Date.now},  
 })

 ApproveSchema.index({email:1,registerId:1},{unique:false})
 ApproveSchema.statics = {
 	expiredMsg: function(ln){
 		if(expiredMsgs[ln]==null){
 			return expiredMsgs["en"];
 		}else{
 			return expiredMsgs[ln];
 		}
 	},
 	successMsg: function(ln){
 		if(successMsgs[ln]==null){
 			return successMsgs["en"];
 		}else{
 			return successMsgs[ln];
 		}
 	},
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