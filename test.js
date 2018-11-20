var mongoose = require('mongoose');

var adminQuestionsSchema = mongoose.Schema({
    questions :{
        type : String
    },
    options :{
        type : Array
    },
    answer :{
        type : String
    }
});

var test = module.exports = mongoose.model('adminTest', adminQuestionsSchema); 

module.exports.storeAdminQuestions = function(testQuestion, callback){
            testQuestion.save(callback);
};

module.exports.getAdminQuestions = function(callback){
            test.find(callback);
};


