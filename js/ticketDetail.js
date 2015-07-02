
app.controller("ticketDetailCtrl", ['$scope', 'Util','Database',
function($scope, Util, Database) {
	var success = Util.getQueryString('success');
	if(success=='true'){
		alert('修改成功！');
	}else if (success=='false'){
		var msg = Util.getQueryString('msg');
		alert('修改失败！'+msg);
	}
}]);