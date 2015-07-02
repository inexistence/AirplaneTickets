/****************************
 * 前端的Database类
 * 包括Database.Query
 * 和Database.Object
 *
 * 由于使用了jquery的ajax,
 * 故使用前需要引用jQuery
 ****************************/


/**对jQuery的ajax的包装**/

var Ajax = {};
//config can be Object with 'method, url, data'
//callback should be Object with {success:function(data ..){...},error(data..){...}}
Ajax.http = function(config,callback){
	var data = null;
	if(config.data&&config.method=='POST'){
		data = 'data='+JSON.stringify(config.data);

	}else if(config.data&&config.method=='GET'){
		config.url+="?data="+JSON.stringify(config.data);
	}

	$.ajax({
		type:config.method,
		url:config.url,
		data:data,
		success:function(data, status, headers, config) {
			if(callback&&callback.success){
				callback.success(data, status, headers, config);
			}
		},
		error:function(data, status, headers, config){
			if(callback&&callback.error)
				callback.error(data, status, headers, config);
		}
	});
};

Ajax.post = function(url, data, callback) {
	Ajax.http({
		method:'POST',
		url:url,
		data:data
	},callback);
};
/**
 * url:String
 * params:Object
 */
Ajax.get = function(url, params, callback) {
	Ajax.http({
		method:'GET',
		url:url,
		data:params
	},callback);
};

/**对jQuery的ajax的包装 END**/


/*Database*/
var Database = {};
Database.Query = function(className){
	this._id;
	this.className = className;
	this.limitNum = 100;
	this.skipNum = 0;
	this.equal = {};
	this.sortCol = '-meta.updateAt';
	this.equalTo = function(name,value){
		this.equal[name] = value;
	};
	this.limit = function(limit){
		this.limitNum = limit;
	};
	this.skip = function(skip){
		this.skipNum = skip;
	};
	this.sort = function(sort){
		this.sortCol = sort;
	}
	this.find = function(callback){
		Ajax.get('/findData',this,{
			success:function(results){
				if(callback&&callback.success) {
					for(var index = 0; index < results.length; index++){
						var obj = results[index];
						var _obj = new Database.Object(obj.className,obj.attributes);
						results[index] = _obj;
					}
					callback.success(results);
				}
			},error:function(data,status){
				if(callback&&callback.error)
					callback.error(data,status);
			}
		});
	};
	this.get = function(id,callback){
		this._id = id;
		Ajax.get('/getData',this,{
			success:function(obj){
				if(callback&&callback.success) {
					var _obj = new Database.Object(obj.className,obj.attributes);
					obj = _obj;
					callback.success(obj);
				}
			},error:function(data,status){
				if(callback&&callback.error)
					callback.error(data,status);
			}
		});
	};

	this.count = function(callback){
		Ajax.get('/count',this,{
			success:function(obj){
				if(callback&&callback.success) {
					callback.success(obj);
				}
			},error:function(data,status){
				if(callback&&callback.error)
					callback.error(data,status);
			}
		});
	}
};

Database.Object = function(className, obj){
	this.className = className;
	this.attributes = {};
	if(obj){
		this.attributes = obj;
	}
	this.save = function(obj,callback){
		var that = this;
		if(obj){
			for(var key in obj){
				this.attributes[key] = obj[key];
			}
		}
		Ajax.post('/save',this,{
			success:function(obj){
				if(callback&&callback.success) {
					that.className = obj.className;
					that.attributes = obj.attributes;
					callback.success(that);
				}
			},error:function(data,status){
				if(callback&&callback.error)
					callback.error(data,status);
			}
		});
	};
	this.set = function(key,value){
		this.attributes[key] = value;
	}
	this.get = function(key){
		return this.attributes[key];
	}
	this.delete = function(callback){
		var that = this;
		Ajax.post('/removeById',this,{
			success:function(obj){
				if(callback&&callback.success) {
					that.attributes = obj.attributes;
					callback.success(that);
				}
			},error:function(data,status){
				if(callback&&callback.error)
					callback.error(data,status);
			}
		});
	};
}
/*Database END*/
