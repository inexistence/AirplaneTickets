var mongoose = require('mongoose');
var BaseSchema = require('./baseschema');
var _ = require('underscore');
//航班数据结构
var FlightSchema = new mongoose.Schema(_.extend({
		flightNumber: String,//航班号
		company: String,//公司
		leaveTime:String,//出发时间
		leaveDate:String,//出发日期
		arrTime:String,//到达时间
		arrDate:String,//到达日期
		leaveAirport:String,//出发机场
		leaveCity:String,//出发城市
		arrAirport:String,//到达机场
		arrCity:String,//到达城市
		businessFare:Number,//商务舱价格
		businessCount:Number,//商务舱票数
		firstFare:Number,//头等舱价格
		firstCount:Number,//头等舱数量
		economyFare:Number,//经济舱价格
		economyCount:Number,//经济舱数量		
},BaseSchema.data));

//每次存储数据前都会调用这个方法
FlightSchema.pre('save', function(next){
	//若票数没有赋值则默认为0
	if(FlightSchema.businessCount==null)
		FlightSchema.businessCount = "0";
	if(FlightSchema.economyCount==null)
		FlightSchema.economyCount = "0";
	if(FlightSchema.firstCount==null)
		FlightSchema.firstCount = "0";
	BaseSchema.preSave(this);
	next();
});

//静态函数
FlightSchema.statics = BaseSchema.statics;

module.exports = FlightSchema;