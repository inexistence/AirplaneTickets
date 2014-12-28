var Models = require('./models/models');
var _ = require('underscore');

var Database = {};
Database.Query = function(className,query){
	this._id;
	this.className = className;
	this.limitNum = 100;
	this.skipNum = 0;
	this.equal = {};
	if(query){
		this._id = query._id;
		this.limitNum = query.limitNum;
		this.skipNum = query.skipNum;
		this.equal = query.equal;
		this.className = query.className;
	}
	this.equalTo = function(name,value){
		this.equal[name] = value;
	};
	this.limit = function(limit){
		this.limitNum = limit;
	};
	this.skip = function(skip){
		this.skipNum = skip;
	};
	this.find = function(callback){
		var Class = Models.getClass(className);
		if(Class===undefined){
			if(callback&&callback.error)
				callback.error({error:'can not find class '+className});
			return ;
		}

		Class.fetch(query,function(err,results){
			if(err){
				if(callback&&callback.error)
					callback.error({error:err,object:results});
				return ;
			}
			_.each(results,function(obj,index){
				var _obj = {};
				_obj.attributes = obj;
				_obj.className = query.className;
				results[index] = _obj;
			});
			if(callback&&callback.success)
				callback.success(results);
		});
	};
	this.get = function(id,callback){
		this._id = id;
		var Class = Models.getClass(className);
		if(Class===undefined){
			if(callback&&callback.error)
				callback.error({error:'can not find Class '+className})
			return ;
		}
		if(query._id===undefined){
			if (callback&&callback.error)
				callback.error({error:'can not find Object without id.'})
			return ;
		}
		Class.findById(query._id, function(err,result){
			if(err){
				if (callback&&callback.error)
					callback.error({error:err,object:result});
				return ;
			}
			if(callback&&callback.success)
				callback.success({className:className,attributes:result});
		});
	};

	this.count = function(callback){
		var Class = Models.getClass(className);
		if(Class===undefined){
			if(callback&&callback.error)
				callback.error({error:'can not find Class '+className});
			return ;
		}

		Class.count(query.equal, function(err,result){
			if(err){
				if(callback&&callback.error)
					callback.error({error:err,object:result});
				return ;
			}
			if(callback&&callback.success)
				callback.success({className:className,number:result});
		});
	}
};

Database.Object = function(className, obj){
	this.className = className;
	this.attributes = {};
	if(obj){
		this.attributes = _.extend(this.attributes,obj);
	}
	this.save = function(obj,callback){
		if(obj){
			this.attributes = _.extend(this.attributes,obj);
		}
		obj = this;
		
		var Class = Models.getClass(className);
		if(Class===undefined){
			if(callback&&callback.error)
				callback.error({error:'can not find Class '+className});
			return ;
		}
		var _obj;
		if(obj.attributes._id !== undefined) {
			Class.findById(obj.attributes._id, function(err,result){
				if(err){
					if(callback&&callback.error)
						callback.error({error:err,object:result});
					return ;
				}
				_obj = _.extend(result, obj.attributes);
				_obj.save(function(err,obj){
					if(err){
						if(callback&&callback.error)
							callback.error({error:err,object:obj});
						return ;
					}
					if(callback&&callback.success)
						callback.success({className:className,attributes:obj});
					return ;
				});
			});
		} else {
			_obj = new Class(obj.attributes);
			_obj.save(function(err,obj){
				if(err){
					if(callback&&callback.error)
						callback.error({error:err,object:obj});
					return ;
				}
				if(callback&&callback.success)
					callback.success({className:className,attributes:obj});
				return ;
			});
		}
	};
	this.set = function(key,value){
		this.attributes[key] = value;
	}
	this.get = function(key){
		return this.attributes[key];
	}
	this.delete = function(callback){
		var Class = Models.getClass(className);
		if(Class===undefined){
			if(callback&&callback.error)
				callback.error({error:'can not find Class '+className})
			return ;
		}
		var obj = this;
		if(obj.attributes._id !== undefined) {
			Class.remove({_id:obj.attributes._id},function(err,obj){
				if(err){
					if(callback&&callback.error)
						callback.error({error:err,object:obj})
					return ;
				}
				if(callback&&callback.success)
					callback.success({className:className,attributes:obj});
			});
		} else {
			if(callback&&callback.error)
				callback.error({error:'can not find Object without id.'})
			return ;
		}
	};
}


module.exports = Database;