var express=require('express');
var router=express.Router();

var event=require('../models/event');
var count1=require('../models/answer');
router.get('/logouts', function(req,res){  
    res.render('adminlogin');
});  
router.get('/admindisplay', function(req,res){    
     var ad={};
     var employeeid=[];
     var count=[];
    event.getAllEvents(function(err,ret)
    {
        if(err) throw err;
        ad=ret;
        count1.getanswer(function(req9,counts)
        {
            for(var i in counts){
          employeeid.push(counts[i].employeeid);
          count.push(counts[i].count);
            }
        });
        res.render('adminui',{rest:ad,employeeid:employeeid,count:count});
    });
    
});
router.get('/adminse', function(req,res){
    res.render('adminlogin');
});
router.post('/adminse',function(req,res)
{
var username=req.body.username;
var password=req.body.password;
if(req.body.username=="vishnukumarkapilavaradhan" && req.body.password=="Qwerty.1")
{    req.session.adminname=req.body.username;
    res.redirect('/admin/admindisplay');
    req.flash('success_msg', 'Welcome to admin portal');
   
}
else{
  res.render('adminlogin');
  req.flash('error_msg', 'enter correct username and password');
}
});
function ensureAuthenticated(req, res, next){
	if(req.session.username){
		return next();
	} else{
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	} 
}

module.exports=router;