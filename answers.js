var express = require('express');
var router = express.Router();
var answers = require('../models/answer');
var tests = require('../models/test');
var session = require('express-session');

router.post('/answerSave', function(req, res){
        var count = 0;
        var givenAnswer =[];
        var test_id = [];
        var getAnswer = [];
        tests.getAdminQuestions(function(err, testid){
             testid =  JSON.stringify(testid);
             testid = JSON.parse(testid);
                for(var i in testid){
                        test_id.push(testid[i]._id);
                       
                }
                console.log(typeof(test_id)+'test_id----------'+test_id);
                getAnswer = req.body;
                console.log(typeof(getAnswer));
                console.log("getAnswer0-------------");
                console.log(getAnswer);

                for(var j in getAnswer)
                {
                        for(var k=0;k<test_id.length;k++){
                                console.log("test_id--------"+test_id[k]);
                                if(j ==test_id[k]){
                                        givenAnswer.push(getAnswer[j]);
                                        console.log("getAnswer[k].j--------"+getAnswer[j]);
                                }
                                
                        }
                        console.log("i---------"+j);
                }
                console.log(givenAnswer);
                var employeeid = req.session.username;
                var quizanswers=new answers({
                        employeeid : employeeid,
                        givenanswer : givenAnswer,
                        count : count
                     });
                     answers.givenanswer(quizanswers,function(req1,storedAnswers){
                        console.log("given answer got"+storedAnswers);
                        
                    });
        });

        tests.getAdminQuestions(function(req2,admin_questions){
                admin_questions = JSON.stringify(admin_questions);
                admin_questions = JSON.parse(admin_questions);
                var correct_ans = [];
                var given_ans = [];
                for(var i in admin_questions){
                    correct_ans.push(admin_questions[i].answer);
                    
                }
                console.log("correct_answers-----" + correct_ans);
                //console.log("response"+res);
                answers.getanswer(function(req3,aftersub){
                aftersub = JSON.stringify(aftersub);
                aftersub = JSON.parse(aftersub);
                console.log('given answer------------------'+aftersub);
                var user = req.session.username;
                for(var i in aftersub) {
                        if(user == aftersub[i].employeeid){
                        given_ans.push(aftersub[i].givenanswer);
                        }
                }
                
                console.log("the answeraftersubmit-----"+ given_ans);
                var full_answer = given_ans[0];
                console.log("fullanswer----------"+full_answer);
                full_answer = String(full_answer);
                var sep_answer_arr = full_answer.split(',');
                for(var j=0;j<correct_ans.length;j++){
                    console.log('given_ans[j]------'+typeof(sep_answer_arr[j]));
                    console.log('correct_ans[j]------'+typeof(correct_ans[j]));
                    console.log('given_ans[j]-------'+sep_answer_arr[j]);
                    console.log('correct_ans[j]-------'+correct_ans[j]);
                    if(correct_ans[j] == sep_answer_arr[j]){
                        
                         count++;
                         console.log("count=====" + count);
                    }
            }
                console.log("count=====" + count);
                var countMark = new answers({
                        employeeid : req.session.username,
                        count : count
                });
  //var emp={'employeeid':req.session.username};             

              answers.update(countMark,{upsert:true},function(err4,res1){
                if (err4) throw err4;
                console.log("succesfully saved");
                var answered_user =[];
                answers.getanswer(function(err5, allAnswer){
                        if(err5) throw err5;
                        console.log("allAnswer"+allAnswer);
                        for(var i in allAnswer){
                                answered_user.push(allAnswer[i].employeeid); 
                        }
                console.log("answered_user--------"+answered_user);
                req.session.testAnsPeople = answered_user;
                res.locals.testAnsPeoples = req.session.testAnsPeople || null;
                res.render('congrats', {count :count});
            });

            });
            
        });
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

