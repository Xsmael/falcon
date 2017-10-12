var mg = require('mongoose');
var Schema = mg.Schema;  

module.exports = mg.model('Journal', new  Schema({
        card_id: String,
        action: String,
        rf_reader: Number,
        time: { type: Date, default: Date.now }
    })
);    






