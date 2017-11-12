var mg = require('mongoose');
var Schema = mg.Schema;  

module.exports = mg.model('Trip', new  Schema({
        from: String,
        to: String,
        time: String,
        vehicle: String,
        days: {
            monday: Number,
            tuesday: Number,
            wednesday: Number,
            thursday: Number,
            fridayday: Number,
            saturday: Number,
            sundday: Number,
        },
        date: Date
    })
);    

