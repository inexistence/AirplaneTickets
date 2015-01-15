
app.controller("ticketDetailCtrl", ['$scope', 'Util','Database',
function($scope, Util, Database) {
	var success = Util.getQueryString('success');
	if(success=='true'){
		alert('修改成功！');
	}else if (success=='false'){
		alert('修改失败！');
	}
}]);