 var mongoose = require('mongoose')
 , Schema = mongoose.Schema
 , Types = mongoose.Types

 var ApproveSchema = new Schema({
 	email:{type:String, required: true},
 	registerId:{type:String, required: true},
 	updated:{type:Date, required: true, default:Date.now},  
 })

 ApproveSchema.index({email:1,registerId:1},{unique:false})

 mongoose.model('Approve', ApproveSchema)