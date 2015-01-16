
app.controller("orderListCtrl", ['$scope', 'Util','Database',
function($scope, Util, Database) {
	var delSuccess = Util.getQueryString("success");
	if(delSuccess=='true'){
		alert('删除成功!');
	} else if(delSuccess=='false'){
		alert('删除失败!');
	}

	$scope.delOrder = function delOrder(id){
		$.ajax({
			type:'GET',
			url:'/user/delOrder/'+id,
			success:function(success){
				console.log(success);
				window.location.href = '/orderList?success='+success;
			},
			error:function(err){
				console.log(err)
				window.location.href = '/orderList?success='+err;
			}
		});
	}
}]);