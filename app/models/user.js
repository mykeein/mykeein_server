 var mongoose = require('mongoose')
 , Schema = mongoose.Schema
 , Types = mongoose.Types

 var UserSchema = new Schema({
   username:{type:String, required: true},
   registerId:{type:String, required: true},
   updated:{type:Date, required: true, default:Date.now},  
 })

 UserSchema.index({username:1},{unique:true})
 UserSchema.index({registerId:1},{unique:true})

 mongoose.model('User', UserSchema)