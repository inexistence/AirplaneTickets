var mongoose = require('mongoose');
//航班数据结构
var FlightSchema = new mongoose.Schema({
		company: String,
		planeName:String,
		flyDate:String,
		arrDate:String,
		flyTime:String,
		flyAirport:String,
		arrAirport:String,
		fare:String,
		tax:String,
		meta: {
			createAt: {
				type: Date,
				default: Date.now()
			},
			updateAt: {
				type: Date,
				default: Date.now()
			}
		}
});

//每次存储数据前都会调用这个方法
FlightSchema.pre('save', function(next){
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});

//静态函数
FlightSchema.statics = {
	fetch: function(q,cb) {
		if(q.equal===undefined){
			q.equal = {};
		}
		return this
		.find(q.equal)
		.skip(q.skipNum)
		.limit(q.limitNum)
		.sort('-meta.updateAt')
		.exec(cb);
	},
	findById: function(id, cb) {
		return this
		.findOne({_id:id})
		.exec(cb);
	}
};

module.exports = FlightSchema;