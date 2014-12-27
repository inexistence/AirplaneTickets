var app = angular.module("airTicketsApp", []);
//通用函数
app.factory('Util', ['$window',
function(win) {
	var Util = {};
	
	return Util;
}]);

//underscore
app.factory('_', ['$window',
function(win){
	return win._;
}]);

//http函数
app.factory('Http', ['$window','$http','_',
function(win, $http, _) {
	var Http = {};
	
	//simple http like ajax by angular http
	//config can be Object with 'method, url, data, headers'
	//callback should be Object with {success:function(data ..){...},error(data..){...}}
	Http.http = function(config,callback){
		var data = null;
		if(config.data&&config.method=='POST'){
			data = 'data='+JSON.stringify(config.data);

		}else if(config.data&&config.method=='GET'){
			config.url+="?data="+JSON.stringify(config.data);
		}
		var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
		if(config.headers)
			headers = config.headers;

		$http({'method': config.method, 'url': config.url,'data':data,'headers': headers }).
		success(function(data, status, headers, config) { 
			if(callback&&callback.success){
				callback.success(data, status, headers, config);
			}
		}).
		error(function(data, status, headers, config) {
			if(callback&&callback.error)
				callback.error(data, status, headers, config);
		});
	};
	Http.post = function(url, data, callback) {
		Http.http({
			method:'POST',
			url:url,
			data:data
		},callback);
	};
	/*
	 * url:String
	 * params:Object
	 */
	Http.get = function(url, params, callback) {
		Http.http({
			method:'GET',
			url:url,
			data:params
		},callback);
	};

	return Http;
}]);

//数据库操作类
app.factory('Database', ['$window','Http',"_",
function(win,Http,_) {
	var Database = {};
	Database.Query = function(className){
		this._id;
		this.className = className;
		this.limitNum = 100;
		this.skipNum = 0;
		this.equal = {};
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
			Http.get('/findData',this,{
				success:function(results){
					if(callback&&callback.success) {
						_.each(results,function(obj,index){
							var _obj = new Database.Object(obj.className,obj.attributes);
							results[index] = _obj;
						});
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
			Http.get('/getData',this,{
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
			Http.get('/count',this,{
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
		if(obj){
			this.attributes = obj;
		}
		this.save = function(obj,callback){
			if(obj){
				this.attributes = obj;
			}
			Http.post('/save',this,{
				success:function(obj){
					if(callback&&callback.success) {
						this.attributes = obj.attributes;
						callback.success(this);
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
			Http.post('/removeById',this,{
				success:function(obj){
					if(callback&&callback.success) {
						this.attributes = obj.attributes;
						callback.success(this);
					}
				},error:function(data,status){
					if(callback&&callback.error)
						callback.error(data,status);
				}
			});
		};
	}
	
	return Database;
}]);