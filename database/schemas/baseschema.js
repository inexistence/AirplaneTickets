//基本数据结构
var BaseSchema = {};
BaseSchema.data = {
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
};

//每次存储数据前都会调用这个方法
BaseSchema.preSave = function(schema){
	if(schema.isNew) {
		schema.meta.createAt = schema.meta.updateAt = Date.now();
	} else {
		schema.meta.updateAt = Date.now();
	}
};

//静态函数
BaseSchema.statics = {
	fetch: function(q,cb) {
		if(q.equal===undefined){
			q.equal = {};
		}
		return this
		.find(q.equal)
		.sort(q.sortCol)
		.skip(q.skipNum)
		.limit(q.limitNum)
		.exec(cb);
	},
	findById: function(id, cb) {
		return this
		.findOne({_id:id})
		.exec(cb);
	}
};

module.exports = BaseSchema;
