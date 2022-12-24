const mongoose = require("mongoose");

const user = mongoose.Schema({
    name: {type:String, required:true},
    ph_num: {type:Number, required:true},
    email: {type:String, required:true},
    hobbies: {type:String, required:true}
});

module.exports = mongoose.model("user",user);