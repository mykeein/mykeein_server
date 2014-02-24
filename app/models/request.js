 var mongoose = require('mongoose')
 , Schema = mongoose.Schema
 , Types = mongoose.Types

 var RequestSchema = new Schema({
   ip:{type:String, required: true},
   username:{type:String, required: true},
   updated:{type:Date, required: true, default:Date.now},
   responded: {type:Boolean,default:false},
   requestData:{
      dataType: {type:String, required: true},
      content:{type:String, required: false}
   }
})

 RequestSchema.index({ip:1},{unique:false})
 RequestSchema.index({username:1},{unique:false})
 RequestSchema.index({responded:1},{unique:false})

 RequestSchema.statics = {
   dataType: {
      block:"block",
      warn:"warn",
      response:"response",
      open:"open"
   }
}

mongoose.model('Request', RequestSchema)