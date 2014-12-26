var mongoose = require('mongoose');
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
})

//每次存储数据前都会调用这个方法
FlightSchema.pre('save', function(next){
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next();
})

FlightSchema.statics = {
	fetch: function(cb) {
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb);
	},
	findById: function(id, cd) {
		return this
		.findOne({_id:id})
		.exec(cb);
	}
}

moudule.exports = FlightSchema;