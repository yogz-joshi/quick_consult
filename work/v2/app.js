var express=require("express");
var app= express();
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var bodyParser=require("body-parser");
var passport=require("passport");
var users=require("./models/usersM");
var clinic=require("./models/clinicM");
var admin=require("./models/adminM");
var localStrategy=require("passport-local");
var passpoprtLocalMongoose=require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/all_clinics");

//var seedDB=require("./seed");
//seedDB();
app.use(require("express-session")({
    secret:"kitty is the best dog",
    resave:false,
    saveUninitialized:false
}));


app.use(bodyParser.urlencoded({ extended:true }));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(admin.authenticate()));
passport.serializeUser(admin.serializeUser());
passport.deserializeUser(admin.deserializeUser());



app.set("view engine","ejs");
app.use(express.static("public"));//to use custom style sheets from public folder.
app.use(bodyParser.urlencoded({entended:true}));

// *************************************************************************************************************8
//adding clinics using form(Only Render for admin login)
app.get("/clinic",isLoggedIn,function(req,res){
    clinic.find({},function(err,allClinic){
        if(err){
            console.log(err);
        }
        else
        {
            res.render("clinic",{clinic:allClinic});
        }
        
    });
});

app.post("/clinic",function(req,res){
        var name= req.body.cname;
        var sp=req.body.special;
        var open=req.body.openAt;
        var close=req.body.closeAt;
        var lhrs=req.body.lunchHrs;
        var lstarts=req.body.lunchAt;
        var lovers=req.body.lunchOverAt;
        var closed=0;
        var newClinic={name:name,speciality:sp,otime:open,ctime:close,lunch_hrs:lhrs,lunch_at:lstarts,lunch_over:lovers,date_close:closed};
        clinic.create(newClinic,function(err,clinics)
        {
            if(err){
            console.log(err);
            
        }else
        {   
            res.redirect("/clinic/new");
        }
    });
});
app.get("/clinic/new",isLoggedIn,function(req, res) {
    res.render("form1");
   
});
// **********************************************************************************************
// Home Page viewed to the User

app.get("/",function(req,res){
    clinic.find({},function(err,allClinic){
        if(err){
            console.log(err);
        }
        else
        {
            res.render("home",{clinic:allClinic});
        }
        
    });
});
// ******************************************************************************************
// deleting clinic
app.delete("/clinic/:id",function(req,res){
    clinic.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            console.log(err);
            
        }else
        {
            res.redirect("/clinic");
        }
    });
});


 
//  ******************************************************************************************************
//  making appointmnet
 
 
 app.post("/clinic/:id",function(req,res){
     clinic.findById(req.params.id,function(err,allclinics){
         if(err){
             res.redirect("clinic");
         }else{
            //  console.log(req.body.users.date);
            //  console.log(allclinics.date_close);
             var a=(req.body.users.date);
             var b=(allclinics.date_close);
             if(a === b){
                //  req.flash("err","The Clinic is Closed today.Plaese book tommorow!!");
                  res.redirect("/clinic/"+req.params.id+"/new");
                
             }else{
            
                    users.create(req.body.users,function(err,allusers){
                    if(err){
                     console.log("err");
                    }else{
                     allclinics.users.push(allusers);
                     allclinics.save();
                    //req.flash("success","Appointment Sucessful.SMS is sent toyour mobile number");
                     res.redirect("/");
                 }
             
             });
            
             }
         }
     });
 });
 
 app.get("/clinic/:id/new",function(req,res){
    clinic.findById(req.params.id,function (err,allClinic) {
        if(err){
            console.log(err);
        }else{
            res.render("form2",{clinics:allClinic});
        }
        
    });
    

});
// ************************************ ************************************* *************************************
app.post("/clinic/:id/record",function(req,res){
    clinic.findById(req.params.id).populate({
        path:'users',
        match :{$and: [{date : req.body.search},{time : req.body.timesearch}]}, 
        options:{ sort:{time :1}} }).exec(function(err,allclinic){
        if(err){
            console.log(err);
        }else{
           // console.log(allclinic);
            res.render("user_record",{clinics:allclinic});
        }
    });
});
// ****************************************************************************************************************
//View user record and update clinic close date..(Only for Admin Account)


app.get("/clinic/:id/record",isLoggedIn,function(req,res){
    clinic.findById(req.params.id).populate({path:'users',options:{ sort:{date : -1}}}).exec(function(err,allclinic){
        if(err){
            console.log(err);
        }else{
           // console.log(allclinic);
            res.render("user_record",{clinics:allclinic});
        }
    });
});
app.get("/clinic/:id/update",isLoggedIn,function(req,res){
     clinic.findById(req.params.id,function (err,allClinic) {
        if(err){
            console.log(err);
        }else{
            res.render("UpdateDate",{clinics:allClinic});
        }
        
    });
});
// to update the closed clinic date
app.put("/clinic/:id/update",function(req,res){
 
    
    clinic.findByIdAndUpdate(req.params.id,req.body.clinic,function(err,allclinic){
        if(err){
            console.log(err);
        }else{
            res.redirect("/clinic");
        }
    });
});
// ********************************************************************************************
// REGISTER ADMIN ROUTE
// app.get("/register",function(req,res){
//     res.render("signin");
// });

// app.post("/register",function(req,res){
//     admin.register(new admin({username:req.body.username}),req.body.password,function(err,admin){
//         if(err){
//             console.log(err);
//             return res.render('signin');
//         }
//         else{
//             passport.authenticate("local")(req,res,function(){
//                 res.redirect("/clinic");
//             });
//         }
//     });
// });
// ************************************************************************************************
// LOGIN ROUTES
app.get("/login",function(req,res){
    res.render("login");
});
//middleware
app.post("/login",passport.authenticate("local",{
    successRedirect:"/clinic",
    failureRedirect:"/login"
}),function(req,res){
    
});
// LOGOUT ROUTE
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
});
// Middleware for checking the active session/authentication
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
// **************************************************************************************************

// Running the Server
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started");
});