var mongoose = require('mongoose');
var FlightSchema = require('../schemas/flight');
var Flight = mongoose.model('Flight',FlightSchema);

module.exports = Flight;