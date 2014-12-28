var mongoose = require('mongoose');
var BaseSchema = require('./baseschema');
var _ = require('underscore');
//航班数据结构
var FlightSchema = new mongoose.Schema(_.extend({
		company: String,
		planeName:String,
		flyDate:String,
		arrDate:String,
		flyTime:String,
		flyAirport:String,
		arrAirport:String,
		fare:String,
		tax:String
},BaseSchema.data));

//每次存储数据前都会调用这个方法
FlightSchema.pre('save', function(next){
	BaseSchema.preSave(this);
	next();
});

//静态函数
FlightSchema.statics = BaseSchema.statics;

module.exports = FlightSchema;