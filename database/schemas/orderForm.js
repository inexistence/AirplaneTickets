var mongoose = require('mongoose');
var BaseSchema = require('./baseschema');
var _ = require('underscore');
//订单数据结构
var OrderFormSchema = new mongoose.Schema(_.extend({
	orderDate:String,//订购日期
	hasPaid:Boolean,//是否付款
	flightId:String,//航班号
	userId:String,//用户id
	leaveDate:String//出发日期	
},BaseSchema.data));

//每次存储数据前都会调用这个方法
OrderFormSchema.pre('save', function(next){
	BaseSchema.preSave(this);
	next();
});

//静态函数
OrderFormSchema.statics = BaseSchema.statics;

module.exports = OrderFormSchema;