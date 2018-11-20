var express = require('express');
var router = express.Router();
var session = require('express-session');
var Event = require('../models/event');
var acc_Dec = require('../models/acc_dec'); 

router.get('/createEvent', ensureAuthenticated, function(req, res){
	res.render('createevent');
});

router.post('/addEvent', function(req, res){
	var employeename = req.session.username;
	console.log(employeename +"employeename");
	var topic = req.body.event_topic;
	var timings = req.body.event_timings;
	var location = req.body.event_location;
	var meetingRoom = req.body.event_room_number;
	var date = req.body.event_date;
	var test = req.body.event_test;
	var newEvent = new Event({
		createrName : employeename,
        topic : topic,
		timings : timings,
		date : date,
		location : location,
		room : meetingRoom,
		test : test,
	});
	console.log('object'+typeof(newEvent));
	Event.createEvent(newEvent, function(err,event){
	if(err) throw err;

	console.log('event----' + event);
});


req.flash('success_msg', 'You have successfully created an Event');
Event.getAllEvents(function(err,allEvents){
	if(err) throw err;
	console.log('allEvents' + allEvents);
	// console.log('aruasdu');
	// res.render('index', {events : allEvents});
	if(test == 'Yes'){
		res.redirect('/tests/createTest');
	}
	else
	res.redirect('/events/allEvent');

});
});
router.get('/allEvent', ensureAuthenticated, function(req,res){
	Event.getAllEvents(function(err,allEvents){
			if(err) throw err;
			//console.log('allEvents' + allEvents);
			res.render('index', {users : allEvents});
	});

});

router.post('/getEvent', function(req,res,next){
	var full = req.body;
	var status=[];
	var Prev_accept=[];
	var Prev_decline=[];
	console.log(full);
	status.push(req.session.username);
	for(var k in full){
		status.push(full[k]);
		console.log("full"+ full[k]);
	}
	console.log("status"+ status);
	Event.getAllEvents(function(err,allEvent){
		if(err) throw err;
		console.log('allEvents' + allEvent);
		allEvent = JSON.stringify(allEvent);
		allEvent = JSON.parse(allEvent);
		for(var i in allEvent){
			
			for(var j in allEvent[i].AcceptedMembers){
				if(allEvent[i].topic == status[1]){
				Prev_accept.push(allEvent[i].AcceptedMembers[j]);
				
			}
		}
		}
		console.log("Prev_accept======="+Prev_accept);

	console.log("Prev_accept======="+Prev_accept);
	Prev_accept.push(status[0]);
	if(status[2] == "accept"){
	var Status = new Event({
		AcceptedMembers : Prev_accept,
		topic : status[1],
    });
	Event.updateAcceptedStatus(Status,{upsert:true},function(err,res1){
		if (err) throw err;
		console.log("succesfully saved");
		
	});
	}
	else if(status[2] == "decline"){
		for(var l in allEvent){
			
			for(var m in allEvent[l].DeclinedMebers){
				if(allEvent[l].topic == status[1]){
				Prev_decline.push(allEvent[l].DeclinedMebers[m]);
				
			}
		}
		}
		Prev_decline.push(status[0]);
		var Status_dec = new Event({
			DeclinedMebers :Prev_decline ,
			topic : status[1],
			});	
		Event.updateDeclinedStatus(Status_dec,{upsert:true},function(err,res){
			if (err) throw err;
			console.log("succesfully saved");
			//res.redirect('/index/');
		});
	}
	
	res.redirect('/');
	return next();
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

module.exports = router;

