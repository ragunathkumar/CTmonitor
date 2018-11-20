var express = require('express');
var router = express.Router();
var session = require('express-session');
var User = require('../models/user');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/register', function(req,res){
	res.render('register');
});

router.get('/login', function(req,res){
	res.render('login');
});

router.post('/register', function(req,res){
	var employeeid = req.body.employeeid;
	var password = req.body.password;
	var password2 = req.body.password2;
	var username = req.body.username;
	var email = req.body.email;
	var phonenumber = req.body.phonenumber;
	var domain = req.body.domain;

	req.checkBody('employeeid','employeeid is required!').notEmpty();
	req.checkBody('password','password is required!').notEmpty();
	req.checkBody('password2','password is required!').notEmpty();
	req.checkBody('password2','password does not match!').equals(req.body.password);
	req.checkBody('username','username is required!').notEmpty();
	req.checkBody('email','email is required!').notEmpty();
	req.checkBody('email','email is not valid!').isEmail();
	req.checkBody('phonenumber','phone number is required').notEmpty();
	req.checkBody('domain', 'domain is required').notEmpty();

	var errors = req.validationErrors();
	if(errors){
		res.render('register',{
			errors:errors
		});
	}
	else{
		var newUser = new User({
			employeeid : employeeid,
			password : password,
			password2 : password2,
			username : username,
			email : email,
			phonenumber : phonenumber,
			domain : domain,

			});

		User.createUser(newUser, function(err, user){
			if(err) throw err;

			console.log(user);
		});

		req.flash('success_msg', 'You are registered and now can login');

		res.redirect('/users/login');
	}
});

// passport.use(new LocalStrategy(
// 	function(employeeid, password, done){
// 		User.getUserByEmployeeid(employeeid, function(err, user){
// 			if(err) throw err;
// 			if(!user)
// 			{
// 				return done(null, false, {message:'Unknown user'});
// 			}
		
// 		User.comparePassword(password, user.password, function(err, isMatch){
// 			if(err) throw err;
// 			if(isMatch)
// 			{
// 				return done(null, user)
// 				console.log('123' + user);
// 			}
// 			else
// 			{
// 				return done(null, false, {message: 'Invalid password'});
// 			}
// 			});
// 		});
// 	}));

// passport.serializeUser(function(user, done){
// 	done(null, user.id);
// });

// passport.deserializeUser(function(id,done){
// 	User.getUserById(id, function(err, user){
// 		done(err, user);
// 	});
// });

router.post('/login', function(req, res){
	var employeeid = req.body.username;
	var password = req.body.password;

	var newUser = new User({
		employeeid : employeeid,
		password : password
	});
 	
 	User.getUserByEmployeeId(newUser, function(err, user){
 		if(err) throw err;
 			console.log(user+'user');
 		if (!user) {
			console.log('no user');
 			req.flash('error_msg', 'Unknown User');
 			res.redirect('/users/login');
 		}
		 else
		 {
				User.comparePassword(password, user.password, function(err, isMatch){
					console.log('ismatching'+isMatch);
					if(isMatch){
						req.flash('success_msg', 'You have successfully logged in');
						req.session.username= user.username;
						res.redirect('/');	
					}
					else
						{
							req.flash('error_msg', 'Invalid password');
							res.redirect('/users/login');	
						}
				});
		}
 	});
}
	//passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login', failureFlash:true})

	);

router.get('/logout', ensureAuthenticated, function(req, res){
	req.logout();
	console.log(req.session.username+'session');
	req.session.username=null;
	req.session.testAnsPeople=null;
	console.log(req.session.username+'session');
	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
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