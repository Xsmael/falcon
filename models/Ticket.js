var mg = require('mongoose');
var Schema = mg.Schema;  

module.exports = mg.model('Ticket', new  Schema({
        from: String,
        to: String,
        round_trip: Boolean,
        seat_no: String,
        date_departure: String,
        date_return: String,
        traveller: String,
        misc: String,
        time: { type: Date, default: Date.now }
    })
);    






