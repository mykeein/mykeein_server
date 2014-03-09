 var mongoose = require('mongoose')
 , Schema = mongoose.Schema
 , Types = mongoose.Types

 var UserSchema = new Schema({
 	email:{type:String, required: true},
 	registerId:{type:String, required: true},
 	os:{type:String, required: true},
 	updated:{type:Date, required: true, default:Date.now},  
 })

 UserSchema.index({email:1,registerId:1},{unique:true})
 
 UserSchema.statics = {
 	os: {
 		android:"android",
 		ios:"ios"
 	}
 }

 mongoose.model('User', UserSchema)