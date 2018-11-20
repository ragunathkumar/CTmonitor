var mongoose=require('mongoose');

var givenAnswerSchema=mongoose.Schema({
    employeeid: {
        type : String
    },
    questions: {
        type : String
    },
    givenanswer:{
         type: Array,
         index: true,
    },
    count:{
        type: String,
        index:true
     }
 });
 var givenAnswer=module.exports=mongoose.model('givenAnswer',givenAnswerSchema);
module.exports.givenanswer=function(givenquizanswer,callback)
{
    givenquizanswer.save(callback);
};
module.exports.getanswer=function(callback)
{
    givenAnswer.find(callback);
};
module.exports.count=function(count,callback)
{
    count.save(callback);
};
module.exports.update=function(data,true1,callback)
{
    
    var update = {
        __v: 0,
        $setOnInsert: {count :data.count},
        $set: {count :data.count}
        
    
      };
    givenAnswer.findOneAndUpdate({'employeeid': data.employeeid},{__v: 0,count :data.count},{upsert:true},callback);
    //console.log("query"+query);
    console.log("data"+data);
};