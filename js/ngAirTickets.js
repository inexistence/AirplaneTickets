﻿var app = angular.module("airTicketsApp", []);
//通用函数
app.factory('Util', ['$window',
function(win) {
	var Util = {};
	
	return Util;
}]);
//http函数
app.factory('Http', ['$window','$http',
function(win, $http) {
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

//查询类
app.factory('Database', ['$window','Http',
function(win,Http) {
	var Database = {};
	Database.Query = function(className){
		this.id;
		this.className = className;
		this.limitNum = 100;
		this.skipNum = 0;
		this.equal = [];
		this.equalTo = function(name,value){
			var equalItem = {};
			equalItem[name] = value;
			this.equal.push(equalItem);
		};
		this.limit = function(limit){
			this.limitNum = limit;
		};
		this.skip = function(skip){
			this.skipNum = skip;
		};
		this.find = function(callback){
			Http.get('/findData',this,callback);
		};
		this.get = function(id,callback){
			this.id = id;
			Http.get('/getData',this,callback);
		};
	};
	
	return Database;
}]);