var mongoose = require('mongoose');

var Acc_DecSchema = mongoose.Schema({
    EventAcc_Dec : {
        type : Array
    },
    });


var acc_dec = module.exports = mongoose.model('Acc_Dec', Acc_DecSchema);

module.exports.getacc_dec = function(getAllDbEvent, callback){
    getAllDbEvent.save(callback);
};

module.exports.getDataAcc_dec = function(callback){
    acc_dec.find(callback);
};


