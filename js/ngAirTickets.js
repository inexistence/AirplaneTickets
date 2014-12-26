var app = angular.module("airTicketsApp", []);
//通用函数
app.factory('Util', ['$window',
function(win) {
	var Util = {};
	
	return Util;
}]);
//ajax函数
app.factory('Ajax', ['$window',
function(win) {
	var Ajax = {};
	
	return Ajax;
}]);
