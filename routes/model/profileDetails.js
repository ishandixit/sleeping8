var mongoose = require('mongoose')


var signUpSchema = new mongoose.Schema({
    "firstName":{type:String},
    "lastName":{type:String},
    "userName":{type:String},
    "entityName":{type:String},
    "password":{type:String},
    "emailAddress":{type:String},
    "contactNumber":{type:Number},
    "alternateNumber":{type:Number},
    "GSTIN":{type:String,unique:true},
    "nameOfAuthRepresentative":{type:String},
    "artistIds":[{type:String}],
    "userId":{type:String,unique:true},
    "userType":{type:String,enum:["explorer","corporate","artist","agency"],default:"explorer"}
},{
    timestamps:true
})

var signUpModel = mongoose.model('profile_model',signUpSchema)

module.exports={
    "signUpModel":signUpModel
}