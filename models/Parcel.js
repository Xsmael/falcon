var mg = require('mongoose');
var Schema = mg.Schema;  

module.exports = mg.model('Parcel', new  Schema({
        from: String,
        to: String,
        content: String,
        sender: String,
        receiver: String,
        secret: String,
        time: { type: Date, default: Date.now }
    })
);    






