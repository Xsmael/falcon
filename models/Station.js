var mg = require('mongoose');
var Schema = mg.Schema;  

module.exports = mg.model('Station', new  Schema({
        name: String,
        address: String,
        phone: String,
        destinations: [],
        geocoord: {
            long: String,
            lat: String
        },
        time: { type: Date, default: Date.now }
    })
);    






