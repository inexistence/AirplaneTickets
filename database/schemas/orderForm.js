var mongoose = require('mongoose'),Schema = mongoose.Schema;
var BaseSchema = require('./baseschema');
var _ = require('underscore');
//订单数据结构
var OrderFormSchema = new mongoose.Schema(_.extend({
	orderDate:     String, //订购日期
	// hasPaid:       Boolean,//是否付款
	flightId:      { type: Schema.Types.ObjectId, ref: 'Flight' }, //航班id
	userId:        { type: Schema.Types.ObjectId, ref: 'User' }, //用户id
	// leaveDate:     String, //出发日期
	level:         String, //舱位等级 first business economy
	fare:          String, //价格
	passengerInfo: Object, //乘客信息
	contactInfo:   Object  //联系信息
},BaseSchema.data));

//每次存储数据前都会调用这个方法
OrderFormSchema.pre('save', function(next){
	BaseSchema.preSave(this);
	next();
});

//静态函数
OrderFormSchema.statics = BaseSchema.statics;

module.exports = OrderFormSchema;