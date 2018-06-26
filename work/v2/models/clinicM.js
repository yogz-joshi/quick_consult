var mongoose=require("mongoose");
var clinicSchema= new mongoose.Schema({
    name: String,
    speciality: String,
    otime: String,
    ctime: String,
    lunch_hrs:String,
    lunch_at:String,
    lunch_over:String,
    date_close:String,
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "users"
        }]
});
module.exports = mongoose.model("clinic",clinicSchema);
