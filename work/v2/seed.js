var mongoose=require("mongoose");
var clinic=require("./models/clinicM");
var users=require("./models/usersM")
var data = [
    {
        name:"piyush",
        speciality:"bones",
        otime:"14",
        ctime:"15"
    },
    {
        name:"yogesh",
        speciality:"cardiac",
        otime:"4",
        ctime:"5"
    },
   
];
 
function seedDB(){


        // users.remove({}, function(err) {
        //     if(err){
        //         console.log(err);
        //     }
        //     console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                clinic.create(seed, function(err, clinic){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        users.create(
                            {name: "amit", 
                            age: "30",
                            date: "22-3-33",
                            time:"4",
                            mobile:"2232"
                            }, function(err, alluser){
                                if(err){
                                    console.log(err);
                                } else {
                                    clinic.users.push(alluser);
                                    clinic.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
  //      });
  
    //add a few comments
}
 
module.exports = seedDB;