var mongoose = require('mongoose');
//获取 schemas
var FlightSchema = require('../schemas/flight');
var OrderFormSchema = require('../schemas/orderForm');
var UserSchema = require('../schemas/user');


var Models = {};
//获取 Models
Models.Flight = mongoose.model('Flight',FlightSchema);
Models.OrderForm = mongoose.model('OrderForm',OrderFormSchema);
Models.User = mongoose.model('User',UserSchema);



//根据className获取model
Models.getClass = function(className){
	if(className=='Flight')
		return Models.Flight;
	if(className=='User')
		return Models.User;
	if(className=='OrderForm')
		return Models.OrderForm;
}

module.exports = Models;