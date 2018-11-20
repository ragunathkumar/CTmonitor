var express = require('express');
var router = express.Router();
var session = require('express-session');
var tests = require('../models/test');
var Event = require('../models/event');
router.get('/createTest', ensureAuthenticated, function(req, res){
	res.render('createtest');
});

router.post('/testQuestions',function(req,res)
{   
    var full = req.body;
    var next = '';
    var submit = '';
    var questions=req.body.question;
    var options=[];
    var optiona=req.body.optiona;
    var optionb=req.body.optionb;
    var optionc=req.body.optionc;
    var optiond=req.body.optiond;
    options.push(optiona,optionb,optionc,optiond);
    var answer=req.body.correctanswer;
    next = req.body.next;
    submit = req.body.submit;
    
    console.log(full);



var newtest=new tests({
    questions:questions,
    options:options,
    answer:answer

});
if(submit == 'submit'){
    tests.storeAdminQuestions(newtest,function(req,res)
    {
    
        console.log("submitted");
        
    });
    res.redirect('/events/allEvent');
}
else if(next == 'next')
{
    tests.storeAdminQuestions(newtest,function(req,res)
    {
       
        console.log("next question");
        
    }); 
    
    res.render('createtest');
}
});

router.get('/displayTest', ensureAuthenticated, function(req, res){
    tests.getAdminQuestions(function(req, testquestions){
        console.log(testquestions);
        res.render('displayTest', { tests : testquestions});
    });
});
router.get('/displaystatus', ensureAuthenticated, function(req, rest){
    Event.status(function(req, stats){
        //console.log(testquestions);
        rest.render('displaystatus', { status : stats});
    });
});
function ensureAuthenticated(req, res, next){
	if(req.session.username){
		return next();
	} else{
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	} 
}

module.exports =router;



