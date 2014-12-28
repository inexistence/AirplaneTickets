var mongoose = require('mongoose');
//获取 schemas
var FlightSchema = require('../schemas/flight');


var Models = {};
//获取 Models
Models.Flight = mongoose.model('Flight',FlightSchema);



//根据className获取model
Models.getClass = function(className){
	if(className=='Flight')
		return Models.Flight;
}

module.exports = Models;