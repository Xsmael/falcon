var mg = require('mongoose');
var Schema = mg.Schema;  

module.exports = mg.model('Vehicle', new  Schema({
        type: String,
        brand: String,
        model: String,
        numberplate: String,
        seats: Number,
        details: String
    })
);    






