var mongoose=require("mongoose");
var usersSchema= new mongoose.Schema({
    name:String,
    age:String,
    date:String, 
    time:String,
    mobile:String
});
module.exports= mongoose.model("users",usersSchema);