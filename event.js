var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
    createrName : {
        type : String
    },
    AcceptedMembers:{
        type: Array
    },
    DeclinedMebers:
    {
        type: Array
    },
    topic : {
        type : String
    },
    location : {
        type : String
    },
    room : {
        type : String
    },
    timings : {
        type: String
    },
    date : {
        type : String,
    },
    test : {
        type : String
    }
});


var Event = module.exports = mongoose.model('Event', EventSchema);

module.exports.createEvent = function(newEvent, callback){
        newEvent.save(callback);
};

module.exports.getAllEvents = function(callback){
    Event.find(callback);
};


module.exports.updateAcceptedStatus=function(data,true1,callback)
{
    
    var update = {
        __v: 0,
        $setOnInsert: {AcceptedMembers :data.AcceptedMembers},
        $set: {AcceptedMembers :data.AcceptedMembers}
        
    
      };
      Event.findOneAndUpdate({'topic': data.topic},{__v: 0,AcceptedMembers :data.AcceptedMembers},{upsert:true},callback);
    //console.log("query"+query);
    console.log("data"+data);
};

module.exports.updateDeclinedStatus=function(data,true1,callback)
{
    
    var update = {
        __v: 0,
        $setOnInsert: {DeclinedMebers :data.DeclinedMebers},
        $set: {DeclinedMebers :data.DeclinedMebers}
        
    
      };
      Event.findOneAndUpdate({'topic': data.topic},{__v: 0, DeclinedMebers :data.DeclinedMebers},{upsert:true},callback);
    //console.log("query"+query);
    console.log("data"+data);
};
module.exports.status=function(callback)
{
    Event.find(callback);
}